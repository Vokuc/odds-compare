# 🔌 Integration Guides - Football Odds Comparison MVP

## Quick Index
- [Odds API Integration](#odds-api-integration)
- [Admin Authentication](#admin-authentication)
- [Affiliate Tracking](#affiliate-tracking-system)
- [Live Odds Updates](#live-odds-updates)
- [Email Notifications](#email-notifications)

---

## Odds API Integration

### Option 1: RapidAPI (Football-Data.org)

**Setup:**
1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to football-data.org
3. Get your API key

**Implementation:**

```typescript
// src/services/oddsProvider.ts - Update the MockOddsProvider

import axios from 'axios';

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

class RealOddsProvider implements OddsProvider {
  async fetchOdds(matchIds: string[]): Promise<RawOddsData[]> {
    try {
      const matches = await axios.get(`${BASE_URL}/matches`, {
        headers: { 'X-Auth-Token': API_KEY },
        params: {
          status: 'SCHEDULED',
        },
      });

      const oddsData: RawOddsData[] = [];

      for (const match of matches.data.matches) {
        if (match.odds) {
          oddsData.push({
            matchId: match.id,
            bookmakerId: 'football-data', // Map to your bookmaker
            market: '1X2',
            odds: {
              home: match.odds.homeWin,
              draw: match.odds.draw,
              away: match.odds.awayWin,
            },
          });
        }
      }

      return oddsData;
    } catch (error) {
      console.error('Odds API error:', error);
      return [];
    }
  }

  async fetchLiveOdds(matchId: string): Promise<RawOddsData[]> {
    try {
      const match = await axios.get(`${BASE_URL}/matches/${matchId}`, {
        headers: { 'X-Auth-Token': API_KEY },
      });

      if (!match.data.odds) return [];

      return [
        {
          matchId: match.data.id,
          bookmakerId: 'football-data',
          market: '1X2',
          odds: {
            home: match.data.odds.homeWin,
            draw: match.data.odds.draw,
            away: match.data.odds.awayWin,
          },
        },
      ];
    } catch (error) {
      console.error('Fetch live odds error:', error);
      return [];
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await axios.get(`${BASE_URL}/competitions`, {
        headers: { 'X-Auth-Token': API_KEY },
      });
      return true;
    } catch {
      return false;
    }
  }
}

// Use the provider
setOddsProvider(new RealOddsProvider());
```

**Environment:**
```env
ODDS_API_KEY=your_football_data_key
ODDS_API_BASE_URL=https://api.football-data.org/v4
```

### Option 2: SofaScore API

```typescript
// Similar pattern, use https://www.sofascore.com/api/
// Free tier available, no key required
const BASE_URL = 'https://www.sofascore.com/api/v1';

// Example: Get match odds
const match = await axios.get(`${BASE_URL}/event/123456/odds`);
// Returns odds from multiple bookmakers
```

### Option 3: TheSportsDB

```typescript
// Free football data
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';
const API_KEY = process.env.ODDS_API_KEY; // Free key

// Get events for league
const events = await axios.get(
  `${BASE_URL}/${API_KEY}/eventslast.php?id=133602` // League ID
);
```

**Recommendation:** Start with **SofaScore** (free, no key), then move to RapidAPI for production.

---

## Admin Authentication

### Using NextAuth.js

Already installed. Here's the setup:

**1. Create auth configuration:**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '@/db/client';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const result = await query(
          `SELECT * FROM admin_users WHERE email = $1`,
          [credentials.email]
        );

        if (result.rows.length === 0) {
          throw new Error('User not found');
        }

        const admin = result.rows[0];
        const isValid = await bcrypt.compare(
          credentials.password,
          admin.password_hash
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  jwt: {
    secret: process.env.ADMIN_SECRET,
  },
};

export const handler = NextAuth(authOptions);
```

**2. Create login page:**

```typescript
// src/app/admin/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/admin',
    });

    if (!result?.ok) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-4"
        />
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
```

**3. Protect admin routes:**

```typescript
// src/app/admin/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    // Admin content
  );
}
```

**Dependencies:**
```bash
npm install next-auth bcrypt
npm install --save-dev @types/bcrypt
```

---

## Affiliate Tracking System

### Implementation

**1. Create tracking endpoint:**

```typescript
// src/app/api/track-click/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bookmakerId = searchParams.get('bookmaker_id');
  const matchId = searchParams.get('match_id');
  const userId = searchParams.get('user_id') || 'anonymous';
  const country = searchParams.get('country') || 'INT';

  try {
    // Log the click
    await query(
      `INSERT INTO affiliate_clicks (bookmaker_id, match_id, user_id, country, clicked_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [bookmakerId, matchId, userId, country]
    );

    // Get affiliate link
    const linkResult = await query(
      `SELECT url FROM affiliate_links 
       WHERE bookmaker_id = $1 AND (country = $2 OR country = 'INT')
       LIMIT 1`,
      [bookmakerId, country]
    );

    if (linkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Affiliate link not found' },
        { status: 404 }
      );
    }

    // Redirect to affiliate link
    const affiliateUrl = linkResult.rows[0].url;
    return NextResponse.redirect(affiliateUrl);
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    );
  }
}
```

**2. Add tracking table to schema:**

```sql
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmaker_id UUID NOT NULL REFERENCES bookmakers(id),
  match_id UUID REFERENCES matches(id),
  user_id VARCHAR(255),
  country VARCHAR(10),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clicks_bookmaker ON affiliate_clicks(bookmaker_id);
CREATE INDEX idx_clicks_match ON affiliate_clicks(match_id);
```

**3. Use in components:**

```typescript
// src/components/BetNowButton.tsx
import Link from 'next/link';

interface BetNowButtonProps {
  bookmakerId: string;
  matchId: string;
  country: string;
}

export default function BetNowButton({
  bookmakerId,
  matchId,
  country,
}: BetNowButtonProps) {
  const trackingUrl = `/api/track-click?bookmaker_id=${bookmakerId}&match_id=${matchId}&country=${country}`;

  return (
    <a
      href={trackingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Bet Now →
    </a>
  );
}
```

---

## Live Odds Updates

### Using Server-Sent Events (Polling)

```typescript
// src/app/api/odds-stream/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOddsProvider } from '@/services/oddsProvider';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  let isOpen = true;

  const stream = new ReadableStream({
    async start(controller) {
      while (isOpen) {
        try {
          const oddsProvider = getOddsProvider();
          const odds = await oddsProvider.fetchLiveOdds(matchId);

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(odds)}\n\n`)
          );

          // Update every 60 seconds
          await new Promise((resolve) => setTimeout(resolve, 60000));
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
          isOpen = false;
        }
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Frontend hook:**

