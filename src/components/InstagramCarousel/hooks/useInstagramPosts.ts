
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

        console.log('🎯 Fetching Route 66 relevant Instagram posts from Supabase...');

        const { data, error } = await supabase
          .from('instagram_posts')
          .select('*')
          .eq('route66_relevant', true)
          .order('timestamp', { ascending: false })
          .limit(12);

        if (error) {
          console.error('❌ Error fetching Instagram posts:', error);
          setError(error.message);
          return;
        }

        console.log(`✅ Successfully fetched ${data?.length || 0} Route 66 relevant Instagram posts`);
        
        const typedPosts = (data || []) as InstagramPost[];
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

  const updatePostLikes = async (postId: string) => {
    try {
      // Find the post and increment likes locally first for immediate feedback
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      );

      // Update the database
      const { error } = await supabase
        .from('instagram_posts')
        .update({ likes: supabase.raw('likes + 1') })
        .eq('id', postId);

      if (error) {
        console.error('❌ Error updating post likes:', error);
        // Revert the optimistic update on error
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes - 1 }
              : post
          )
        );
      } else {
        console.log('✅ Successfully updated post likes');
      }
    } catch (err) {
      console.error('❌ Unexpected error updating likes:', err);
    }
  };

  return { posts, isLoading, error, updatePostLikes };
};
