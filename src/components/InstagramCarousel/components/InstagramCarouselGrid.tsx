
import React from 'react';
import { InstagramPost } from '../types';
import InstagramCard from './InstagramCard';

interface InstagramCarouselGridProps {
  visiblePosts: InstagramPost[];
  currentIndex: number;
}

const InstagramCarouselGrid: React.FC<InstagramCarouselGridProps> = ({
  visiblePosts,
  currentIndex
}) => {
  // Limit posts to reduce DOM size - max 8 posts visible at once
  const maxPosts = 8;
  const limitedPosts = visiblePosts.slice(0, maxPosts);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
      {limitedPosts.map((post, index) => (
        <div key={`${post.id}-${currentIndex + index}`} className="w-full">
          <InstagramCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default InstagramCarouselGrid;
