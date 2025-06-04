
import React from 'react';
import { Play } from 'lucide-react';
import { InstagramPost } from '../types';

interface MediaOverlaysProps {
  post: InstagramPost;
  currentMediaType: string;
  carouselMedia: any[];
  currentCarouselIndex: number;
}

const MediaOverlays: React.FC<MediaOverlaysProps> = ({
  post,
  currentMediaType,
  carouselMedia,
  currentCarouselIndex
}) => {
  const isVideo = currentMediaType === 'VIDEO';
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM';

  return (
    <>
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black bg-opacity-50 rounded-full p-3">
            <Play className="w-8 h-8 text-white" fill="white" />
          </div>
        </div>
      )}
      
      {isVideo && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
          VIDEO
        </div>
      )}
      
      {isCarousel && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
          📸 {currentCarouselIndex + 1}/{carouselMedia.length}
        </div>
      )}
      
      {post.is_featured && (
        <div className="absolute top-2 left-2 bg-route66-vintage-yellow text-black px-2 py-1 rounded text-xs font-bold">
          ⭐ FEATURED
        </div>
      )}
    </>
  );
};

export default MediaOverlays;
