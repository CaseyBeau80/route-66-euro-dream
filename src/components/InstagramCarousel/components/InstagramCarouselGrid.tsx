
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {visiblePosts.map((post, index) => (
        <div key={`${post.id}-${currentIndex + index}`} className="w-full">
          <InstagramCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default InstagramCarouselGrid;
