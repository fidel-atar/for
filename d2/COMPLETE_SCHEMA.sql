-- ===================================================================
-- COMPLETE SUPABASE SCHEMA FOR MAURITANIA FOOTBALL APP
-- Copy and paste this entire SQL into your Supabase SQL Editor
-- ===================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================================
-- TEAMS TABLE
-- ===================================================================
CREATE TABLE teams (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    logo_url text,
    founded_year integer,
    founding_date date,
    city text,
    coach text,
    primary_color text DEFAULT '#1e3c72',
    secondary_color text DEFAULT '#2a5298',
    stadium text,
    division text,
    team_status text DEFAULT 'active',
    website text,
    captain text,
    wins integer DEFAULT 0,
    draws integer DEFAULT 0,
    losses integer DEFAULT 0,
    goals_scored integer DEFAULT 0,
    goals_conceded integer DEFAULT 0,
    achievements jsonb DEFAULT '[]'::jsonb,
    staff jsonb DEFAULT '[]'::jsonb,
    banner_image text,
    team_photos jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- PLAYERS TABLE
-- ===================================================================
CREATE TABLE players (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    position text,
    age integer,
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    photo_url text,
    biography text,
    stats jsonb DEFAULT '{}'::jsonb,
    jersey_number integer,
    date_of_birth date,
    height decimal(5,2),
    weight decimal(5,2),
    nationality text DEFAULT 'MR',
    preferred_foot text DEFAULT 'right',
    contract_start date,
    contract_end date,
    market_value decimal(15,2),
    player_status text DEFAULT 'active',
    is_captain boolean DEFAULT false,
    appearances integer DEFAULT 0,
    goals integer DEFAULT 0,
    assists integer DEFAULT 0,
    yellow_cards integer DEFAULT 0,
    red_cards integer DEFAULT 0,
    clean_sheets integer DEFAULT 0,
    minutes_played integer DEFAULT 0,
    attributes jsonb DEFAULT '{
        "pace": 5,
        "shooting": 5,
        "passing": 5,
        "dribbling": 5,
        "defending": 5,
        "physical": 5,
        "technique": 5,
        "tactical": 5,
        "mental": 5
    }'::jsonb,
    social_media jsonb DEFAULT '{
        "instagram": "",
        "twitter": "",
        "facebook": ""
    }'::jsonb,
    gallery jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- NEWS TABLE
