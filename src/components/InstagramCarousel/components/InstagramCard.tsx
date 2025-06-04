
import React from 'react';
import { InstagramPost } from '../types';
import MediaDisplay from './MediaDisplay';
import PostContent from './PostContent';
import PostStats from './PostStats';
import ErrorPlaceholder from './ErrorPlaceholder';
import MediaDebugInfo from './MediaDebugInfo';

interface InstagramCardProps {
  post: InstagramPost;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ post }) => {
  // Basic validation - if no media_url at all, show error
  if (!post.media_url && !post.thumbnail_url && (!post.carousel_media || post.carousel_media === '[]')) {
    return <ErrorPlaceholder post={post} />;
  }

  const handleCardClick = () => {
    if (post.permalink) {
      window.open(post.permalink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Media */}
      <div className="relative">
        <MediaDisplay post={post} />
        
        {/* Interactive indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-30 transition-opacity duration-300">
          <div className="bg-white bg-opacity-90 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-route66-rust">
              <path d="M15 3h6v6"></path>
              <path d="M10 14 21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
          </div>
        </div>
        
        {/* Debug info only in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <MediaDebugInfo post={post} />
        )}
      </div>

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
