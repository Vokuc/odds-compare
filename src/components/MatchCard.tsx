'use client';

import { Match, Team, League } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';

interface MatchCardProps {
  match: Match & { homeTeam: Team; awayTeam: Team; league: League };
  showLeague?: boolean;
}

export default function MatchCard({ match, showLeague = false }: MatchCardProps) {
  const kickoffTime = format(new Date(match.kickoffTime), 'HH:mm');
  const kickoffDate = format(new Date(match.kickoffTime), 'MMM dd');

  return (
    <Link href={`/match/${match.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer p-4">
        {showLeague && (
          <p className="text-sm text-gray-500 mb-2 font-semibold">{match.league.name}</p>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <p className="font-semibold text-gray-900">{match.homeTeam.name}</p>
            <p className="text-xs text-gray-500">{match.homeTeam.code}</p>
          </div>

          <div className="text-center min-w-fit">
            <p className="text-sm text-gray-600 font-medium">{kickoffTime}</p>
            <p className="text-xs text-gray-500">{kickoffDate}</p>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">{match.awayTeam.name}</p>
            <p className="text-xs text-gray-500">{match.awayTeam.code}</p>
          </div>
        </div>

        {match.isFeatured && (
          <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
    </Link>
  );
}
