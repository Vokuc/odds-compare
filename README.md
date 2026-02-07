# Football Odds Comparison & Value Finder Web App

A production-ready, full-stack web application for comparing football match odds across multiple bookmakers and identifying value betting opportunities. Built with **Next.js**, **PostgreSQL**, and optimized for affiliate monetization.

## 🎯 Key Features

### MVP (Current)
- ✅ **Odds Aggregation**: Compare odds from multiple bookmakers
- ✅ **Value Scoring**: Transparent, explainable value calculation
- ✅ **Multi-Market Support**: 1X2, Over/Under 2.5, BTTS
- ✅ **Homepage**: Featured matches and value picks
- ✅ **League Pages**: Browse fixtures by competition
- ✅ **Admin Dashboard**: Manage leagues, bookmakers, and featured matches
- ✅ **Affiliate Links**: Geo-based bet routing with click tracking
- ✅ **Responsive Design**: Mobile-first UI with Tailwind CSS
- ✅ **SEO-Ready**: Server-side rendering, meta tags, structured data

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS |
| **Backend** | Node.js, Next.js API Routes |
| **Database** | PostgreSQL with migrations |
| **Deployment** | Vercel-ready |

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- **PostgreSQL 14+**

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/odds_comparison
ODDS_API_KEY=your_api_key
NODE_ENV=development
DEFAULT_COUNTRY=NG
```

Run migrations:

```bash
curl http://localhost:3000/api/migrations -X POST
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # API routes (fixtures, bookmakers, migrations)
│   ├── admin/                # Admin dashboard
│   ├── league/               # League pages
│   ├── match/                # Match detail pages
│   ├── how-it-works/         # Educational content
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # Reusable UI components
├── services/                 # Database & business logic
├── lib/                      # Utilities (value calculation)
├── db/                       # Database config & migrations
└── types/                    # TypeScript types
```

## 💡 Value Calculation

**Implied Probability = 1 / Decimal Odds**

**Value % = (Your Odds / Market Average - 1) × 100**

**Value Levels:**
- HIGH: +5% or better (🚀)
- MEDIUM: +1% to +5% (✓)
- LOW: Below +1% (-)

## 🔗 API Endpoints

- `GET /api/fixtures` - Upcoming matches
- `GET /api/bookmakers` - Active bookmakers
- `POST /api/migrations` - Database setup

## 🔐 Compliance

✅ Responsible gambling notices  
✅ 18+ disclaimer  
✅ Affiliate disclosure  
✅ No user data collection (MVP)  

## 📈 Monetization

- Affiliate links with tracking
- Commission from bookmakers
- Featured match placement

## 🚀 Deployment

```bash
vercel deploy
```

Set `DATABASE_URL` in Vercel environment variables.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL](https://www.postgresql.org/docs)

---

**Status:** MVP Ready for Testing  
**Last Updated:** February 2026


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
