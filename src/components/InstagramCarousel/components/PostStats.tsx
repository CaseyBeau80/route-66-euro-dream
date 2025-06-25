
import React from 'react';
import { InstagramPost } from '../types';
import { Heart } from 'lucide-react';

interface PostStatsProps {
  post: InstagramPost;
}

const PostStats: React.FC<PostStatsProps> = ({ post }) => {
  if (!post.like_count) return null;

  return (
    <div className="flex items-center gap-1.5 bg-route66-primary bg-opacity-90 text-white rounded-full px-3 py-2 backdrop-blur-sm shadow-lg">
      <Heart className="w-4 h-4 text-blue-200 fill-current" />
      <span className="text-sm font-medium">
        {post.like_count}
      </span>
    </div>
  );
};

export default PostStats;
