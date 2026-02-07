import Link from 'next/link';

export default function LeaguesPage() {
  const leagues = [
    { title: 'Premier League (EPL)', desc: 'English Premier League', slug: 'epl' },
    { title: 'La Liga', desc: 'Spanish La Liga', slug: 'la-liga' },
    { title: 'Serie A', desc: 'Italian Serie A', slug: 'serie-a' },
    { title: 'Bundesliga', desc: 'German Bundesliga', slug: 'bundesliga' },
    { title: 'Ligue 1', desc: 'French Ligue 1', slug: 'ligue-1' },
    { title: 'FIFA World Cup 2026', desc: 'Coming Soon', slug: 'world-cup-2026' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Leagues</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leagues.map((l) => (
          <Link
            key={l.slug}
            href={`/league/${l.slug}`}
            className="block bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-900">{l.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{l.desc}</p>
          </Link>
        ))}
      </div>

      <p className="text-gray-600 text-center mt-8">Click a league to view upcoming matches and odds.</p>
    </div>
  );
}
