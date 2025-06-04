
import React, { useState, useEffect } from 'react';
import { InstagramPost } from '../types';
import { RotateCcw } from 'lucide-react';
import { MediaUrlGenerator } from './MediaUrlGenerator';
import MediaLoader from './MediaLoader';

interface MediaDisplayProps {
  post: InstagramPost;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  const urlGenerator = new MediaUrlGenerator(post);
  const currentMediaType = urlGenerator.getCurrentMediaType();
  const isVideo = currentMediaType === 'VIDEO';
  const isReel = isVideo && urlGenerator['isLikelyReel']?.();

  // Load media URLs asynchronously
  useEffect(() => {
    const loadMediaUrls = async () => {
      setIsLoadingUrls(true);
      try {
        console.log(`🔄 Loading media URLs for post ${post.id}`);
        const urls = await urlGenerator.getMediaUrls();
        setMediaUrls(urls);
        console.log(`✅ Loaded ${urls.length} media URLs for post ${post.id}`);
      } catch (error) {
        console.error(`❌ Failed to load media URLs for post ${post.id}:`, error);
        // Fall back to sync URLs
        const syncUrls = urlGenerator.getMediaUrlsSync();
        setMediaUrls(syncUrls);
        console.log(`🔄 Using sync URLs as fallback for post ${post.id}: ${syncUrls.length} URLs`);
      } finally {
        setIsLoadingUrls(false);
      }
    };

    loadMediaUrls();
  }, [post.id, retryCount]);

  const handleMediaLoad = () => {
    setImageError(false);
    console.log(`✅ Successfully loaded media for post ${post.id}`);
  };

  const handleMediaError = () => {
    console.log(`⚠️ Media error for post ${post.id}, showing fallback`);
    setImageError(true);
  };

  const handleRetry = () => {
    console.log(`🔄 Retrying media load for post ${post.id}`);
    setCurrentImageIndex(0);
    setImageError(false);
    setRetryCount(prev => prev + 1);
  };

  const handleImageIndexChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Show loading state while URLs are being fetched
  if (isLoadingUrls) {
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-200 animate-pulse">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2 animate-spin"></div>
            <p className="text-xs text-gray-500">Loading media...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no valid media URLs, show Route 66 themed placeholder
  if (mediaUrls.length === 0) {
    console.error(`❌ No valid media URLs found for post ${post.id}`);
    return (
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-route66-vintage-yellow via-route66-rust to-route66-vintage-brown">
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-2">🛣️</div>
            <p className="text-sm font-bold mb-1">Route 66 Memory</p>
            <p className="text-xs opacity-90">Content from the road</p>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Instagram Post
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      {!imageError ? (
        <MediaLoader
          post={post}
          mediaUrls={mediaUrls}
          currentImageIndex={currentImageIndex}
          isVideo={isVideo}
          onLoad={handleMediaLoad}
          onError={handleMediaError}
          onImageIndexChange={handleImageIndexChange}
          retryCount={retryCount}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-route66-vintage-yellow via-route66-rust to-route66-vintage-brown text-white">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🛣️</div>
            <p className="text-sm font-bold mb-1">Route 66 Memory</p>
            <p className="text-xs opacity-90 mb-3">Instagram content unavailable</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded transition-colors mx-auto backdrop-blur-sm"
            >
              <RotateCcw className="w-3 h-3" />
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Enhanced media type indicators */}
      {isReel && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span>🎬</span> REEL
        </div>
      )}
      
      {isVideo && !isReel && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
          VIDEO
        </div>
      )}
      
      {post.is_featured && (
        <div className="absolute top-2 left-2 bg-route66-vintage-yellow text-black px-2 py-1 rounded text-xs font-bold">
          ⭐ FEATURED
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
