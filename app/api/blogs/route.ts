import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, image_url, author_id, author_name } = body;

    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: 'Title, content, and author_id are required' },
        { status: 400 }
      );
    }

    const { data: blog, error } = await supabase
      .from('blogs')
      .insert([
        {
          title,
          content,
          excerpt: excerpt || content.substring(0, 150).replace(/<[^>]*>/g, ''),
          image_url,
          author_id,
          author_name,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
}
