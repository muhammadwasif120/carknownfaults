-- CKF Phase 4: MOT Intelligence Schema
-- Run this in your Supabase SQL Editor

create table if not exists mot_stats (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade unique,
  pass_rate numeric(4,1) not null,
  tested_count integer not null,
  top_failure_1 text,
  top_failure_2 text,
  top_failure_3 text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table mot_stats enable row level security;

-- Public read policy
create policy "Public read mot_stats" on mot_stats for select using (true);
