
import React, { useState } from 'react';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { InstagramPost } from '../types';

interface SimpleInstagramCardProps {
  post: InstagramPost;
  onLike: (postId: string) => void;
}

const SimpleInstagramCard: React.FC<SimpleInstagramCardProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    console.log(`✅ Image loaded successfully for post ${post.id}: ${post.media_url}`);
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`❌ Image failed to load for post ${post.id}: ${post.media_url}`);
    setIsLoading(false);
    setImageError(true);
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

  // Get the best available image URL
  const getImageUrl = () => {
    // Try thumbnail_url first, then media_url
    return post.thumbnail_url || post.media_url;
  };

  const imageUrl = getImageUrl();

  console.log(`🖼️ Rendering card for post ${post.id}:`, {
    media_url: post.media_url,
    thumbnail_url: post.thumbnail_url,
    selected_url: imageUrl,
    media_type: post.media_type
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Media */}
      <div className="relative aspect-square overflow-hidden" onClick={handleCardClick}>
        {!imageError && imageUrl ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2 animate-spin"></div>
                  <p className="text-xs text-gray-500">Loading image...</p>
                </div>
              </div>
            )}
            <img
              src={imageUrl}
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
              {!imageUrl && (
                <p className="text-xs opacity-75 mt-2">No image URL available</p>
              )}
            </div>
          </div>
        )}
        
        {/* Media type indicator */}
        {post.media_type === 'VIDEO' && !imageError && imageUrl && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
            VIDEO
          </div>
        )}
        
        {post.media_type === 'CAROUSEL_ALBUM' && !imageError && imageUrl && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            ALBUM
          </div>
        )}
        
        {/* Featured indicator */}
        {post.is_featured && !imageError && imageUrl && (
          <div className="absolute bottom-2 left-2 bg-route66-vintage-yellow text-black px-2 py-1 rounded text-xs font-bold">
            ⭐ FEATURED
          </div>
        )}
        
        {/* External link overlay */}
        {!imageError && imageUrl && (
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
            
            {/* Comments */}
            <div className="flex items-center gap-1 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments_count || 0}</span>
            </div>
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
