
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InstagramPost } from '../types';

export const useInstagramPosts = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🎯 Fetching Instagram posts from Supabase...');

        const { data, error } = await supabase
          .from('instagram_posts')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(12);

        if (error) {
          console.error('❌ Error fetching Instagram posts:', error);
          setError(error.message);
          return;
        }

        console.log(`✅ Successfully fetched ${data?.length || 0} Instagram posts`);
        
        // Type cast the data to match our InstagramPost interface
        const typedPosts = (data || []).map(post => ({
          ...post,
          media_type: post.media_type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
        })) as InstagramPost[];
        
        setPosts(typedPosts);
      } catch (err) {
        console.error('❌ Unexpected error fetching Instagram posts:', err);
        setError('An unexpected error occurred while fetching posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  return { posts, isLoading, error };
};
