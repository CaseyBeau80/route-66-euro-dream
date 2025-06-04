
import React from 'react';
import { InstagramPost } from '../types';

interface SimplePostContentProps {
  post: InstagramPost;
}

const SimplePostContent: React.FC<SimplePostContentProps> = ({ post }) => {
  const truncateCaption = (caption: string | undefined, maxLength: number = 100) => {
    if (!caption) return '';
    return caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;
  };

  return (
    <div className="p-4">
      {/* Caption */}
      {post.caption && (
        <p className="text-gray-800 text-sm mb-3 leading-relaxed">
          {truncateCaption(post.caption)}
        </p>
      )}
      
      {/* Location */}
      {post.location_name && (
        <p className="text-gray-500 text-xs mb-3 flex items-center">
          📍 {post.location_name}
        </p>
      )}
    </div>
  );
};

export default SimplePostContent;
