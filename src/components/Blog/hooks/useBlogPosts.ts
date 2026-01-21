import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string;
  author_name: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface UseBlogPostsResult {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlogPosts = (limit?: number): UseBlogPostsResult => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching blog posts:', fetchError);
        setError(fetchError.message);
        return;
      }

      setPosts(data || []);
    } catch (err) {
      console.error('Unexpected error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit]);

  return { posts, isLoading, error, refetch: fetchPosts };
};

export default useBlogPosts;
