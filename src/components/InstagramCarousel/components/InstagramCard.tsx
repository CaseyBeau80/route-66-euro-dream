
import React from 'react';
import { InstagramPost } from '../types';
import MediaDisplay from './MediaDisplay';
import PostContent from './PostContent';
import PostStats from './PostStats';
import ErrorPlaceholder from './ErrorPlaceholder';

interface InstagramCardProps {
  post: InstagramPost;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ post }) => {
  // Basic validation - if no media_url at all, show error
  if (!post.media_url && !post.thumbnail_url && (!post.carousel_media || post.carousel_media === '[]')) {
    return <ErrorPlaceholder post={post} />;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Media */}
      <MediaDisplay post={post} />

      {/* Content */}
      <div className="p-4">
        <PostContent post={post} />
        <div className="mt-3">
          <PostStats post={post} />
        </div>
      </div>
    </div>
  );
};

export default InstagramCard;
