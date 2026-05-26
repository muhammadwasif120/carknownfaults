-- CKF Phase 6: OBD Code Library Schema
-- Run this in your Supabase SQL Editor

create table if not exists obd_codes (
  id uuid primary key default gen_random_uuid(),
  code varchar(10) not null unique,
  title varchar(255) not null,
  description text not null,
  symptoms text not null,
  causes text not null,
  severity varchar(50) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table obd_codes enable row level security;

-- Public read policy
create policy "Public read obd_codes" on obd_codes for select using (true);
