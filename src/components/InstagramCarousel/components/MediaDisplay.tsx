
import React, { useState, useEffect } from 'react';
import { InstagramPost } from '../types';
import { RotateCcw } from 'lucide-react';
import { EnhancedMediaUrlService } from '../services/EnhancedMediaUrlService';
import { EnhancedReelDetectionService } from '../services/EnhancedReelDetectionService';
import MediaLoader from './MediaLoader';

interface MediaDisplayProps {
  post: InstagramPost;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [mediaData, setMediaData] = useState<{
    urls: string[];
    mediaType: 'IMAGE' | 'VIDEO';
    confidence: number;
  } | null>(null);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);

  // Load media URLs asynchronously with enhanced detection
  useEffect(() => {
    const loadMediaData = async () => {
      setIsLoadingUrls(true);
      try {
        console.log(`🔄 Loading enhanced media data for post ${post.id}`);
        const urlService = new EnhancedMediaUrlService(post);
        const data = await urlService.getOptimizedMediaUrls();
        setMediaData(data);
        console.log(`✅ Loaded enhanced media data for post ${post.id}:`, {
          urlCount: data.urls.length,
          mediaType: data.mediaType,
          confidence: data.confidence
        });
      } catch (error) {
        console.error(`❌ Failed to load enhanced media data for post ${post.id}:`, error);
        // Fallback to basic detection
        const analysis = EnhancedReelDetectionService.analyzePost(post);
        const fallbackUrls = [post.media_url, post.thumbnail_url].filter(Boolean);
        setMediaData({
          urls: fallbackUrls,
          mediaType: analysis.isVideo ? 'VIDEO' : 'IMAGE',
          confidence: analysis.confidence
        });
        console.log(`🔄 Using fallback media data for post ${post.id}`);
      } finally {
        setIsLoadingUrls(false);
      }
    };

    loadMediaData();
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
            <p className="text-xs text-gray-500">Analyzing media...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no valid media URLs, show Route 66 themed placeholder
  if (!mediaData || mediaData.urls.length === 0) {
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

  const isVideo = mediaData.mediaType === 'VIDEO';
  const isHighConfidenceVideo = isVideo && mediaData.confidence >= 70;

  return (
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      {!imageError ? (
        <MediaLoader
          post={post}
          mediaUrls={mediaData.urls}
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
      {isHighConfidenceVideo && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span>🎬</span> REEL
        </div>
      )}
      
      {isVideo && !isHighConfidenceVideo && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
          VIDEO
        </div>
      )}

      {/* Show confidence indicator for debugging */}
      {mediaData.confidence < 90 && (
        <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {mediaData.confidence}% confidence
        </div>
      )}
      
      {post.is_featured && (
        <div className="absolute bottom-2 left-2 bg-route66-vintage-yellow text-black px-2 py-1 rounded text-xs font-bold">
          ⭐ FEATURED
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
