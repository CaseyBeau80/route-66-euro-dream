import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BlogPost } from './useBlogPosts';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  featured_image_url: string | null;
  published_at: string;
  author_name: string;
}

interface UseBlogPostResult {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  relatedPosts: RelatedPost[];
}

export const useBlogPost = (slug: string): UseBlogPostResult => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the post by slug
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .lte('published_at', new Date().toISOString())
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching blog post:', fetchError);
          setError(fetchError.message);
          return;
        }

        if (!data) {
          setError('Post not found');
          return;
        }

        setPost(data);

        // Fetch related posts (same tags, excluding current post)
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image_url, published_at, author_name')
          .eq('is_published', true)
          .neq('id', data.id)
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })
          .limit(3);

        setRelatedPosts(related || []);
      } catch (err) {
        console.error('Unexpected error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, isLoading, error, relatedPosts };
};

export default useBlogPost;
