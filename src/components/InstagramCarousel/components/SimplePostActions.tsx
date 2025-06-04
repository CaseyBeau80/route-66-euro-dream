
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { InstagramPost } from '../types';

interface SimplePostActionsProps {
  post: InstagramPost;
  onLike: (postId: string) => void;
}

const SimplePostActions: React.FC<SimplePostActionsProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Like button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors duration-200 ${
            isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
        </button>
      </div>
      
      {/* Date */}
      <span className="text-gray-500 text-xs">
        {formatDate(post.timestamp)}
      </span>
    </div>
  );
};

export default SimplePostActions;
