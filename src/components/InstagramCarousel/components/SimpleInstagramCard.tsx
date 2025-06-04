
import React from 'react';
import { InstagramPost } from '../types';
import SimpleMediaDisplay from './SimpleMediaDisplay';
import SimplePostContent from './SimplePostContent';
import SimplePostActions from './SimplePostActions';

interface SimpleInstagramCardProps {
  post: InstagramPost;
  onLike: (postId: string) => void;
}

const SimpleInstagramCard: React.FC<SimpleInstagramCardProps> = ({ post, onLike }) => {
  const handleCardClick = () => {
    if (post.permalink) {
      window.open(post.permalink, '_blank', 'noopener,noreferrer');
    }
  };

  console.log(`🖼️ Rendering card for post ${post.id}`);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Media */}
      <SimpleMediaDisplay post={post} onCardClick={handleCardClick} />

      {/* Content */}
      <SimplePostContent post={post} />
      
      {/* Actions */}
      <div className="px-4 pb-4">
        <SimplePostActions post={post} onLike={onLike} />
      </div>
    </div>
  );
};

export default SimpleInstagramCard;
