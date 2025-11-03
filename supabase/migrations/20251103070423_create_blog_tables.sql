/*
  # Blog Application Database Schema

  ## Tables Created
  
  ### `blogs`
  - `id` (uuid, primary key) - Unique identifier for each blog post
  - `title` (text, required) - Blog post title
  - `content` (text, required) - Rich text content from WYSIWYG editor
  - `excerpt` (text) - Short preview/summary of the blog
  - `image_url` (text) - URL to blog cover image
  - `author_id` (uuid, foreign key) - References auth.users
  - `author_name` (text) - Author display name
  - `created_at` (timestamptz) - Auto-generated creation timestamp
  - `updated_at` (timestamptz) - Auto-updated modification timestamp
  
  ## Security
  - Enable RLS on `blogs` table
  - Public can read all published blogs
  - Authenticated users can create blogs
  - Users can update/delete only their own blogs
*/

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read blogs
CREATE POLICY "Anyone can read blogs"
  ON blogs
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can create blogs
CREATE POLICY "Authenticated users can create blogs"
  ON blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own blogs
CREATE POLICY "Users can update their own blogs"
  ON blogs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own blogs
CREATE POLICY "Users can delete their own blogs"
  ON blogs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS blogs_author_id_idx ON blogs(author_id);
CREATE INDEX IF NOT EXISTS blogs_created_at_idx ON blogs(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
