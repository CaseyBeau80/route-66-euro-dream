
import React from 'react';
import { InstagramPost } from '../types';
import { Heart } from 'lucide-react';

interface PostStatsProps {
  post: InstagramPost;
}

const PostStats: React.FC<PostStatsProps> = ({ post }) => {
  if (!post.like_count) return null;

  return (
    <div className="flex items-center gap-1 bg-black bg-opacity-60 text-white rounded-full px-3 py-1.5 backdrop-blur-sm">
      <Heart className="w-4 h-4 text-red-400 fill-current" />
      <span className="text-sm font-medium">
        {post.like_count}
      </span>
    </div>
  );
};

export default PostStats;
