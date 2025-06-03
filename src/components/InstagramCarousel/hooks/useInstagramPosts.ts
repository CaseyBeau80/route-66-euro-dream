
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
        
        // Clean and type cast the data to fix parsing issues
        const typedPosts = (data || []).map(post => {
          // Remove extra quotes from media_type if they exist
          let cleanMediaType = post.media_type;
          if (typeof cleanMediaType === 'string') {
            cleanMediaType = cleanMediaType.replace(/^"(.*)"$/, '$1') as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
          }
          
          console.log(`📸 Post ${post.id}: ${cleanMediaType}, URL: ${post.media_url}${post.media_type === 'CAROUSEL_ALBUM' ? `, Carousel: ${post.carousel_media ? 'Yes' : 'No'}` : ''}`);
          
          // Log carousel media details for debugging
          if (cleanMediaType === 'CAROUSEL_ALBUM' && post.carousel_media) {
            try {
              const carouselData = typeof post.carousel_media === 'string' 
                ? JSON.parse(post.carousel_media) 
                : post.carousel_media;
              console.log(`🎠 Carousel post ${post.id} has ${Array.isArray(carouselData) ? carouselData.length : 0} media items`);
            } catch (e) {
              console.warn(`⚠️ Failed to parse carousel media for post ${post.id}:`, e);
            }
          }
          
          return {
            ...post,
            media_type: cleanMediaType
          };
        }) as InstagramPost[];
        
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
