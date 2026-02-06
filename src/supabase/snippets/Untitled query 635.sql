-- =====================================================
-- NOTIFICATION RLS POLICIES FOR COMPLIANCE OFFICER
-- =====================================================

-- Step 1: Create helper function to get user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view notifications based on role" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update notifications based on role" ON notifications;

-- Step 3: Create new SELECT policy
-- This policy allows:
-- 1. Regular users to see their own notifications (user_id = auth.uid())
-- 2. Compliance officers to see ALL notifications directed to any compliance officer
CREATE POLICY "Users can view notifications based on role"
ON notifications
FOR SELECT
USING (
  -- Regular users see only their own notifications
  (auth.uid() = user_id)
  OR
  -- Compliance officers see ALL notifications for compliance officers
  (
    auth.user_role() = 'compliance_officer' 
    AND user_id IN (
      SELECT id FROM profiles WHERE role = 'compliance_officer'
    )
  )
);

-- Step 4: Create UPDATE policy for marking as read
CREATE POLICY "Users can update notifications based on role"
ON notifications
FOR UPDATE
USING (
  -- Users can update their own notifications
  (auth.uid() = user_id)
  OR
  -- Compliance officers can update any compliance officer's notifications
  (
    auth.user_role() = 'compliance_officer' 
    AND user_id IN (
      SELECT id FROM profiles WHERE role = 'compliance_officer'
    )
  )
);

-- Step 5: Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 6: Grant necessary permissions
GRANT SELECT, UPDATE ON notifications TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES (for testing)
-- =====================================================

-- Test if the helper function works
-- SELECT auth.user_role();

-- Test query to see what notifications a compliance officer should see
-- SELECT * FROM notifications 
-- WHERE user_id IN (SELECT id FROM profiles WHERE role = 'compliance_officer')
-- ORDER BY created_at DESC;

-- Test to verify RLS is working
-- SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
