
import React from 'react';
import { InstagramPost } from '../types';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';

interface PostStatsProps {
  post: InstagramPost;
}

const PostStats: React.FC<PostStatsProps> = ({ post }) => {
  const formatCount = (count: number | null) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-3">
      {/* Stats and Link */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{formatCount(post.like_count)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span>{formatCount(post.comments_count)}</span>
          </div>
        </div>
        
        <a 
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-route66-rust hover:text-route66-vintage-brown transition-colors text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          View
        </a>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-500">
        {new Date(post.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
    </div>
  );
};

export default PostStats;
