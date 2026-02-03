-- Fix news table RLS policies to use the existing is_admin() function
-- Drop existing incorrect policies
DROP POLICY IF EXISTS "Allow read published news" ON news;

DROP POLICY IF EXISTS "Allow admins full access" ON news;

-- Create correct policies using the existing is_admin() function
-- Allow authenticated users to read published news
CREATE POLICY "Allow read published news" ON news FOR
SELECT
    TO authenticated USING (status = 'published');

-- Allow admins to perform all operations  
CREATE POLICY "Allow admins full access" ON news FOR ALL TO authenticated USING (public.is_admin ())
WITH
    CHECK (public.is_admin ());

CREATE POLICY "allow authenticated insert" ON sarlaft_relations FOR INSERT TO authenticated
WITH
    CHECK (true);