import { query } from '@/db/client';
import { League, Match, Team, Bookmaker, AffiliateLink, OddsData } from '@/types';
import { format, addDays, startOfDay } from 'date-fns';

/**
 * Fetch all active leagues
 */
export async function getLeagues(): Promise<League[]> {
  const result = await query(
    `SELECT id, code, name, country, season, is_active as "isActive",
      created_at as "createdAt", updated_at as "updatedAt"
     FROM leagues
     WHERE is_active = true
     ORDER BY name`
  );
  return result.rows as League[];
}

/**
 * Fetch upcoming matches grouped by league
 */
export async function getUpcomingMatches(daysAhead: number = 7): Promise<
  (Match & { homeTeam: Team; awayTeam: Team; league: League })[]
> {
  const startDate = startOfDay(new Date());
  const endDate = addDays(startDate, daysAhead);

  const result = await query(
    `SELECT 
      m.id, m.league_id as "leagueId", m.home_team_id as "homeTeamId", 
      m.away_team_id as "awayTeamId", m.kickoff_time as "kickoffTime",
      m.status, m.home_team_score as "homeTeamScore", 
      m.away_team_score as "awayTeamScore", m.is_featured as "isFeatured",
      m.created_at as "createdAt", m.updated_at as "updatedAt",
      ht.id as "homeTeam_id", ht.name as "homeTeam_name", ht.code as "homeTeam_code",
      ht.flag_url as "homeTeam_flagUrl",
      at.id as "awayTeam_id", at.name as "awayTeam_name", at.code as "awayTeam_code",
      at.flag_url as "awayTeam_flagUrl",
      l.id as "league_id", l.code as "league_code", l.name as "league_name",
      l.country as "league_country", l.season as "league_season",
      l.is_active as "league_isActive"
     FROM matches m
     JOIN teams ht ON m.home_team_id = ht.id
     JOIN teams at ON m.away_team_id = at.id
     JOIN leagues l ON m.league_id = l.id
     WHERE m.kickoff_time >= $1 AND m.kickoff_time <= $2
       AND m.status = 'UPCOMING'
     ORDER BY m.kickoff_time ASC`,
    [startDate, endDate]
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    leagueId: row.leagueId,
    homeTeamId: row.homeTeamId,
    awayTeamId: row.awayTeamId,
    kickoffTime: row.kickoffTime,
    status: row.status,
    homeTeamScore: row.homeTeamScore,
    awayTeamScore: row.awayTeamScore,
    isFeatured: row.isFeatured,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    homeTeam: {
      id: row.homeTeam_id,
      name: row.homeTeam_name,
      code: row.homeTeam_code,
      flagUrl: row.homeTeam_flagUrl,
    },
    awayTeam: {
      id: row.awayTeam_id,
      name: row.awayTeam_name,
      code: row.awayTeam_code,
      flagUrl: row.awayTeam_flagUrl,
    },
    league: {
      id: row.league_id,
      code: row.league_code,
      name: row.league_name,
      country: row.league_country,
      season: row.league_season,
      isActive: row.league_isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }));
}

/**
 * Fetch featured matches for homepage
 */
export async function getFeaturedMatches(limit: number = 5): Promise<
  (Match & { homeTeam: Team; awayTeam: Team; league: League })[]
> {
  const result = await query(
    `SELECT 
      m.id, m.league_id as "leagueId", m.home_team_id as "homeTeamId", 
      m.away_team_id as "awayTeamId", m.kickoff_time as "kickoffTime",
      m.status, m.home_team_score as "homeTeamScore", 
      m.away_team_score as "awayTeamScore", m.is_featured as "isFeatured",
      m.created_at as "createdAt", m.updated_at as "updatedAt",
      ht.id as "homeTeam_id", ht.name as "homeTeam_name", ht.code as "homeTeam_code",
      ht.flag_url as "homeTeam_flagUrl",
      at.id as "awayTeam_id", at.name as "awayTeam_name", at.code as "awayTeam_code",
      at.flag_url as "awayTeam_flagUrl",
      l.id as "league_id", l.code as "league_code", l.name as "league_name",
      l.country as "league_country", l.season as "league_season",
      l.is_active as "league_isActive"
     FROM matches m
     JOIN teams ht ON m.home_team_id = ht.id
     JOIN teams at ON m.away_team_id = at.id
     JOIN leagues l ON m.league_id = l.id
     WHERE m.is_featured = true AND m.status = 'UPCOMING'
     ORDER BY m.kickoff_time ASC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    leagueId: row.leagueId,
    homeTeamId: row.homeTeamId,
    awayTeamId: row.awayTeamId,
    kickoffTime: row.kickoffTime,
    status: row.status,
    homeTeamScore: row.homeTeamScore,
    awayTeamScore: row.awayTeamScore,
    isFeatured: row.isFeatured,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    homeTeam: {
      id: row.homeTeam_id,
      name: row.homeTeam_name,
      code: row.homeTeam_code,
      flagUrl: row.homeTeam_flagUrl,
    },
    awayTeam: {
      id: row.awayTeam_id,
      name: row.awayTeam_name,
      code: row.awayTeam_code,
      flagUrl: row.awayTeam_flagUrl,
    },
    league: {
      id: row.league_id,
      code: row.league_code,
      name: row.league_name,
      country: row.league_country,
      season: row.league_season,
      isActive: row.league_isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }));
}

/**
 * Fetch all active bookmakers
 */
export async function getBookmakers(): Promise<Bookmaker[]> {
  const result = await query(
    `SELECT id, name, logo, website, affiliate_supported as "affiliateSupported",
      is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
     FROM bookmakers
     WHERE is_active = true
     ORDER BY name`
  );
  return result.rows as Bookmaker[];
}

/**
 * Fetch affiliate links for a bookmaker by country
 */
export async function getAffiliateLinks(
  bookmakerId: string,
  country: string
): Promise<AffiliateLink | null> {
  const result = await query(
    `SELECT id, bookmaker_id as "bookmakerId", country, url, is_active as "isActive",
      created_at as "createdAt", updated_at as "updatedAt"
     FROM affiliate_links
     WHERE bookmaker_id = $1 AND (country = $2 OR country = 'INT') AND is_active = true
     LIMIT 1`,
    [bookmakerId, country]
  );
  return (result.rows[0] as AffiliateLink) || null;
}
