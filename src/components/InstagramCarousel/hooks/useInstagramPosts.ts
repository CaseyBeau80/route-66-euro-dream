
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
      // Find the current post to get its current likes count
      const currentPost = posts.find(post => post.id === postId);
      if (!currentPost) {
        console.error('❌ Post not found for likes update');
        return;
      }

      const newLikesCount = currentPost.likes + 1;

      // Update locally first for immediate feedback
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: newLikesCount }
            : post
        )
      );

      // Update the database with the new likes count
      const { error } = await supabase
        .from('instagram_posts')
        .update({ likes: newLikesCount })
        .eq('id', postId);

      if (error) {
        console.error('❌ Error updating post likes:', error);
        // Revert the optimistic update on error
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, likes: currentPost.likes }
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
