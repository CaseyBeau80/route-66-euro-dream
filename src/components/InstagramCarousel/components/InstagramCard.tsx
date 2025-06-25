
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import MediaDisplay from './MediaDisplay';
import PostStats from './PostStats';
import ErrorPlaceholder from './ErrorPlaceholder';
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
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Compact Media Container */}
      <div className="relative aspect-square overflow-hidden">
        <MediaDisplay post={post} />
        
        {/* Hover Overlay */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="bg-white bg-opacity-90 rounded-full p-3 transform transition-transform duration-300 group-hover:scale-110">
            <ExternalLink className="w-6 h-6 text-gray-800" />
          </div>
        </div>
        
        {/* Like Count Overlay - Bottom Right */}
        <div className="absolute bottom-2 right-2">
          <PostStats post={post} />
        </div>
        
        {/* Date overlay - Top Right */}
        {post.timestamp && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramCard;
