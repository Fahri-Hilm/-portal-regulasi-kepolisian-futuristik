-- RLS Policy: Allow all operations for everyone
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations" ON regulations;
DROP POLICY IF EXISTS "Allow all operations" ON reports;
DROP POLICY IF EXISTS "Public can read regulations" ON regulations;
DROP POLICY IF EXISTS "Authenticated can insert regulations" ON regulations;
DROP POLICY IF EXISTS "Authenticated can update regulations" ON regulations;
DROP POLICY IF EXISTS "Authenticated can delete regulations" ON regulations;
DROP POLICY IF EXISTS "Public can read reports" ON reports;
DROP POLICY IF EXISTS "Authenticated can insert reports" ON reports;
DROP POLICY IF EXISTS "Authenticated can update reports" ON reports;
DROP POLICY IF EXISTS "Authenticated can delete reports" ON reports;

-- Regulations: allow all operations for everyone
CREATE POLICY "Allow all operations" ON regulations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Reports: allow all operations for everyone
CREATE POLICY "Allow all operations" ON reports
  FOR ALL
  USING (true)
  WITH CHECK (true);
