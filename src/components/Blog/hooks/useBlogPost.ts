import { useState, useEffect, useCallback } from 'react';
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
  /** Transient failure (network/exception/Supabase error) after retries exhausted */
  error: string | null;
  /** Definitive: query succeeded but no published row matches this slug */
  notFound: boolean;
  relatedPosts: RelatedPost[];
  refetch: () => void;
}

const RETRY_DELAYS = [500, 1500]; // 3 attempts total
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useBlogPost = (slug: string): UseBlogPostResult => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);

  const refetch = useCallback(() => setAttemptKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setNotFound(false);

      let lastFailure = 'Failed to load blog post';

      for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
        if (cancelled) return;

        try {
          const { data, error: fetchError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .lte('published_at', new Date().toISOString())
            .maybeSingle();

          if (cancelled) return;

          if (fetchError) {
            // Transient / server-side failure — retry
            lastFailure = fetchError.message || lastFailure;
            console.error(`Error fetching blog post (attempt ${attempt + 1}):`, fetchError);
          } else if (!data) {
            // Definitive answer: the post does not exist. Never retry.
            setPost(null);
            setRelatedPosts([]);
            setNotFound(true);
            setIsLoading(false);
            return;
          } else {
            setPost(data);
            setNotFound(false);
            setError(null);

            const { data: related } = await supabase
              .from('blog_posts')
              .select('id, title, slug, featured_image_url, published_at, author_name')
              .eq('is_published', true)
              .neq('id', data.id)
              .lte('published_at', new Date().toISOString())
              .order('published_at', { ascending: false })
              .limit(3);

            if (cancelled) return;
            setRelatedPosts(related || []);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          if (cancelled) return;
          lastFailure = 'Failed to load blog post';
          console.error(`Unexpected error fetching blog post (attempt ${attempt + 1}):`, err);
        }

        // Keep isLoading true while backing off so the skeleton stays visible.
        if (attempt < RETRY_DELAYS.length) {
          await sleep(RETRY_DELAYS[attempt]);
        }
      }

      if (cancelled) return;
      setError(lastFailure);
      setIsLoading(false);
    };

    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [slug, attemptKey]);

  return { post, isLoading, error, notFound, relatedPosts, refetch };
};

export default useBlogPost;
