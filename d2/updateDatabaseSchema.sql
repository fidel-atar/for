-- ===================================================================
-- UPDATE DATABASE SCHEMA FOR MAURITANIA FOOTBALL APP
-- Run this script to add any missing columns to your existing database
-- ===================================================================

-- Add missing columns to teams table if they don't exist
DO $$ 
BEGIN
    -- Add banner_image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'banner_image') THEN
        ALTER TABLE teams ADD COLUMN banner_image text;
    END IF;
    
    -- Add team_photos column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'team_photos') THEN
        ALTER TABLE teams ADD COLUMN team_photos jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add team_status column if it doesn't exist (rename status if it exists)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'team_status') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'status') THEN
            ALTER TABLE teams RENAME COLUMN status TO team_status;
        ELSE
            ALTER TABLE teams ADD COLUMN team_status text DEFAULT 'active';
        END IF;
    END IF;
    
    -- Add founded_year column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'founded_year') THEN
        ALTER TABLE teams ADD COLUMN founded_year integer;
    END IF;
    
    -- Add founding_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'founding_date') THEN
        ALTER TABLE teams ADD COLUMN founding_date date;
    END IF;
    
    -- Add primary_color column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'primary_color') THEN
        ALTER TABLE teams ADD COLUMN primary_color text DEFAULT '#1e3c72';
    END IF;
    
    -- Add secondary_color column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'secondary_color') THEN
        ALTER TABLE teams ADD COLUMN secondary_color text DEFAULT '#2a5298';
    END IF;
    
    -- Add achievements column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'achievements') THEN
        ALTER TABLE teams ADD COLUMN achievements jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add staff column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'staff') THEN
        ALTER TABLE teams ADD COLUMN staff jsonb DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add wins column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'wins') THEN
        ALTER TABLE teams ADD COLUMN wins integer DEFAULT 0;
    END IF;
    
    -- Add draws column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'draws') THEN
        ALTER TABLE teams ADD COLUMN draws integer DEFAULT 0;
    END IF;
    
    -- Add losses column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'losses') THEN
        ALTER TABLE teams ADD COLUMN losses integer DEFAULT 0;
    END IF;
    
    -- Add goals_scored column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'goals_scored') THEN
        ALTER TABLE teams ADD COLUMN goals_scored integer DEFAULT 0;
    END IF;
    
    -- Add goals_conceded column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'goals_conceded') THEN
        ALTER TABLE teams ADD COLUMN goals_conceded integer DEFAULT 0;
    END IF;
    
    -- Add captain column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'captain') THEN
        ALTER TABLE teams ADD COLUMN captain text;
    END IF;
    
    -- Add website column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'website') THEN
        ALTER TABLE teams ADD COLUMN website text;
    END IF;
    
    -- Add stadium column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'stadium') THEN
        ALTER TABLE teams ADD COLUMN stadium text;
    END IF;
    
    -- Add division column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'division') THEN
        ALTER TABLE teams ADD COLUMN division text;
    END IF;
    
    -- Add coach column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'coach') THEN
        ALTER TABLE teams ADD COLUMN coach text;
    END IF;
    
    -- Add city column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'city') THEN
        ALTER TABLE teams ADD COLUMN city text;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'description') THEN
        ALTER TABLE teams ADD COLUMN description text;
    END IF;
    
    -- Add logo_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'logo_url') THEN
        ALTER TABLE teams ADD COLUMN logo_url text;
    END IF;
    
END $$;

-- Display the current teams table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'teams' 
ORDER BY ordinal_position; 