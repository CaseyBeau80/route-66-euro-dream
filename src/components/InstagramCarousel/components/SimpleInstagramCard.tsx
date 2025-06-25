
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import SimpleMediaDisplay from './SimpleMediaDisplay';
import SimplePostContent from './SimplePostContent';
import SimplePostActions from './SimplePostActions';
import { ExternalLink } from 'lucide-react';

interface SimpleInstagramCardProps {
  post: InstagramPost;
  onLike: (postId: string) => void;
}

const SimpleInstagramCard: React.FC<SimpleInstagramCardProps> = ({ post, onLike }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (post.permalink) {
      window.open(post.permalink, '_blank', 'noopener,noreferrer');
    }
  };

  console.log(`🖼️ Rendering card for post ${post.id}`);

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-110"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media with enhanced hover effect */}
      <div className="relative aspect-square overflow-hidden">
        <div className="transform transition-transform duration-700 group-hover:scale-125">
          <SimpleMediaDisplay post={post} onCardClick={handleCardClick} />
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
        
        {/* Date overlay - Top Right with blue theme */}
        {post.timestamp && (
          <div className="absolute top-3 right-3 bg-route66-primary bg-opacity-80 text-white px-3 py-1.5 rounded text-sm font-medium backdrop-blur-sm">
            {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
        
        {/* Like Count Overlay - Bottom Right with blue theme */}
        {post.like_count && (
          <div className="absolute bottom-3 right-3 bg-route66-primary bg-opacity-90 text-white rounded-full px-3 py-2 backdrop-blur-sm shadow-lg">
            <span className="text-sm font-medium">
              ❤️ {post.like_count}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <SimplePostContent post={post} />
      
      {/* Actions */}
      <div className="px-3 pb-2">
        <SimplePostActions post={post} onLike={onLike} />
      </div>
    </div>
  );
};

export default SimpleInstagramCard;
