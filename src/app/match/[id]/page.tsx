export default function MatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Match Details</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Home Team</h2>
            <p className="text-sm text-gray-600 mt-1">Match ID: {params.id}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-600">VS</p>
            <p className="text-sm text-gray-600 mt-2">Kick-off: Time TBD</p>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Away Team</h2>
            <p className="text-sm text-gray-600 mt-1">League: TBD</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">1X2 Odds</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Loading odds...</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Over/Under 2.5</h3>
          <div className="space-y-2">
            <p className="text-gray-600">Loading odds...</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <p className="text-blue-900">
          <strong>Note:</strong> Live odds integration coming soon. This is a placeholder for
          match details and odds comparison.
        </p>
      </div>
    </div>
  );
}
