'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BlogForm from '@/components/BlogForm';
import { supabase } from '@/lib/supabase';
import type { Blog } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthAndFetchBlog();
  }, [params.id]);

  const checkAuthAndFetchBlog = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${params.id}`);
      if (!response.ok) throw new Error('Blog not found');
      const data = await response.json();

      if (data.blog.author_id !== user.id) {
        router.push('/');
        return;
      }

      setBlog(data.blog);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {error || 'Blog not found'}
            </h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogForm mode="edit" initialData={blog} />
        </div>
      </main>
    </>
  );
}
