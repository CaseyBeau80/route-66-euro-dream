
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import { ImageOff, RotateCcw } from 'lucide-react';
import { MediaUrlGenerator } from './MediaUrlGenerator';
import MediaLoader from './MediaLoader';
import CarouselControls from './CarouselControls';
import MediaOverlays from './MediaOverlays';

interface MediaDisplayProps {
  post: InstagramPost;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const urlGenerator = new MediaUrlGenerator(post, currentCarouselIndex);
  const mediaUrls = urlGenerator.getMediaUrls();
  const carouselMedia = urlGenerator.getCarouselMedia();
  const currentMediaType = urlGenerator.getCurrentMediaType();
  const isVideo = currentMediaType === 'VIDEO';

  const handleMediaLoad = () => {
    setImageError(false);
    console.log(`✅ Successfully loaded media for post ${post.id} using URL ${currentImageIndex + 1}/${mediaUrls.length}: ${mediaUrls[currentImageIndex]}`);
  };

  const handleMediaError = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleRetry = () => {
    console.log(`🔄 Retrying media load for post ${post.id}`);
    setCurrentImageIndex(0);
    setImageError(false);
    setRetryCount(0);
  };

  const resetMediaState = () => {
    setCurrentImageIndex(0);
    setImageError(false);
    setRetryCount(0);
  };

  const handleCarouselPrevious = () => {
    setCurrentCarouselIndex(prev => prev > 0 ? prev - 1 : carouselMedia.length - 1);
    resetMediaState();
  };

  const handleCarouselNext = () => {
    setCurrentCarouselIndex(prev => prev < carouselMedia.length - 1 ? prev + 1 : 0);
    resetMediaState();
  };

  const handleCarouselDotClick = (index: number) => {
    setCurrentCarouselIndex(index);
    resetMediaState();
  };

  const handleImageIndexChange = (index: number) => {
    setCurrentImageIndex(index);
    setRetryCount(prev => prev + 1);
  };

  const handleFinalError = () => {
    setImageError(true);
  };

  // If no valid media URLs, show error immediately
  if (mediaUrls.length === 0) {
    console.error(`❌ No valid media URLs found for post ${post.id}`);
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No media available</p>
            <p className="text-xs text-gray-400 mt-1">Instagram content unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      {!imageError ? (
        <>
          <MediaLoader
            post={post}
            mediaUrls={mediaUrls}
            currentImageIndex={currentImageIndex}
            isVideo={isVideo}
            onLoad={handleMediaLoad}
            onError={handleFinalError}
            onImageIndexChange={handleImageIndexChange}
            retryCount={retryCount}
          />
          
          <CarouselControls
            carouselMedia={carouselMedia}
            currentCarouselIndex={currentCarouselIndex}
            onPrevious={handleCarouselPrevious}
            onNext={handleCarouselNext}
            onDotClick={handleCarouselDotClick}
          />
          
          <MediaOverlays
            post={post}
            currentMediaType={currentMediaType}
            carouselMedia={carouselMedia}
            currentCarouselIndex={currentCarouselIndex}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center p-4">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm mb-1">{isVideo ? 'Video' : 'Image'} unavailable</p>
            <p className="text-xs text-gray-400 mb-3">
              Tried {mediaUrls.length} source{mediaUrls.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 mb-3">Instagram content may be restricted</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded transition-colors mx-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
