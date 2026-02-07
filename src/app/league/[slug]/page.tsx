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

      {serverError ? (
        <div className="text-red-600">Server error: {serverError}</div>
      ) : displayMatches.length === 0 ? (
        <p className="text-gray-600">No upcoming matches found for this league.</p>
      ) : (
        <div className="space-y-4">
          {displayMatches.map((match) => {
            const matchOdds = odds.filter((o) => o.matchId === match.id.toString());
            return (
              <div key={match.id} className="bg-white p-4 rounded border">
                <MatchCard match={match} showLeague={false} />

                <div className="mt-3">
                  <h4 className="text-sm font-semibold mb-1">Odds</h4>
                  {matchOdds.length === 0 ? (
                    <p className="text-xs text-gray-500">No odds available.</p>
                  ) : (
                    <div className="flex gap-3 flex-wrap">
                      {matchOdds.map((o) => (
                        <div key={o.bookmakerId} className="text-xs border rounded px-2 py-1">
                          <div className="font-medium">{o.bookmakerId}</div>
                          <div className="text-gray-700">H: {o.odds.home ?? '-'}</div>
                          <div className="text-gray-700">D: {o.odds.draw ?? '-'}</div>
                          <div className="text-gray-700">A: {o.odds.away ?? '-'}</div>
                        </div>
                      ))}
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
