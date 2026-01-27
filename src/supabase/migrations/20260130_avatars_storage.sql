-- Add avatar_url column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to avatars
CREATE POLICY "Public avatar access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
