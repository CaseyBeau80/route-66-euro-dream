
import React, { useState, useEffect } from 'react';
import { InstagramPost } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import VideoPlayerComponent from './VideoPlayerComponent';

interface MediaLoaderProps {
  post: InstagramPost;
  mediaUrls: string[];
  currentImageIndex: number;
  isVideo: boolean;
  onLoad: () => void;
  onError: () => void;
  onImageIndexChange: (index: number) => void;
  retryCount: number;
}

const MediaLoader: React.FC<MediaLoaderProps> = ({
  post,
  mediaUrls,
  currentImageIndex,
  isVideo,
  onLoad,
  onError,
  onImageIndexChange,
  retryCount
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    setImageLoading(true);
    setShowPlaceholder(false);
    setLoadAttempts(0);
  }, [currentImageIndex, retryCount]);

  // If no valid URLs available, show placeholder immediately
  useEffect(() => {
    if (!mediaUrls || mediaUrls.length === 0) {
      console.log(`📸 No media URLs for post ${post.id}, showing placeholder immediately`);
      setShowPlaceholder(true);
      setImageLoading(false);
      onError();
    }
  }, [mediaUrls, post.id, onError]);

  const handleMediaLoad = () => {
    const currentUrl = mediaUrls[currentImageIndex];
    console.log(`✅ Successfully loaded ${isVideo ? 'video' : 'image'} for post ${post.id} using URL ${currentImageIndex + 1}/${mediaUrls.length}: ${currentUrl}`);
    setImageLoading(false);
    setShowPlaceholder(false);
    onLoad();
  };

  const handleMediaError = () => {
    const failedUrl = mediaUrls[currentImageIndex];
    const newAttempts = loadAttempts + 1;
    setLoadAttempts(newAttempts);
    
    console.error(`❌ Failed to load ${isVideo ? 'video' : 'image'} ${currentImageIndex + 1}/${mediaUrls.length} for post ${post.id}: ${failedUrl}`);
    
    // If this is the last URL, show placeholder
    if (currentImageIndex >= mediaUrls.length - 1) {
      console.log(`💥 Showing placeholder for post ${post.id} after ${currentImageIndex + 1} failed attempts`);
      setImageLoading(false);
      setShowPlaceholder(true);
      onError();
    } else {
      // Try next URL
      console.log(`🔄 Trying next media URL ${currentImageIndex + 2}/${mediaUrls.length}`);
      onImageIndexChange(currentImageIndex + 1);
      setImageLoading(true);
    }
  };

  const getCurrentMediaUrl = () => {
    return mediaUrls[currentImageIndex] || '';
  };

  // Show Route 66 themed placeholder
  if (showPlaceholder || mediaUrls.length === 0) {
    return (
      <div className="w-full h-full relative bg-gradient-to-br from-route66-vintage-yellow via-route66-rust to-route66-vintage-brown flex items-center justify-center">
        <div className="text-center text-white p-4">
          <div className="text-4xl mb-2">🛣️</div>
          <p className="text-sm font-bold mb-1">Route 66 Memory</p>
          <p className="text-xs opacity-90">
            {isVideo ? 'Video content protected' : 'Instagram content protected'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2 animate-spin"></div>
            <p className="text-xs text-gray-500">
              Loading {isVideo ? 'video' : 'image'}...
              {retryCount > 0 && <span className="block">Try {currentImageIndex + 1}/{mediaUrls.length}</span>}
            </p>
          </div>
        </div>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {isVideo ? (
              <VideoPlayerComponent
                key={`${post.id}-${currentImageIndex}-${retryCount}`}
                src={getCurrentMediaUrl()}
                poster={post.thumbnail_url || undefined}
                className={`${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={handleMediaLoad}
                onError={handleMediaError}
                muted={true}
                loop={true}
                playsInline={true}
                preload="metadata"
              />
            ) : (
              <img 
                key={`${post.id}-${currentImageIndex}-${retryCount}`}
                src={getCurrentMediaUrl()} 
                alt={post.caption || 'Route 66 Instagram post'}
                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={handleMediaLoad}
                onError={handleMediaError}
                crossOrigin="anonymous"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{isVideo ? 'Hover to loop • Click to view on Instagram' : 'Click to view on Instagram'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default MediaLoader;
