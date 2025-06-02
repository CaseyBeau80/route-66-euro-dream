
import React from 'react';
import { InstagramPost } from '../types';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';

interface InstagramCardProps {
  post: InstagramPost;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ post }) => {
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 vintage-paper-texture">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={post.thumbnail_url || post.media_url} 
          alt={post.caption || 'Route 66 Instagram post'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
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
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Caption */}
        <p className="font-travel text-gray-800 text-sm leading-relaxed mb-3">
          {truncateCaption(post.caption)}
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
