'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/Editor';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Blog } from '@/lib/supabase';

interface BlogFormProps {
  initialData?: Blog;
  mode: 'create' | 'edit';
}

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to perform this action');
        setLoading(false);
        return;
      }

      const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
      const excerpt = stripHtml(content).substring(0, 150);

      if (mode === 'create') {
        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            excerpt,
            image_url: imageUrl || null,
            author_id: user.id,
            author_name: user.user_metadata?.name || user.email,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create blog');
        }

        router.push('/');
        router.refresh();
      } else {
        const response = await fetch(`/api/blogs/${initialData?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            excerpt,
            image_url: imageUrl || null,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update blog');
        }

        router.push(`/blog/${initialData?.id}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Cover Image URL (optional)</Label>
            <Input
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
            {imageUrl && (
              <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Invalid image URL';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Editor value={content} onChange={setContent} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || !title || !content}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Publish Post' : 'Update Post'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
