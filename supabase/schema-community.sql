-- CKF Phase 7: Community & Authority Schema
-- Run this in your Supabase SQL Editor

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  model_id uuid references models(id) on delete cascade,
  created_at timestamptz default now(),
  unique(email, model_id)
);

-- Row Level Security (RLS)
alter table newsletter_subscribers enable row level security;

-- Only service role can read/write directly (public inserts handled via our secure API route)
-- So we do not create a public insert policy. The Next.js API will use the service_role key.
