
import React, { useState, useEffect } from 'react';
import { InstagramPost } from '../types';

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
  const [hasTriedAllUrls, setHasTriedAllUrls] = useState(false);

  useEffect(() => {
    setImageLoading(true);
    setHasTriedAllUrls(false);
  }, [currentImageIndex, retryCount]);

  const handleMediaLoad = () => {
    console.log(`✅ Successfully loaded media for post ${post.id} using URL ${currentImageIndex + 1}/${mediaUrls.length}`);
    setImageLoading(false);
    setHasTriedAllUrls(false);
    onLoad();
  };

  const handleMediaError = () => {
    const failedUrl = mediaUrls[currentImageIndex];
    console.error(`❌ Failed to load media ${currentImageIndex + 1}/${mediaUrls.length} for post ${post.id}: ${failedUrl}`);
    
    // Try next media URL if available
    if (currentImageIndex < mediaUrls.length - 1) {
      console.log(`🔄 Trying fallback media ${currentImageIndex + 2}/${mediaUrls.length}`);
      onImageIndexChange(currentImageIndex + 1);
      setImageLoading(true);
    } else {
      console.log(`💥 All ${mediaUrls.length} media URLs failed for post ${post.id}, using placeholder`);
      setImageLoading(false);
      setHasTriedAllUrls(true);
      onError();
    }
  };

  const getCurrentMediaUrl = () => {
    return mediaUrls[currentImageIndex] || '';
  };

  // If all URLs failed, show a Route 66 themed placeholder
  if (hasTriedAllUrls) {
    return (
      <div className="w-full h-full relative bg-gradient-to-br from-route66-vintage-yellow via-route66-rust to-route66-vintage-brown flex items-center justify-center">
        <div className="text-center text-white p-4">
          <div className="text-4xl mb-2">🛣️</div>
          <p className="text-sm font-bold mb-1">Route 66 Memory</p>
          <p className="text-xs opacity-90">Image from the road</p>
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Instagram Post
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
      
      {isVideo ? (
        <video 
          key={`${post.id}-${currentImageIndex}-${retryCount}`}
          src={getCurrentMediaUrl()} 
          className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadedData={handleMediaLoad}
          onError={handleMediaError}
          controls={false}
          muted
          playsInline
          poster={post.thumbnail_url || undefined}
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
        />
      )}
    </>
  );
};

export default MediaLoader;
