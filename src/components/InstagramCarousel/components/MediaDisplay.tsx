
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import { ImageOff, Play, RotateCcw } from 'lucide-react';

interface MediaDisplayProps {
  post: InstagramPost;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Get multiple URL options for fallback with more strategies
  const getMediaUrls = () => {
    const urls = [];
    
    // Strategy 1: Primary media_url
    if (post.media_url) {
      urls.push(post.media_url);
    }
    
    // Strategy 2: Thumbnail URL (often more reliable)
    if (post.thumbnail_url && post.thumbnail_url !== post.media_url) {
      urls.push(post.thumbnail_url);
    }
    
    // Strategy 3: Try modifying URL parameters for better compatibility
    if (post.media_url) {
      // Remove some Instagram URL parameters that might cause issues
      const cleanUrl = post.media_url.split('&efg=')[0].split('&_nc_ht=')[0];
      if (cleanUrl !== post.media_url) {
        urls.push(cleanUrl);
      }
    }
    
    return urls.filter(url => url && url.trim() !== '');
  };

  const mediaUrls = getMediaUrls();

  const handleMediaLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log(`✅ Successfully loaded media for post ${post.id} (${post.media_type}) using URL ${currentImageIndex + 1}/${mediaUrls.length}`);
  };

  const handleMediaError = () => {
    console.error(`❌ Failed to load media ${currentImageIndex + 1}/${mediaUrls.length} for post ${post.id}: ${mediaUrls[currentImageIndex]}`);
    
    // Try next media URL if available
    if (currentImageIndex < mediaUrls.length - 1) {
      console.log(`🔄 Trying fallback media ${currentImageIndex + 2}/${mediaUrls.length}`);
      setCurrentImageIndex(prev => prev + 1);
      setImageLoading(true);
      setRetryCount(prev => prev + 1);
    } else {
      console.log(`💥 All ${mediaUrls.length} media URLs failed for post ${post.id}, showing placeholder`);
      setImageLoading(false);
      setImageError(true);
    }
  };

  const handleRetry = () => {
    console.log(`🔄 Retrying media load for post ${post.id}`);
    setCurrentImageIndex(0);
    setImageError(false);
    setImageLoading(true);
    setRetryCount(0);
  };

  const getCurrentMediaUrl = () => {
    return mediaUrls[currentImageIndex] || '';
  };

  const isVideo = post.media_type === 'VIDEO';

  // If no valid media URLs, show error immediately
  if (mediaUrls.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No media URL available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      {!imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2 animate-spin"></div>
                <p className="text-xs text-gray-500">
                  Loading {isVideo ? 'video' : 'image'}...
                  {retryCount > 0 && <span className="block">Retry {retryCount}/{mediaUrls.length}</span>}
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
            />
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center p-4">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm mb-2">{isVideo ? 'Video' : 'Image'} unavailable</p>
            <p className="text-xs text-gray-400 mb-3">Tried {mediaUrls.length} source{mediaUrls.length !== 1 ? 's' : ''}</p>
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
      
      {!imageError && (
        <>
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <Play className="w-8 h-8 text-white" fill="white" />
              </div>
            </div>
          )}
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
              VIDEO
            </div>
          )}
          {post.media_type === 'CAROUSEL_ALBUM' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
              📸+
            </div>
          )}
          {post.is_featured && (
            <div className="absolute top-2 left-2 bg-route66-vintage-yellow text-black px-2 py-1 rounded text-xs font-bold">
              ⭐ FEATURED
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MediaDisplay;
