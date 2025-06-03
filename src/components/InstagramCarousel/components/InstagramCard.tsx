
import React from 'react';
import { InstagramPost } from '../types';
import MediaDisplay from './MediaDisplay';
import PostContent from './PostContent';
import PostStats from './PostStats';
import ErrorPlaceholder from './ErrorPlaceholder';

interface InstagramCardProps {
  post: InstagramPost;
}

const InstagramCard: React.FC<InstagramCardProps> = ({ post }) => {
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

  // If no valid media URLs, show error immediately
  if (mediaUrls.length === 0) {
    return <ErrorPlaceholder post={post} />;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Media */}
      <MediaDisplay post={post} />

      {/* Content */}
      <div className="p-4">
        <PostContent post={post} />
        <div className="mt-3">
          <PostStats post={post} />
        </div>
      </div>
    </div>
  );
};

export default InstagramCard;
