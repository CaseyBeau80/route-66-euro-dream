
import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { InstagramPost } from '../types';
import { EnhancedMediaUrlService } from '../services/EnhancedMediaUrlService';

interface SimpleMediaDisplayProps {
  post: InstagramPost;
  onCardClick: () => void;
}

const SimpleMediaDisplay: React.FC<SimpleMediaDisplayProps> = ({ post, onCardClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);

  // Load optimized media URLs
  useEffect(() => {
    const loadMediaUrls = async () => {
      try {
        console.log(`🔄 Loading optimized URLs for post ${post.id}`);
        const urlService = new EnhancedMediaUrlService(post);
        const mediaData = await urlService.getOptimizedMediaUrls();
        
        setMediaUrls(mediaData.urls);
        setIsVideo(mediaData.mediaType === 'VIDEO');
        
        console.log(`✅ Loaded ${mediaData.urls.length} optimized URLs for post ${post.id}:`, mediaData.urls);
      } catch (error) {
        console.error(`❌ Failed to load optimized URLs for post ${post.id}:`, error);
        // Fallback to basic URLs
        const fallbackUrls = [post.thumbnail_url, post.media_url].filter(Boolean);
        setMediaUrls(fallbackUrls);
      }
    };

    loadMediaUrls();
  }, [post.id]);

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for post ${post.id}: ${getCurrentImageUrl()}`);
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    const currentUrl = getCurrentImageUrl();
    console.error(`❌ Image failed to load for post ${post.id}: ${currentUrl}`);
    
    // Try next URL if available
    if (currentUrlIndex < mediaUrls.length - 1) {
      console.log(`🔄 Trying next URL (${currentUrlIndex + 2}/${mediaUrls.length})`);
      setCurrentUrlIndex(currentUrlIndex + 1);
      setIsLoading(true);
    } else {
      console.log(`💥 All URLs failed for post ${post.id}, showing fallback`);
      setIsLoading(false);
      setImageError(true);
    }
  };

  const getCurrentImageUrl = () => {
    return mediaUrls[currentUrlIndex] || '';
  };

  const currentImageUrl = getCurrentImageUrl();

  return (
    <div className="relative aspect-square overflow-hidden" onClick={onCardClick}>
      {!imageError && currentImageUrl ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2 animate-spin"></div>
                <p className="text-xs text-gray-500">Loading image...</p>
                {mediaUrls.length > 1 && (
                  <p className="text-xs text-gray-400">Try {currentUrlIndex + 1}/{mediaUrls.length}</p>
                )}
              </div>
            </div>
          )}
          <img
            key={`${post.id}-${currentUrlIndex}`}
            src={currentImageUrl}
            alt={post.caption || 'Route 66 Instagram post'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-route66-vintage-yellow via-route66-rust to-route66-vintage-brown flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-4xl mb-2">🛣️</div>
            <p className="text-sm font-bold mb-1">Route 66 Memory</p>
            <p className="text-xs opacity-90">Content from the road</p>
            {mediaUrls.length === 0 && (
              <p className="text-xs opacity-75 mt-2">No image URL available</p>
            )}
          </div>
        </div>
      )}
      
      {/* Media type indicators */}
      {isVideo && !imageError && currentImageUrl && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
          <span>🎬</span> REEL
        </div>
      )}
      
      {post.media_type === 'CAROUSEL_ALBUM' && !imageError && currentImageUrl && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          ALBUM
        </div>
      )}
      
      {/* Featured indicator */}
      {post.is_featured && !imageError && currentImageUrl && (
        <div className="absolute bottom-2 left-2 bg-route66-vintage-yellow text-black px-2 py-1 rounded text-xs font-bold">
          ⭐ FEATURED
        </div>
      )}
      
      {/* External link overlay */}
      {!imageError && currentImageUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity duration-300">
          <div className="bg-white bg-opacity-90 rounded-full p-2">
            <ExternalLink className="w-6 h-6 text-route66-rust" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMediaDisplay;
