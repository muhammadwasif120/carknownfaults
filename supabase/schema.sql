-- CKF Database Schema
-- Run this in Supabase SQL Editor

create table if not exists makes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  country text,
  description text,
  fault_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists models (
  id uuid primary key default gen_random_uuid(),
  make_id uuid references makes(id) on delete cascade,
  name text not null,
  slug text not null,
  year_start integer,
  year_end integer,
  description text,
  fault_count integer default 0,
  created_at timestamptz default now(),
  unique(make_id, slug)
);

create table if not exists variants (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade,
  name text not null,
  slug text not null,
  engine text,
  year_start integer,
  year_end integer,
  body_type text,
  transmission text,
  fuel_type text,
  description text,
  fault_count integer default 0,
  created_at timestamptz default now(),
  unique(model_id, slug)
);

create table if not exists faults (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references variants(id) on delete cascade,
  title text not null,
  slug text not null unique,
  summary text not null,
  symptoms text not null,
  cause text not null,
  fix text not null,
  severity text check (severity in ('minor','moderate','severe','critical')),
  mileage_start integer,
  mileage_end integer,
  repair_cost_low integer,
  repair_cost_high integer,
  diy_difficulty text check (diy_difficulty in ('easy','moderate','hard','professional_only')),
  affected_years text,
  obd_codes text[],
  search_vector tsvector,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists faults_search_idx on faults using gin(search_vector);

create or replace function update_fault_search() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.symptoms, '')), 'C');
  return new;
end;
$$ language plpgsql;

drop trigger if exists fault_search_update on faults;
create trigger fault_search_update
  before insert or update on faults
  for each row execute function update_fault_search();

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists fault_tags (
  fault_id uuid references faults(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (fault_id, tag_id)
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  variant text,
  year_range text,
  title text not null,
  description text not null,
  severity text,
  obd_codes text,
  submitter_email text,
  created_at timestamptz default now()
);

-- RLS
alter table makes enable row level security;
alter table models enable row level security;
alter table variants enable row level security;
alter table faults enable row level security;
alter table tags enable row level security;
alter table fault_tags enable row level security;
alter table submissions enable row level security;

-- Public read policies
create policy "Public read makes" on makes for select using (true);
create policy "Public read models" on models for select using (true);
create policy "Public read variants" on variants for select using (true);
create policy "Public read faults" on faults for select using (published = true);
create policy "Public read tags" on tags for select using (true);
create policy "Public read fault_tags" on fault_tags for select using (true);

-- Allow public fault submissions
create policy "Public insert submissions" on submissions for insert with check (true);

-- Helper function to update fault counts
create or replace function update_fault_counts() returns trigger as $$
begin
  if TG_OP = 'INSERT' and new.published = true then
    update variants set fault_count = fault_count + 1 where id = new.variant_id;
    update models set fault_count = fault_count + 1
      where id = (select model_id from variants where id = new.variant_id);
    update makes set fault_count = fault_count + 1
      where id = (select make_id from models where id = (select model_id from variants where id = new.variant_id));
  elsif TG_OP = 'UPDATE' and new.published != old.published then
    declare delta integer := case when new.published then 1 else -1 end;
    begin
      update variants set fault_count = fault_count + delta where id = new.variant_id;
      update models set fault_count = fault_count + delta
        where id = (select model_id from variants where id = new.variant_id);
      update makes set fault_count = fault_count + delta
        where id = (select make_id from models where id = (select model_id from variants where id = new.variant_id));
    end;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists fault_count_trigger on faults;
create trigger fault_count_trigger
  after insert or update on faults
  for each row execute function update_fault_counts();
