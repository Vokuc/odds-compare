import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Football Odds Comparison - Find Best Betting Value',
  description:
    'Compare football odds across multiple bookmakers. Find the best value bets with our transparent odds comparison tool.',
  keywords: [
    'football odds',
    'odds comparison',
    'betting value',
    'football betting',
    'best odds',
  ],
  openGraph: {
    title: 'Football Odds Comparison - Find Best Betting Value',
    description: 'Compare football odds and find the best betting value',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
