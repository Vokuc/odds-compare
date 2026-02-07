-- Leagues
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

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10),
  flag_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches
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

CREATE INDEX idx_matches_league_id ON matches(league_id);
CREATE INDEX idx_matches_kickoff_time ON matches(kickoff_time);
CREATE INDEX idx_matches_is_featured ON matches(is_featured);

-- Bookmakers
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

-- Odds
CREATE TABLE IF NOT EXISTS odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
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

CREATE INDEX idx_odds_match_id ON odds(match_id);
CREATE INDEX idx_odds_bookmaker_id ON odds(bookmaker_id);
CREATE INDEX idx_odds_market ON odds(market);

-- Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmaker_id UUID NOT NULL REFERENCES bookmakers(id),
  country VARCHAR(10) NOT NULL,
  url VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bookmaker_id, country)
);

-- Value Scores (cached calculations)
CREATE TABLE IF NOT EXISTS value_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  bookmaker_id UUID NOT NULL REFERENCES bookmakers(id),
  market VARCHAR(20) NOT NULL,
  value_percentage DECIMAL(5,2),
  value_level VARCHAR(20),
  implied_probability DECIMAL(5,4),
  market_average DECIMAL(5,2),
  recommendation TEXT,
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_value_scores_match_id ON value_scores(match_id);
CREATE INDEX idx_value_scores_bookmaker_id ON value_scores(bookmaker_id);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
