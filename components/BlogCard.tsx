import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Blog } from '@/lib/supabase';

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const excerpt = blog.excerpt || stripHtml(blog.content).substring(0, 150);

  return (
    <Link href={`/blog/${blog.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
        {blog.image_url && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="space-y-2">
          <h2 className="text-2xl font-bold line-clamp-2 group-hover:text-slate-700 transition-colors">
            {blog.title}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 line-clamp-3 leading-relaxed">
            {excerpt}...
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author_name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
