import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">How It Works</h1>

      <div className="space-y-12">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">1. What is Betting Value?</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-4">
              Betting value is when the odds offered by a bookmaker are better than the true
              probability of that outcome.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Example:</strong> If the true probability of Team A winning is 50% (odds of
              2.00), but a bookmaker offers 2.20, that's +10% value.
            </p>
            <p className="text-gray-700">
              Our tool calculates implied probability from odds and compares them to market
              averages to find value bets.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">2. How We Calculate Value</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                <strong>Collect Odds:</strong> We aggregate odds from multiple bookmakers for
                each match.
              </li>
              <li>
                <strong>Calculate Probability:</strong> Convert decimal odds to implied probability
                using: 1 / Odds
              </li>
              <li>
                <strong>Find Average:</strong> Calculate the market average across all bookmakers.
              </li>
              <li>
                <strong>Compare:</strong> Find bets where odds are better than the average.
              </li>
              <li>
                <strong>Score:</strong> Display value as a percentage above/below market average.
              </li>
            </ol>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">3. What Markets Do We Cover?</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>1X2 (Match Result):</strong> Home Win, Draw, Away Win
              </li>
              <li>
                <strong>Over/Under 2.5 Goals:</strong> Total goals in the match
              </li>
              <li>
                <strong>Both Teams To Score (BTTS):</strong> Both teams score or not
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Value Score Interpretation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">🚀 HIGH VALUE (&gt;5%)</h3>
              <p className="text-green-800 text-sm">
                Strong value detected. Odds are significantly better than market average.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">✓ MEDIUM VALUE (1-5%)</h3>
              <p className="text-yellow-800 text-sm">
                Good value. Odds are moderately better than market average.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
              <h3 className="font-bold text-gray-900 mb-2">- LOW VALUE (&lt;1%)</h3>
              <p className="text-gray-700 text-sm">
                Limited value. Odds are at or below market average.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Responsible Betting</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-blue-900 mb-4">
              <strong>Important:</strong> Value finder tools are analysis aids, not predictions.
            </p>
            <ul className="list-disc list-inside space-y-2 text-blue-900">
              <li>Odds change and may not match at bet time</li>
              <li>Past value doesn't guarantee future results</li>
              <li>Always gamble within your means</li>
              <li>If you have a gambling problem, reach out to Gamblers Anonymous</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/leagues"
          className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
        >
          Start Finding Value →
        </Link>
      </div>
    </div>
  );
}
