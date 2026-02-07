'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold text-blue-600">
              ⚽ OddsCompare
            </a>
            <div className="hidden md:flex gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/leagues" className="text-gray-600 hover:text-gray-900">
                Leagues
              </a>
              <a href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                How It Works
              </a>
            </div>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Admin
          </a>
        </div>
      </nav>
    </header>
  );
}
