-- Visuals Update: Add image columns to existing tables
-- Run this in your Supabase SQL Editor

-- 1. Add image_url to models for the Hero Banners
ALTER TABLE models 
ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Add image_url to submissions for User Uploads
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS image_url text;

-- Note: To fully support user uploads, a Supabase Storage bucket named 'submissions' 
-- needs to be created in the Supabase Dashboard with public read access.
