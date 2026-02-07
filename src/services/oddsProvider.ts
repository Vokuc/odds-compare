/**
 * Abstracted odds API service
 * Can be swapped with different providers (Rapid API, TheSportsDB, etc.)
 */

export interface RawOddsData {
  matchId: string;
  bookmakerId: string;
  market: '1X2' | 'OVER_UNDER' | 'BTTS';
  odds: {
    home?: number;
    draw?: number;
    away?: number;
    over?: number;
    under?: number;
  };
}

export interface OddsProvider {
  fetchOdds(matchIds: string[]): Promise<RawOddsData[]>;
  fetchLiveOdds(matchId: string): Promise<RawOddsData[]>;
  isHealthy(): Promise<boolean>;
}

export interface ExternalEvent {
  id: string;
  commence_time?: string;
  home_team?: string;
  away_team?: string;
  teams?: string[];
  sport_nice?: string;
}

/**
 * Mock implementation for MVP
 * Replace with real API integration
 */

import axios from 'axios';

const API_KEY = '20f8f43996984768ceb481470156a538';
const BASE_URL = 'https://api.the-odds-api.com/v4';

class OddsApiProvider implements OddsProvider {
  async fetchOdds(matchIds: string[]): Promise<RawOddsData[]> {
    try {
      const sport = 'soccer_epl'; // Example: Premier League
      const response = await axios.get(`${BASE_URL}/sports/${sport}/odds`, {
        params: {
          apiKey: API_KEY,
          regions: 'uk',
          markets: 'h2h',
        },
      });
      console.log('[OddsApiProvider] fetched events count:', Array.isArray(response.data) ? response.data.length : 0);
      if (Array.isArray(response.data) && response.data.length > 0) {
        try {
          console.log('[OddsApiProvider] sample event:', JSON.stringify(response.data[0], null, 2));
        } catch (e) {
          console.log('[OddsApiProvider] sample event (stringify failed)');
        }
      }
      const oddsData: RawOddsData[] = [];
      const includeAll = !matchIds || matchIds.length === 0;
      for (const event of response.data) {
        if (!includeAll && !matchIds.includes(event.id)) continue;
        if (includeAll) {
          console.log(`[OddsApiProvider] including event id=${event.id}`);
        } else {
          console.log(`[OddsApiProvider] event matched id=${event.id}`);
        }
        for (const bookmaker of event.bookmakers) {
          const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
          if (!h2hMarket) continue;
          oddsData.push({
            matchId: event.id,
            bookmakerId: bookmaker.key,
            market: '1X2',
            odds: {
              home: h2hMarket.outcomes.find(o => o.name === 'Home')?.price,
              draw: h2hMarket.outcomes.find(o => o.name === 'Draw')?.price,
              away: h2hMarket.outcomes.find(o => o.name === 'Away')?.price,
            },
          });
        }
      }
      console.log('[OddsApiProvider] mapped odds entries:', oddsData.length);
      return oddsData;
    } catch (error) {
      console.error('Odds API error:', error);
      return [];
    }
  }

  async fetchLiveOdds(matchId: string): Promise<RawOddsData[]> {
    // No direct live odds endpoint; use fetchOdds and filter
    return this.fetchOdds([matchId]);
  }

  async isHealthy(): Promise<boolean> {
    try {
      await axios.get(`${BASE_URL}/sports`, { params: { apiKey: API_KEY } });
      return true;
    } catch {
      return false;
    }
  }

  // Fetch simplified events for the sport so we can render fallback matches
  async fetchEvents(sport: string = 'soccer_epl'): Promise<any[]> {
    try {
      const response = await axios.get(`${BASE_URL}/sports/${sport}/odds`, {
        params: { apiKey: API_KEY, regions: 'uk', markets: 'h2h' },
      });
      const events: any[] = [];
      for (const ev of response.data) {
        const evt: ExternalEvent = ev as ExternalEvent;
        const home = evt.home_team || (Array.isArray(evt.teams) ? evt.teams[0] : 'Home');
        const away = evt.away_team || (Array.isArray(evt.teams) ? evt.teams[1] : 'Away');
        events.push({
          id: evt.id,
          kickoffTime: evt.commence_time ? new Date(evt.commence_time) : new Date(),
          homeTeam: { id: `${evt.id}-h`, name: home, code: (home || '').slice(0, 3).toUpperCase() },
          awayTeam: { id: `${evt.id}-a`, name: away, code: (away || '').slice(0, 3).toUpperCase() },
          league: { id: sport, code: 'EPL', name: evt.sport_nice || sport },
          status: 'UPCOMING',
          isFeatured: false,
        });
      }
      console.log('[OddsApiProvider] fetched events (mapped):', events.length);
      return events;
    } catch (err) {
      console.error('fetchEvents error:', err);
      return [];
    }
  }
}

// Singleton instance
let oddsProvider: OddsProvider = new OddsApiProvider();

export function setOddsProvider(provider: OddsProvider) {
  oddsProvider = provider;
}

export function getOddsProvider(): OddsProvider {
  return oddsProvider;
}
