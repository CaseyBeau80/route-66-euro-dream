
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import { Heart, MessageCircle, ExternalLink, ImageOff } from 'lucide-react';

interface InstagramCardProps {
  post: InstagramPost;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatHashtags = (hashtags: string[] | null) => {
    if (!hashtags || hashtags.length === 0) return '';
    return hashtags.map(tag => `#${tag}`).join(' ');
  };

  const formatCount = (count: number | null) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const truncateCaption = (caption: string | null, maxLength: number = 100) => {
    if (!caption) return '';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  // Get multiple image URL options for fallback
  const getImageUrls = () => {
    const urls = [];
    
    // Primary URL (thumbnail if available, otherwise media_url)
    if (post.thumbnail_url) {
      urls.push(post.thumbnail_url);
    }
    if (post.media_url) {
      urls.push(post.media_url);
    }
    
    return urls.filter(url => url && url.trim() !== '');
  };

  const imageUrls = getImageUrls();

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log(`✅ Successfully loaded image for post ${post.id}`);
  };

  const handleImageError = () => {
    console.error(`❌ Failed to load image ${currentImageIndex + 1}/${imageUrls.length} for post ${post.id}: ${imageUrls[currentImageIndex]}`);
    
    // Try next image URL if available
    if (currentImageIndex < imageUrls.length - 1) {
      console.log(`🔄 Trying fallback image ${currentImageIndex + 2}/${imageUrls.length}`);
      setCurrentImageIndex(prev => prev + 1);
      setImageLoading(true);
    } else {
      console.log(`💥 All image URLs failed for post ${post.id}, showing placeholder`);
      setImageLoading(false);
      setImageError(true);
    }
  };

  const getCurrentImageUrl = () => {
    return imageUrls[currentImageIndex] || '';
  };

  // If no valid image URLs, show error immediately
  if (imageUrls.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <div className="text-center">
              <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="font-travel text-gray-800 text-sm leading-relaxed mb-3">
            {truncateCaption(post.caption) || 'No caption available'}
          </p>

          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{formatCount(post.like_count)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span>{formatCount(post.comments_count)}</span>
              </div>
            </div>
            
            <a 
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-route66-rust hover:text-route66-vintage-brown transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </a>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {new Date(post.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                  <p className="text-xs text-gray-500">Loading image...</p>
                </div>
              </div>
            )}
            <img 
              key={`${post.id}-${currentImageIndex}`}
              src={getCurrentImageUrl()} 
              alt={post.caption || 'Route 66 Instagram post'}
              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <div className="text-center">
              <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Image unavailable</p>
              <p className="text-xs text-gray-400 mt-1">Tried {imageUrls.length} source{imageUrls.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
        
        {!imageError && (
          <>
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

      {/* Content */}
      <div className="p-4">
        {/* Caption */}
        <p className="font-travel text-gray-800 text-sm leading-relaxed mb-3">
          {truncateCaption(post.caption) || 'No caption available'}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="text-route66-rust text-xs mb-3 font-medium">
            {formatHashtags(post.hashtags)}
          </p>
        )}

        {/* Location */}
        {post.location_name && (
          <p className="text-gray-600 text-xs mb-3 flex items-center gap-1">
            📍 {post.location_name}
          </p>
        )}

        {/* Stats and Link */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{formatCount(post.like_count)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>{formatCount(post.comments_count)}</span>
            </div>
          </div>
          
          <a 
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-route66-rust hover:text-route66-vintage-brown transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </a>
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-xs text-gray-500">
          {new Date(post.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default InstagramCard;
