
import React, { useState, useEffect } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { InstagramPost } from '../types';
import { EnhancedMediaUrlService } from '../services/EnhancedMediaUrlService';

interface SimpleInstagramCardProps {
  post: InstagramPost;
  onLike: (postId: string) => void;
}

const SimpleInstagramCard: React.FC<SimpleInstagramCardProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
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

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handleCardClick = () => {
    if (post.permalink) {
      window.open(post.permalink, '_blank', 'noopener,noreferrer');
    }
  };

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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateCaption = (caption: string | undefined, maxLength: number = 100) => {
    if (!caption) return '';
    return caption.length > maxLength ? caption.substring(0, maxLength) + '...' : caption;
  };

  const currentImageUrl = getCurrentImageUrl();

  console.log(`🖼️ Rendering card for post ${post.id}:`, {
    mediaUrlsCount: mediaUrls.length,
    currentUrlIndex,
    currentUrl: currentImageUrl,
    isVideo,
    isLoading,
    imageError
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Media */}
      <div className="relative aspect-square overflow-hidden" onClick={handleCardClick}>
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
        
        {/* Media type indicator */}
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

      {/* Content */}
      <div className="p-4">
        {/* Caption */}
        {post.caption && (
          <p className="text-gray-800 text-sm mb-3 leading-relaxed">
            {truncateCaption(post.caption)}
          </p>
        )}
        
        {/* Location */}
        {post.location_name && (
          <p className="text-gray-500 text-xs mb-3 flex items-center">
            📍 {post.location_name}
          </p>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors duration-200 ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
            </button>
          </div>
          
          {/* Date */}
          <span className="text-gray-500 text-xs">
            {formatDate(post.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleInstagramCard;