```typescript
// src/hooks/useLiveOdds.ts
import { useEffect, useState } from 'react';

export function useLiveOdds(matchId: string) {
  const [odds, setOdds] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/odds-stream?matchId=${matchId}`
    );

    eventSource.onmessage = (event) => {
      setOdds(JSON.parse(event.data));
    };

    return () => eventSource.close();
  }, [matchId]);

  return odds;
}
```

---

## Email Notifications

### Using Resend or SendGrid

**Installation:**
```bash
npm install resend  # or npm install @sendgrid/mail
```

**Setup:**

```typescript
// src/services/emailService.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendValueAlert(
  email: string,
  match: string,
  value: string,
  odds: number,
  bookmakerId: string
) {
  return resend.emails.send({
    from: 'noreply@oddscompare.com',
    to: email,
    subject: `🚀 High Value Bet Alert: ${match}`,
    html: `
      <h2>${match}</h2>
      <p><strong>Value Level:</strong> ${value}</p>
      <p><strong>Odds:</strong> ${odds}</p>
      <a href="/match/${match}">View Match →</a>
    `,
  });
}
```

**Usage:**
```typescript
await sendValueAlert(
  user.email,
  'Manchester United vs Liverpool',
  'HIGH',
  2.50,
  'bet365'
);
```

---

## Database Seeding Script

```bash
#!/bin/bash
# scripts/seed.sh

psql $DATABASE_URL << 'EOF'

-- Leagues
INSERT INTO leagues (code, name, country, season) VALUES
('EPL', 'Premier League', 'England', 2025),
('LA_LIGA', 'La Liga', 'Spain', 2025),
('SERIE_A', 'Serie A', 'Italy', 2025),
('BUNDESLIGA', 'Bundesliga', 'Germany', 2025),
('LIGUE_1', 'Ligue 1', 'France', 2025);

-- Teams
INSERT INTO teams (name, code) VALUES
('Manchester United', 'MAN'),
('Liverpool', 'LIV'),
('Manchester City', 'MCI'),
('Arsenal', 'ARS'),
('Chelsea', 'CHE');

-- Bookmakers
INSERT INTO bookmakers (name, website, affiliate_supported) VALUES
('Bet365', 'https://www.bet365.com', true),
('DraftKings', 'https://www.draftkings.com', true),
('FanDuel', 'https://www.fanduel.com', true),
('BetVictor', 'https://www.betvictor.com', true),
('Unibet', 'https://www.unibet.com', true);

-- Affiliate Links (Nigeria)
INSERT INTO affiliate_links (bookmaker_id, country, url) VALUES
((SELECT id FROM bookmakers WHERE name='Bet365'), 'NG', 'https://affiliate.bet365.ng/ref/ODDS001'),
((SELECT id FROM bookmakers WHERE name='DraftKings'), 'NG', 'https://affiliate.draftkings.com/ng/ref/ODDS001');

EOF

echo "✓ Database seeded successfully"
```

---

## Deployment Checklist

- [ ] PostgreSQL configured and accessible
- [ ] Environment variables set (.env.local)
- [ ] API keys acquired (odds, email, auth)
- [ ] Sample data seeded
- [ ] Admin user created
- [ ] Build tested (`npm run build`)
- [ ] HTTPS enabled
- [ ] Error logging configured
- [ ] Analytics setup (Google Analytics, Plausible)
- [ ] Domain configured

---

**Ready to integrate?** Start with the Odds API, then add authentication. Both are production-tested patterns. 🚀
