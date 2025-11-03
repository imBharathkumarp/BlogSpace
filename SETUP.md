# Setup Guide for BlogSpace

This guide will walk you through setting up the BlogSpace application from scratch.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier is fine)

## Step-by-Step Setup

### 1. Supabase Setup

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project
   - Wait for the project to initialize (1-2 minutes)

2. **Get Your Supabase Credentials**
   - In your Supabase dashboard, go to **Settings** → **API**
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public key** (starts with `eyJhbGc...`)

3. **Run the Database Migration**

   The database schema is already set up in the migration file. To apply it:

   - Go to **SQL Editor** in your Supabase dashboard
   - Click **New Query**
   - Copy the contents from the database migration (see below)
   - Click **Run** to execute

   **Migration SQL:**
   ```sql
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

   -- Create indexes for faster queries
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
   ```

### 2. Local Project Setup

1. **Clone and Install**
   ```bash
   # Navigate to project directory
   cd blogspace

   # Install dependencies
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   ```

3. **Edit .env.local**

   Open `.env.local` and replace with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### 3. First Steps

1. **Create an Account**
   - Click "Sign Up" in the navbar
   - Enter your name, email, and password
   - You'll be automatically logged in

2. **Create Your First Blog Post**
   - Click "Create Post"
   - Enter a title
   - Write content using the rich text editor
   - Optionally add a cover image URL
   - Click "Publish Post"

3. **Explore the App**
   - View your blog post on the homepage
   - Click to read the full post
   - Edit or delete your posts
   - Create more content!

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Your App is Live!**
   - Vercel will provide you with a live URL
   - Share it with the world!

## Troubleshooting

### Build Errors
- Make sure your `.env.local` file exists with valid Supabase credentials
- Run `npm run typecheck` to check for TypeScript errors

### Database Errors
- Verify your database migration ran successfully in Supabase
- Check that RLS policies are enabled
- Ensure your Supabase project is active

### Authentication Issues
- Confirm email confirmation is disabled in Supabase Auth settings
- Go to **Authentication** → **Providers** → **Email** → Disable "Confirm Email"
- Check that your credentials are correct in `.env.local`

### Image Upload
- Currently supports images via URL
- Use free image hosting services like:
  - [Unsplash](https://unsplash.com) - Direct image URLs
  - [Pexels](https://pexels.com) - Free stock photos
  - [Imgur](https://imgur.com) - Image hosting

## Next Steps

- Customize the design and colors
- Add your own branding
- Implement additional features from the README
- Share your blog with friends!

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the main README.md file
3. Check Supabase documentation
4. Review Next.js documentation

Happy blogging!