-- ===================================================================
CREATE TABLE news (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    author text,
    image_url text,
    is_featured boolean DEFAULT false,
    excerpt text,
    category text,
    tags jsonb DEFAULT '[]'::jsonb,
    status text DEFAULT 'published',
    publish_date timestamp with time zone DEFAULT timezone('utc'::text, now()),
    is_breaking_news boolean DEFAULT false,
    seo_title text,
    seo_description text,
    seo_keywords text,
    social_media_title text,
    social_media_description text,
    related_articles jsonb DEFAULT '[]'::jsonb,
    gallery jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- MATCHES TABLE
-- ===================================================================
CREATE TABLE matches (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    home_team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    date date NOT NULL,
    match_time time,
    venue text,
    competition text,
    home_score integer DEFAULT 0,
    away_score integer DEFAULT 0,
    status text DEFAULT 'scheduled',
    referee text,
    attendance integer,
    season text,
    match_day integer,
    is_featured boolean DEFAULT false,
    match_description text,
    highlights text,
    match_stats jsonb DEFAULT '{
        "homePossession": 50,
        "awayPossession": 50,
        "homeShots": 0,
        "awayShots": 0,
        "homeShotsOnTarget": 0,
        "awayShotsOnTarget": 0,
        "homeCorners": 0,
        "awayCorners": 0,
        "homeFouls": 0,
        "awayFouls": 0,
        "homeYellowCards": 0,
        "awayYellowCards": 0,
        "homeRedCards": 0,
        "awayRedCards": 0,
        "homeOffsides": 0,
        "awayOffsides": 0
    }'::jsonb,
    events jsonb DEFAULT '[]'::jsonb,
    cover_image text,
    gallery jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- SHOP CATEGORIES TABLE
-- ===================================================================
CREATE TABLE shop_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- SHOP ITEMS TABLE
-- ===================================================================
CREATE TABLE shop_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price decimal(10,2) NOT NULL,
    category_id uuid REFERENCES shop_categories(id) ON DELETE CASCADE,
    image_url text,
    stock_quantity integer DEFAULT 0,
    is_available boolean DEFAULT true,
    product_status text DEFAULT 'active',
    is_featured boolean DEFAULT false,
    discount_price decimal(10,2),
    weight decimal(8,2),
    sku text,
    tags jsonb DEFAULT '[]'::jsonb,
    barcode text,
    meta_title text,
    meta_description text,
    has_promotion boolean DEFAULT false,
    promotion_start_date date,
    promotion_end_date date,
    has_variants boolean DEFAULT false,
    variants jsonb DEFAULT '[]'::jsonb,
    product_images jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================================
-- ENABLE ROW LEVEL SECURITY
-- ===================================================================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- CREATE POLICIES FOR PUBLIC READ ACCESS
-- ===================================================================
CREATE POLICY "Public teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Public players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Public news are viewable by everyone" ON news FOR SELECT USING (true);
CREATE POLICY "Public matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Public shop categories are viewable by everyone" ON shop_categories FOR SELECT USING (true);
CREATE POLICY "Public shop items are viewable by everyone" ON shop_items FOR SELECT USING (true);

-- ===================================================================
-- CREATE POLICIES FOR ADMIN OPERATIONS
-- ===================================================================
CREATE POLICY "Admin can do everything on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Admin can do everything on players" ON players FOR ALL USING (true);
CREATE POLICY "Admin can do everything on news" ON news FOR ALL USING (true);
CREATE POLICY "Admin can do everything on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Admin can do everything on shop_categories" ON shop_categories FOR ALL USING (true);
CREATE POLICY "Admin can do everything on shop_items" ON shop_items FOR ALL USING (true);

-- ===================================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ===================================================================
CREATE INDEX teams_name_idx ON teams(name);
CREATE INDEX teams_status_idx ON teams(team_status);
CREATE INDEX players_team_id_idx ON players(team_id);
CREATE INDEX players_position_idx ON players(position);
CREATE INDEX players_status_idx ON players(player_status);
CREATE INDEX news_created_at_idx ON news(created_at DESC);
CREATE INDEX news_featured_idx ON news(is_featured);
CREATE INDEX news_status_idx ON news(status);
CREATE INDEX news_category_idx ON news(category);
CREATE INDEX matches_date_idx ON matches(date);
CREATE INDEX matches_status_idx ON matches(status);
CREATE INDEX matches_home_team_idx ON matches(home_team_id);
CREATE INDEX matches_away_team_idx ON matches(away_team_id);
CREATE INDEX shop_items_category_id_idx ON shop_items(category_id);
CREATE INDEX shop_items_available_idx ON shop_items(is_available);
CREATE INDEX shop_items_featured_idx ON shop_items(is_featured);
CREATE INDEX shop_items_status_idx ON shop_items(product_status);

-- ===================================================================
-- CREATE FUNCTION TO UPDATE UPDATED_AT TIMESTAMP
-- ===================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- CREATE TRIGGERS FOR UPDATING UPDATED_AT
-- ===================================================================
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_shop_categories_updated_at BEFORE UPDATE ON shop_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_shop_items_updated_at BEFORE UPDATE ON shop_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ===================================================================
-- CREATE FUNCTION TO AUTOMATICALLY UPDATE PLAYER AGE
-- ===================================================================
CREATE OR REPLACE FUNCTION update_player_age()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.date_of_birth IS NOT NULL THEN
        NEW.age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.date_of_birth));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- CREATE TRIGGER TO UPDATE PLAYER AGE
-- ===================================================================
CREATE TRIGGER update_player_age_trigger BEFORE INSERT OR UPDATE ON players FOR EACH ROW EXECUTE PROCEDURE update_player_age();

-- ===================================================================
-- CREATE FUNCTION TO MANAGE TEAM CAPTAIN
-- ===================================================================
CREATE OR REPLACE FUNCTION manage_team_captain()
RETURNS TRIGGER AS $$
BEGIN
    -- If this player is being set as captain
    IF NEW.is_captain = true AND NEW.team_id IS NOT NULL THEN
        -- Remove captain status from other players in the same team
        UPDATE players SET is_captain = false WHERE team_id = NEW.team_id AND id != NEW.id;
        -- Update team captain field
        UPDATE teams SET captain = NEW.name WHERE id = NEW.team_id;
    END IF;
    
    -- If captain status is being removed
    IF OLD.is_captain = true AND NEW.is_captain = false THEN
        -- Clear team captain field if this was the captain
        UPDATE teams SET captain = null WHERE id = NEW.team_id AND captain = OLD.name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- CREATE TRIGGER TO MANAGE TEAM CAPTAIN
-- ===================================================================
CREATE TRIGGER manage_team_captain_trigger AFTER INSERT OR UPDATE ON players FOR EACH ROW EXECUTE PROCEDURE manage_team_captain();

-- ===================================================================
-- SUCCESS! ALL TABLES AND FUNCTIONS CREATED
-- =================================================================== 