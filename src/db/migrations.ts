import { query } from './client';

const migrations = [
  {
    id: '001_initial_schema',
    up: `
      CREATE TABLE IF NOT EXISTS leagues (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        country VARCHAR(50),
        season INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10),
        flag_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        league_id UUID NOT NULL REFERENCES leagues(id),
        home_team_id UUID NOT NULL REFERENCES teams(id),
        away_team_id UUID NOT NULL REFERENCES teams(id),
        kickoff_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'UPCOMING',
        home_team_score INTEGER,
        away_team_score INTEGER,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_matches_league_id ON matches(league_id);
      CREATE INDEX IF NOT EXISTS idx_matches_kickoff_time ON matches(kickoff_time);

      CREATE TABLE IF NOT EXISTS bookmakers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        logo VARCHAR(255),
        website VARCHAR(255),
        affiliate_supported BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS odds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
        bookmaker_id UUID NOT NULL REFERENCES bookmakers(id),
        market VARCHAR(20) NOT NULL,
        odds_home DECIMAL(5,2),
        odds_draw DECIMAL(5,2),
        odds_away DECIMAL(5,2),
        odds_over DECIMAL(5,2),
        odds_under DECIMAL(5,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_odds_match_id ON odds(match_id);
      CREATE INDEX IF NOT EXISTS idx_odds_bookmaker_id ON odds(bookmaker_id);

      CREATE TABLE IF NOT EXISTS affiliate_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bookmaker_id UUID NOT NULL REFERENCES bookmakers(id) ON DELETE CASCADE,
        country VARCHAR(10) NOT NULL,
        url VARCHAR(500) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(bookmaker_id, country)
      );

      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
];

export async function runMigrations() {
  for (const migration of migrations) {
    try {
      const result = await query(`SELECT 1 FROM migrations WHERE id = $1`, [
        migration.id,
      ]);
      if (result.rows.length === 0) {
        await query(migration.up);
        await query(`INSERT INTO migrations (id) VALUES ($1)`, [migration.id]);
        console.log(`Migration ${migration.id} executed`);
      }
    } catch (error) {
      console.error(`Migration ${migration.id} failed:`, error);
      throw error;
    }
  }
}
