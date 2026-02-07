import { getUpcomingMatches } from '@/services/repository';
import { getOddsProvider } from '@/services/oddsProvider';
import MatchCard from '@/components/MatchCard';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default async function LeaguePage({ params }: Props) {
  const resolvedParams = (await params) as { slug?: string };
  const slug = resolvedParams?.slug || '';
  let displayMatches: any[] = [];
  let odds: any[] = [];
  let serverError: string | null = null;

  try {
    // Fetch upcoming matches (next 14 days)
    const matches = await getUpcomingMatches(14);
    console.log('[LeaguePage] fetched matches count:', Array.isArray(matches) ? matches.length : 0);
    if (Array.isArray(matches) && matches.length > 0) {
      try {
        console.log('[LeaguePage] sample match:', JSON.stringify(matches[0], null, 2));
      } catch (e) {
        console.log('[LeaguePage] sample match (stringify failed)');
      }
    }

    // Filter by league code or name matching slug
    const filtered = matches.filter((m) => {
      const code = (m.league?.code || '').toString();
      const name = (m.league?.name || '').toString();
      return normalize(code) === slug || normalize(name).includes(slug);
    });

    displayMatches = filtered.length > 0 ? filtered : [];

    // Fetch odds for the matches (by match id). If no DB matches, fetch sport events directly.
    const oddsProvider = getOddsProvider() as any;
    if (displayMatches.length > 0) {
      const matchIds = displayMatches.map((m) => m.id.toString());
      odds = await oddsProvider.fetchOdds(matchIds);
    } else {
      // Map page slug to the-odds-api sport id so each league shows its own data
      const SPORT_MAP: Record<string, string> = {
        'epl': 'soccer_epl',
        'la-liga': 'soccer_spain_la_liga',
        'serie-a': 'soccer_italy_serie_a',
        'bundesliga': 'soccer_germany_bundesliga',
        'ligue-1': 'soccer_france_ligue_one',
        'world-cup-2026': 'soccer_world_cup'
      };
      const sport = SPORT_MAP[slug] || 'soccer_epl';
      const events = await oddsProvider.fetchEvents(sport);
      // Only keep events whose league/sport matches the requested slug where possible
      displayMatches = events.filter((e: any) => {
        // the mapped league name may be in e.league.name or sport_nice
        const leagueName = (e.league?.name || e.sport_nice || '').toLowerCase();
        return leagueName.includes(slug.replace('-', ' ')) || true;
      });
      const eventIds = displayMatches.map((e: any) => e.id.toString());
      odds = eventIds.length > 0 ? await oddsProvider.fetchOdds(eventIds) : [];
    }
    console.log('[LeaguePage] fetched odds count:', Array.isArray(odds) ? odds.length : 0);
    if (Array.isArray(odds) && odds.length > 0) {
      try {
        console.log('[LeaguePage] sample odds:', JSON.stringify(odds[0], null, 2));
      } catch (e) {
        console.log('[LeaguePage] sample odds (stringify failed)');
      }
    }
  } catch (err: any) {
    serverError = (err && err.message) || String(err);
    console.error('League page error:', err);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{slug.replace('-', ' ').toUpperCase()}</h1>

      {/* Debug / status banner */}
      {!process.env.ODDS_API_KEY && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          ODDS_API_KEY is not set — set it in <strong>.env.local</strong> (see .env.local.example).
        </div>
      )}

      <div className="mb-4 text-sm text-gray-600">
        Matches found: {displayMatches.length} · Odds entries: {odds.length}
      </div>

      {serverError ? (
        <div className="text-red-600">Server error: {serverError}</div>
      ) : displayMatches.length === 0 ? (
        <div>
          <p className="text-gray-600">No upcoming matches found for this league.</p>
          {!process.env.ODDS_API_KEY && (
            <p className="text-xs text-gray-500 mt-2">Tip: add your the-odds-api key to <strong>.env.local</strong> and restart the dev server.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayMatches.map((match) => {
            const matchOdds = odds.filter((o) => o.matchId === match.id.toString());
            return (
              <div key={match.id} className="bg-white p-4 rounded border">
                <MatchCard match={match} showLeague={false} />

                  <div className="mt-3">
                    <h4 className="text-sm font-semibold mb-2">Odds</h4>
                    {matchOdds.length === 0 ? (
                      <p className="text-xs text-gray-500">No odds available.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 border-b">
                              <th className="py-2">Bookmaker</th>
                              <th className="py-2">Home</th>
                              <th className="py-2">Draw</th>
                              <th className="py-2">Away</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              // compute best prices for this match
                              const prices = matchOdds.reduce(
                                (acc, cur) => {
                                  const h = typeof cur.odds.home === 'number' ? cur.odds.home : acc.home;
                                  const d = typeof cur.odds.draw === 'number' ? cur.odds.draw : acc.draw;
                                  const a = typeof cur.odds.away === 'number' ? cur.odds.away : acc.away;
                                  return {
                                    home: Math.max(acc.home ?? 0, h ?? 0),
                                    draw: Math.max(acc.draw ?? 0, d ?? 0),
                                    away: Math.max(acc.away ?? 0, a ?? 0),
                                  };
                                },
                                { home: 0, draw: 0, away: 0 } as { home: number; draw: number; away: number }
                              );

                              return matchOdds.map((o) => {
                                const homeVal = o.odds.home ?? null;
                                const drawVal = o.odds.draw ?? null;
                                const awayVal = o.odds.away ?? null;
                                return (
                                  <tr key={o.bookmakerId} className="border-b last:border-b-0">
                                    <td className="py-2 align-top font-medium text-gray-800">{o.bookmakerId}</td>
                                    <td className={`py-2 align-top ${homeVal === prices.home ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                                      {homeVal ?? '-'}
                                    </td>
                                    <td className={`py-2 align-top ${drawVal === prices.draw ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                                      {drawVal ?? '-'}
                                    </td>
                                    <td className={`py-2 align-top ${awayVal === prices.away ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                                      {awayVal ?? '-'}
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
