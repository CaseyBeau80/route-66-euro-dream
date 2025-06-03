
import React from 'react';
import { InstagramPost } from '../types';

interface PostContentProps {
  post: InstagramPost;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const formatHashtags = (hashtags: string[] | null) => {
    if (!hashtags || hashtags.length === 0) return '';
    return hashtags.map(tag => `#${tag}`).join(' ');
  };

  const truncateCaption = (caption: string | null, maxLength: number = 100) => {
    if (!caption) return '';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  const getCarouselCount = () => {
    if (post.media_type !== 'CAROUSEL_ALBUM' || !post.carousel_media) {
      return 0;
    }
    
    try {
      const carouselData = typeof post.carousel_media === 'string' 
        ? JSON.parse(post.carousel_media) 
        : post.carousel_media;
      
      return Array.isArray(carouselData) ? carouselData.length : 0;
    } catch (error) {
      return 0;
    }
  };

  const carouselCount = getCarouselCount();

  return (
    <div className="space-y-3">
      {/* Media Type Indicator */}
      {post.media_type === 'CAROUSEL_ALBUM' && carouselCount > 1 && (
        <div className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          📸 Carousel ({carouselCount} photos)
        </div>
      )}
      
      {/* Caption */}
      <p className="font-travel text-gray-800 text-sm leading-relaxed">
        {truncateCaption(post.caption) || 'No caption available'}
      </p>

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <p className="text-route66-rust text-xs font-medium">
          {formatHashtags(post.hashtags)}
        </p>
      )}

      {/* Location */}
      {post.location_name && (
        <p className="text-gray-600 text-xs flex items-center gap-1">
          📍 {post.location_name}
        </p>
      )}
    </div>
  );
};

export default PostContent;
