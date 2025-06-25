
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import MediaDisplay from './MediaDisplay';
import PostContent from './PostContent';
import PostStats from './PostStats';
import ErrorPlaceholder from './ErrorPlaceholder';
import MediaDebugInfo from './MediaDebugInfo';
import { ExternalLink } from 'lucide-react';

interface InstagramCardProps {
  post: InstagramPost;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Media Container */}
      <div className="relative aspect-square overflow-hidden">
        <MediaDisplay post={post} />
        
        {/* Hover Overlay with Instagram Icon */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="bg-white bg-opacity-95 rounded-full p-4 transform transition-transform duration-300 group-hover:scale-110">
            <ExternalLink className="w-8 h-8 text-route66-primary" />
          </div>
          
          {/* View Post Text */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-white font-semibold text-lg bg-black bg-opacity-60 px-4 py-2 rounded-full">
              View Post
            </span>
          </div>
        </div>
        
        {/* Like Count Overlay - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <PostStats post={post} />
        </div>
        
        {/* Debug info only in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <MediaDebugInfo post={post} />
        )}
      </div>

      {/* Simplified Content Area */}
      <div className="p-6">
        <PostContent post={post} />
      </div>
    </div>
  );
};

export default InstagramCard;
