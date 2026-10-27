import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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

        ;

        const { data, error } = await (supabase as any)
          .from('instagram_posts')
          .select('id,instagram_post_id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,is_featured,hashtags,mentions,location_name,location_id,carousel_media,route66_relevant,likes')
          .eq('route66_relevant', true)
          .order('timestamp', { ascending: false })
          .limit(12);

        if (error) {
          console.error('❌ Error fetching Instagram posts:', error);
          setError(error.message);
          return;
        }

        // Deduplicate by media_url, keeping the earliest entry
        const seen = new Set<string>();
        const uniquePosts = (data || []).filter((post: any) => {
          if (seen.has(post.media_url)) return false;
          seen.add(post.media_url);
          return true;
        });

        ;
        
        setPosts(uniquePosts as InstagramPost[]);
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
      const currentPost = posts.find(post => post.id === postId);
      if (!currentPost) return;

      const newLikesCount = currentPost.likes + 1;

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: newLikesCount } : post
        )
      );

      const { error } = await (supabase as any)
        .from('instagram_posts')
        .update({ likes: newLikesCount })
        .eq('id', postId);

      if (error) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? { ...post, likes: currentPost.likes } : post
          )
        );
      }
    } catch (err) {
      console.error('❌ Unexpected error updating likes:', err);
    }
  };

  return { posts, isLoading, error, updatePostLikes };
};
