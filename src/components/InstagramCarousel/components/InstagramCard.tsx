
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
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-110"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Larger Media Container with enhanced hover effect */}
      <div className="relative aspect-square overflow-hidden">
        <div className="transform transition-transform duration-700 group-hover:scale-125">
          <MediaDisplay post={post} />
        </div>
        
        {/* Enhanced Hover Overlay */}
        <div className={`
          absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-500 flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="bg-white bg-opacity-95 rounded-full p-4 transform transition-all duration-500 group-hover:scale-125 shadow-lg">
            <ExternalLink className="w-8 h-8 text-route66-primary" />
          </div>
        </div>
        
        {/* Like Count Overlay - Bottom Right with blue theme */}
        <div className="absolute bottom-3 right-3">
          <PostStats post={post} />
        </div>
        
        {/* Date overlay - Top Right with blue theme */}
        {post.timestamp && (
          <div className="absolute top-3 right-3 bg-route66-primary bg-opacity-80 text-white px-3 py-1.5 rounded text-sm font-medium backdrop-blur-sm">
            {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramCard;
