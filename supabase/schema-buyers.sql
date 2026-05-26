-- CKF Phase 5: Buyer Intelligence Schema
-- Run this in your Supabase SQL Editor

create table if not exists buyer_guides (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade unique,
  repair_score integer not null check (repair_score >= 0 and repair_score <= 100),
  reliability_rating integer not null check (reliability_rating >= 1 and reliability_rating <= 5),
  running_costs_rating integer not null check (running_costs_rating >= 1 and running_costs_rating <= 5),
  verdict text not null,
  what_to_look_for text not null,
  what_to_avoid text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table buyer_guides enable row level security;

-- Public read policy
create policy "Public read buyer_guides" on buyer_guides for select using (true);
