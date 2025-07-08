-- Supabase Schema for Mauritania Football App (Enhanced)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Teams table (Enhanced)
create table teams (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    logo_url text,
    founded_year integer,
    founding_date date,
    city text,
    coach text,
    primary_color text default '#1e3c72',
    secondary_color text default '#2a5298',
    stadium text,
    division text,
    team_status text default 'active', -- active, inactive, disbanded
    website text,
    captain text,
    wins integer default 0,
    draws integer default 0,
    losses integer default 0,
    goals_scored integer default 0,
    goals_conceded integer default 0,
    achievements jsonb default '[]'::jsonb,
    staff jsonb default '[]'::jsonb,
    banner_image text,
    team_photos jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Players table (Enhanced)
create table players (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    position text,
    age integer,
    team_id uuid references teams(id) on delete cascade,
    photo_url text,
    biography text,
    stats jsonb default '{}'::jsonb,
    jersey_number integer,
    date_of_birth date,
    height decimal(5,2), -- in cm
    weight decimal(5,2), -- in kg
    nationality text default 'MR',
    preferred_foot text default 'right', -- right, left, both
    contract_start date,
    contract_end date,
    market_value decimal(15,2),
    player_status text default 'active', -- active, injured, suspended, loaned, transferred
    is_captain boolean default false,
    appearances integer default 0,
    goals integer default 0,
    assists integer default 0,
    yellow_cards integer default 0,
    red_cards integer default 0,
    clean_sheets integer default 0,
    minutes_played integer default 0,
    attributes jsonb default '{
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
    social_media jsonb default '{
        "instagram": "",
        "twitter": "",
        "facebook": ""
    }'::jsonb,
    gallery jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- News table (Enhanced)
create table news (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    author text,
    image_url text,
    is_featured boolean default false,
    excerpt text,
    category text,
    tags jsonb default '[]'::jsonb,
    status text default 'published', -- published, draft, scheduled, archived
    publish_date timestamp with time zone default timezone('utc'::text, now()),
    is_breaking_news boolean default false,
    seo_title text,
    seo_description text,
    seo_keywords text,
    social_media_title text,
    social_media_description text,
    related_articles jsonb default '[]'::jsonb,
    gallery jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Matches table (Enhanced)
create table matches (
    id uuid default uuid_generate_v4() primary key,
    home_team_id uuid references teams(id) on delete cascade,
    away_team_id uuid references teams(id) on delete cascade,
    date date not null,
    match_time time,
    venue text,
    competition text,
    home_score integer default 0,
    away_score integer default 0,
    status text default 'scheduled', -- scheduled, live, completed, postponed, cancelled
    referee text,
    attendance integer,
    season text,
    match_day integer,
    is_featured boolean default false,
    match_description text,
    highlights text,
    match_stats jsonb default '{
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
    events jsonb default '[]'::jsonb,
    cover_image text,
    gallery jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shop categories table (Same as before)
create table shop_categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shop items table (Enhanced)
create table shop_items (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    category_id uuid references shop_categories(id) on delete cascade,
    image_url text,
    stock_quantity integer default 0,
    is_available boolean default true,
    product_status text default 'active', -- active, draft, out_of_stock
    is_featured boolean default false,
    discount_price decimal(10,2),
    weight decimal(8,2), -- in grams
    sku text,
    tags jsonb default '[]'::jsonb,
    barcode text,
    meta_title text,
    meta_description text,
    has_promotion boolean default false,
    promotion_start_date date,
    promotion_end_date date,
    has_variants boolean default false,
    variants jsonb default '[]'::jsonb,
    product_images jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for all tables
alter table teams enable row level security;
alter table players enable row level security;
alter table news enable row level security;
alter table matches enable row level security;
alter table shop_categories enable row level security;
alter table shop_items enable row level security;

-- Create policies for public read access
create policy "Public teams are viewable by everyone" on teams for select using (true);
create policy "Public players are viewable by everyone" on players for select using (true);
create policy "Public news are viewable by everyone" on news for select using (true);
create policy "Public matches are viewable by everyone" on matches for select using (true);
create policy "Public shop categories are viewable by everyone" on shop_categories for select using (true);
create policy "Public shop items are viewable by everyone" on shop_items for select using (true);

-- Create policies for admin operations (you can add authentication later)
create policy "Admin can do everything on teams" on teams for all using (true);
create policy "Admin can do everything on players" on players for all using (true);
create policy "Admin can do everything on news" on news for all using (true);
create policy "Admin can do everything on matches" on matches for all using (true);
create policy "Admin can do everything on shop_categories" on shop_categories for all using (true);
create policy "Admin can do everything on shop_items" on shop_items for all using (true);

-- Create indexes for better performance
create index teams_name_idx on teams(name);
create index teams_status_idx on teams(team_status);
create index players_team_id_idx on players(team_id);
create index players_position_idx on players(position);
create index players_status_idx on players(player_status);
create index news_created_at_idx on news(created_at desc);
create index news_featured_idx on news(is_featured);
create index news_status_idx on news(status);
create index news_category_idx on news(category);
create index matches_date_idx on matches(date);
create index matches_status_idx on matches(status);
create index matches_home_team_idx on matches(home_team_id);
create index matches_away_team_idx on matches(away_team_id);
create index shop_items_category_id_idx on shop_items(category_id);
create index shop_items_available_idx on shop_items(is_available);
create index shop_items_featured_idx on shop_items(is_featured);
create index shop_items_status_idx on shop_items(product_status);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating updated_at
create trigger update_teams_updated_at before update on teams for each row execute procedure update_updated_at_column();
create trigger update_players_updated_at before update on players for each row execute procedure update_updated_at_column();
create trigger update_news_updated_at before update on news for each row execute procedure update_updated_at_column();
create trigger update_matches_updated_at before update on matches for each row execute procedure update_updated_at_column();
create trigger update_shop_categories_updated_at before update on shop_categories for each row execute procedure update_updated_at_column();
create trigger update_shop_items_updated_at before update on shop_items for each row execute procedure update_updated_at_column();

-- Create function to automatically update player age from date_of_birth
create or replace function update_player_age()
returns trigger as $$
begin
    if new.date_of_birth is not null then
        new.age = extract(year from age(current_date, new.date_of_birth));
    end if;
    return new;
end;
$$ language plpgsql;

-- Create trigger to update player age
create trigger update_player_age_trigger before insert or update on players for each row execute procedure update_player_age();

-- Create function to ensure team captain is set correctly
create or replace function manage_team_captain()
returns trigger as $$
begin
    -- If this player is being set as captain
    if new.is_captain = true and new.team_id is not null then
        -- Remove captain status from other players in the same team
        update players set is_captain = false where team_id = new.team_id and id != new.id;
        -- Update team captain field
        update teams set captain = new.name where id = new.team_id;
    end if;
    
    -- If captain status is being removed
    if old.is_captain = true and new.is_captain = false then
        -- Clear team captain field if this was the captain
        update teams set captain = null where id = new.team_id and captain = old.name;
    end if;
    
    return new;
end;
$$ language plpgsql;

-- Create trigger to manage team captain
create trigger manage_team_captain_trigger after insert or update on players for each row execute procedure manage_team_captain(); 