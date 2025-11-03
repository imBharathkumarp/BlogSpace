# Developer Guide

## Quick Start for Developers

This guide provides technical details for developers working on the BlogSpace project.

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Basic knowledge of Next.js, React, and TypeScript

## Initial Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# Then run development server
npm run dev
```

## Project Architecture

### Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + ShadCN UI
- **Editor**: React Quill

### Folder Structure

```
src/
├── app/          # Next.js pages and API routes
├── components/   # Reusable React components
├── lib/          # Utilities and configurations
└── hooks/        # Custom React hooks
```

## Key Concepts

### 1. Authentication

Authentication is handled by Supabase Auth:

```typescript
// Sign up
import { signUp } from '@/lib/auth';
const { data, error } = await signUp(email, password, name);

// Sign in
import { signIn } from '@/lib/auth';
const { data, error } = await signIn(email, password);

// Sign out
import { signOut } from '@/lib/auth';
await signOut();

// Get current user
import { getCurrentUser } from '@/lib/auth';
const { user } = await getCurrentUser();
```

### 2. Database Queries

All database operations go through API routes:

```typescript
// Fetch all blogs
const response = await fetch('/api/blogs');
const { blogs } = await response.json();

// Fetch single blog
const response = await fetch(`/api/blogs/${id}`);
const { blog } = await response.json();

// Create blog
const response = await fetch('/api/blogs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, content, author_id })
});

// Update blog
const response = await fetch(`/api/blogs/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, content })
});

// Delete blog
const response = await fetch(`/api/blogs/${id}`, {
  method: 'DELETE'
});
```

### 3. Protected Routes

Client-side route protection pattern:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return <div>Protected content</div>;
}
```

### 4. TypeScript Types

Main types in `lib/supabase.ts`:

```typescript
export type Blog = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author_id: string;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};
```

## API Reference

### GET /api/blogs
Fetch all blogs

**Response:**
```json
{
  "blogs": [
    {
      "id": "uuid",
      "title": "Blog Title",
      "content": "HTML content",
      "excerpt": "Preview text",
      "image_url": "https://...",
      "author_id": "uuid",
      "author_name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/blogs
Create a new blog

**Request Body:**
```json
{
  "title": "Blog Title",
  "content": "HTML content",
  "excerpt": "Optional preview",
  "image_url": "Optional image URL",
  "author_id": "uuid",
  "author_name": "John Doe"
}
```

### GET /api/blogs/[id]
Fetch single blog by ID

### PUT /api/blogs/[id]
Update existing blog

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "excerpt": "Updated preview",
  "image_url": "Updated image URL"
}
```

### DELETE /api/blogs/[id]
Delete blog by ID

## Component Patterns

### Creating a New Component

```typescript
// components/MyComponent.tsx
'use client'; // Add if using hooks or client-side features

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
    </div>
  );
}
```

### Using ShadCN UI Components

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Database Patterns

### Row-Level Security (RLS)

All database access is controlled by RLS policies:

```sql
-- Allow public reads
CREATE POLICY "Anyone can read blogs"
  ON blogs FOR SELECT
  TO public
  USING (true);

-- Restrict writes to authenticated users
CREATE POLICY "Users can create blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Only allow users to edit their own blogs
CREATE POLICY "Users can update own blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);
```

### Direct Supabase Queries

For custom operations, use Supabase client directly:

```typescript
import { supabase } from '@/lib/supabase';

// Select with filters
const { data, error } = await supabase
  .from('blogs')
  .select('*')
  .eq('author_id', userId)
  .order('created_at', { ascending: false });

// Insert
const { data, error } = await supabase
  .from('blogs')
  .insert([{ title, content, author_id }])
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('blogs')
  .update({ title, content })
  .eq('id', blogId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('blogs')
  .delete()
  .eq('id', blogId);
```

## Styling Guidelines

### Tailwind CSS Classes

```typescript
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Spacing
<div className="p-4 m-2">  // padding: 1rem, margin: 0.5rem

// Colors
<div className="bg-slate-100 text-slate-900">

// Hover states
<button className="hover:bg-slate-200 transition-colors">
```

### Custom CSS

Add custom styles in `app/globals.css`:

```css
.my-custom-class {
  @apply bg-white rounded-lg shadow-md p-4;
}
```

## Testing

### Manual Testing Checklist

- [ ] User can sign up
- [ ] User can log in
- [ ] User can create a blog post
- [ ] User can view all blog posts
- [ ] User can view a single blog post
- [ ] User can edit their own blog post
- [ ] User can delete their own blog post
- [ ] User cannot edit others' posts
- [ ] User cannot delete others' posts
- [ ] Rich text editor works correctly
- [ ] Image URLs display properly
- [ ] Responsive design works on mobile

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Common Issues & Solutions

### Build Errors

**Error: Invalid Supabase URL**
- Solution: Ensure `.env.local` exists with valid credentials

**Error: Type error in component**
- Solution: Run `npm run typecheck` to identify issues

### Runtime Errors

**Error: Failed to fetch blogs**
- Check Supabase connection
- Verify database migration ran successfully
- Check browser console for details

**Error: User not authenticated**
- Verify Supabase Auth is configured
- Check that email confirmation is disabled
- Clear browser cache and try again

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={blog.image_url}
  alt={blog.title}
  width={800}
  height={400}
  priority
/>
```

### Code Splitting

```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});
```

## Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [React Quill Documentation](https://github.com/zenoamaro/react-quill)

## Support

For issues or questions:
1. Check this developer guide
2. Review the README.md
3. Check Supabase and Next.js documentation
4. Search for similar issues on GitHub

Happy coding!
