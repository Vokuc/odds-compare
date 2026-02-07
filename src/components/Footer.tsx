'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Disclaimer */}
        <div className="mb-8 pb-8 border-b border-gray-700">
          <h3 className="text-white font-semibold mb-2">⚠️ Responsible Gambling</h3>
          <p className="text-sm text-gray-400">
            Odds are subject to change without notice. We provide no guarantees of winning.
            If you or someone you know has a gambling problem, please seek help at{' '}
            <a href="#" className="text-blue-400 hover:underline">
              Gamblers Anonymous
            </a>
            . <strong>You must be 18+ to use this site.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/how-it-works" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Leagues</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/league/EPL" className="hover:text-white">
                  Premier League
                </a>
              </li>
              <li>
                <a href="/league/LA_LIGA" className="hover:text-white">
                  La Liga
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">support@oddscompare.com</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>
            &copy; {currentYear} OddsCompare. All rights reserved. Affiliate disclosure: We
            may earn commissions from bookmakers.
          </p>
        </div>
      </div>
    </footer>
  );
}
