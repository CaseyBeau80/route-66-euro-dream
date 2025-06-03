
import React from 'react';
import { InstagramPost } from '../types';

interface PostContentProps {
  post: InstagramPost;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const formatHashtags = (hashtags: string[] | null) => {
    if (!hashtags || hashtags.length === 0) return '';
    return hashtags.map(tag => `#${tag}`).join(' ');
  };

  const truncateCaption = (caption: string | null, maxLength: number = 100) => {
    if (!caption) return '';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-3">
      {/* Caption */}
      <p className="font-travel text-gray-800 text-sm leading-relaxed">
        {truncateCaption(post.caption) || 'No caption available'}
      </p>

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <p className="text-route66-rust text-xs font-medium">
          {formatHashtags(post.hashtags)}
        </p>
      )}

      {/* Location */}
      {post.location_name && (
        <p className="text-gray-600 text-xs flex items-center gap-1">
          📍 {post.location_name}
        </p>
      )}
    </div>
  );
};

export default PostContent;
