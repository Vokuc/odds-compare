import Link from 'next/link';

export default async function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Find the Best Football Odds</h1>
          <p className="text-xl text-blue-100 mb-8">
            Compare odds across bookmakers. Get better value on every bet.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/leagues"
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Explore Leagues →
            </Link>
            <Link
              href="/how-it-works"
              className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition border border-blue-500"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Value Explanation */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">What is Betting Value?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">📊 Compare Odds</h3>
              <p className="text-gray-600">
                We aggregate odds from multiple bookmakers so you can see every available option
                at a glance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 Find Value</h3>
              <p className="text-gray-600">
                Our Value Score shows when a bookmaker's odds are better than the market average
                — transparent and explainable.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🤝 Trusted Partners</h3>
              <p className="text-gray-600">
                Bet through our trusted affiliate partners and support independent odds analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Matches */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Matches Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder - replace with real data */}
            <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-600">
              <p>Loading matches...</p>
            </div>
            <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-600">
              <p>Loading matches...</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Better Odds?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start comparing odds across all major leagues. Check today's fixtures and discover
            value bets.
          </p>
          <Link
            href="/leagues"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
          >
            Browse All Fixtures
          </Link>
        </div>
      </section>
    </div>
  );
}
