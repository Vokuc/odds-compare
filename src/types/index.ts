// Core domain types

export type LeagueCode = 'EPL' | 'LA_LIGA' | 'SERIE_A' | 'BUNDESLIGA' | 'LIGUE_1' | 'WORLD_CUP';

export interface League {
  id: string;
  code: LeagueCode;
  name: string;
  country: string;
  season: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flagUrl?: string;
}

export interface Match {
  id: string;
  leagueId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoffTime: Date;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  homeTeamScore?: number;
  awayTeamScore?: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmaker {
  id: string;
  name: string;
  logo?: string;
  website: string;
  affiliateSupported: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OddsMarket = '1X2' | 'OVER_UNDER' | 'BTTS';

export interface OddsData {
  id: string;
  matchId: string;
  bookmakerId: string;
  market: OddsMarket;
  odds: {
    home?: number;      // 1X2: Home win, BTTS: Yes
    draw?: number;      // 1X2 only
    away?: number;      // 1X2: Away win, BTTS: No
    over?: number;      // Over/Under: Over 2.5
    under?: number;     // Over/Under: Under 2.5
  };
  lastUpdated: Date;
}

export interface AffiliateLink {
  id: string;
  bookmakerId: string;
  country: string; // e.g., 'NG' for Nigeria, 'INT' for international
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValueScore {
  matchId: string;
  bookmakerId: string;
  market: OddsMarket;
  valuePercentage: number;
  valueLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  impliedProbability: number;
  marketAverage: number;
  recommendation: string;
  calculatedAt: Date;
}

export interface MatchOddsView {
  match: Match & { homeTeam: Team; awayTeam: Team; league: League };
  odds: (OddsData & { bookmaker: Bookmaker })[];
  valueScores: ValueScore[];
}

export interface BestOdds {
  market: OddsMarket;
  home?: { bookmaker: string; odds: number; affiliate: string };
  draw?: { bookmaker: string; odds: number; affiliate: string };
  away?: { bookmaker: string; odds: number; affiliate: string };
  over?: { bookmaker: string; odds: number; affiliate: string };
  under?: { bookmaker: string; odds: number; affiliate: string };
}
