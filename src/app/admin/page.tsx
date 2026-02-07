export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">Matches</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">Bookmakers</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">Leagues</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">Featured Picks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Manage Leagues</h2>
          <p className="text-gray-600 mb-4">Enable/disable leagues for public display</p>
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Manage Leagues
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Manage Bookmakers</h2>
          <p className="text-gray-600 mb-4">Update bookmaker names, logos, and affiliate links</p>
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Manage Bookmakers
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Feature Matches</h2>
          <p className="text-gray-600 mb-4">Choose matches to feature on the homepage</p>
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Feature Matches
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">View Analytics</h2>
          <p className="text-gray-600 mb-4">Monitor affiliate clicks and conversions</p>
          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            View Analytics
          </button>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <p className="text-yellow-900">
          <strong>Note:</strong> Admin features are placeholders. Full authentication and
          management interface coming soon.
        </p>
      </div>
    </div>
  );
}
