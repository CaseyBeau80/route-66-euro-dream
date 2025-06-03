import React, { useState } from 'react';
import { InstagramPost } from '../types';
import { ImageOff, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaDisplayProps {
  post: InstagramPost;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Parse carousel media if available
  const getCarouselMedia = () => {
    if (post.media_type !== 'CAROUSEL_ALBUM' || !post.carousel_media) {
      return [];
    }
    
    try {
      const carouselData = typeof post.carousel_media === 'string' 
        ? JSON.parse(post.carousel_media) 
        : post.carousel_media;
      
      if (Array.isArray(carouselData)) {
        console.log(`🎠 Parsed ${carouselData.length} carousel items for post ${post.id}`);
        return carouselData;
      }
      
      console.warn(`⚠️ Carousel data is not an array for post ${post.id}:`, carouselData);
      return [];
    } catch (error) {
      console.error(`❌ Failed to parse carousel media for post ${post.id}:`, error);
      return [];
    }
  };

  // Enhanced URL generation with more fallback strategies
  const getMediaUrls = () => {
    const urls = [];
    
    if (post.media_type === 'CAROUSEL_ALBUM') {
      const carouselMedia = getCarouselMedia();
      
      if (carouselMedia.length > 0 && carouselMedia[currentCarouselIndex]) {
        const currentMedia = carouselMedia[currentCarouselIndex];
        
        console.log(`🔍 Carousel item ${currentCarouselIndex}:`, currentMedia);
        
        // Add carousel item URLs with variations
        if (currentMedia.media_url) {
          urls.push(currentMedia.media_url);
          
          // Add URL variations for carousel media
          const variations = generateUrlVariations(currentMedia.media_url);
          urls.push(...variations);
        }
        
        if (currentMedia.thumbnail_url && currentMedia.thumbnail_url !== currentMedia.media_url) {
          urls.push(currentMedia.thumbnail_url);
          
          const thumbnailVariations = generateUrlVariations(currentMedia.thumbnail_url);
          urls.push(...thumbnailVariations);
        }
      }
    }
    
    // Add main post URLs with variations
    if (post.media_url && !urls.includes(post.media_url)) {
      urls.push(post.media_url);
      
      const variations = generateUrlVariations(post.media_url);
      urls.push(...variations);
    }
    
    if (post.thumbnail_url && post.thumbnail_url !== post.media_url && !urls.includes(post.thumbnail_url)) {
      urls.push(post.thumbnail_url);
      
      const thumbnailVariations = generateUrlVariations(post.thumbnail_url);
      urls.push(...thumbnailVariations);
    }
    
    // Remove duplicates and filter out invalid URLs
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '' && isValidUrl(url));
    console.log(`🎯 Generated ${uniqueUrls.length} unique URLs for post ${post.id}:`, uniqueUrls);
    
    return uniqueUrls;
  };

  // Generate URL variations to improve loading success
  const generateUrlVariations = (originalUrl: string): string[] => {
    if (!originalUrl || !originalUrl.includes('instagram.com')) {
      return [];
    }

    const variations = [];
    
    try {
      // Remove specific Instagram parameters that might cause issues
      let cleanUrl = originalUrl
        .replace(/&efg=[^&]*/, '')
        .replace(/&_nc_ht=[^&]*/, '')
        .replace(/&_nc_cat=[^&]*/, '')
        .replace(/&_nc_oc=[^&]*/, '')
        .replace(/&_nc_ohc=[^&]*/, '')
        .replace(/&_nc_gid=[^&]*/, '')
        .replace(/&edm=[^&]*/, '')
        .replace(/&ccb=[^&]*/, '')
        .replace(/&ig_cache_key=[^&]*/, '')
        .replace(/&oh=[^&]*/, '')
        .replace(/&oe=[^&]*/, '')
        .replace(/&_nc_sid=[^&]*/, '')
        .replace(/\?se=-1/, '')
        .replace(/&stp=[^&]*/, '');

      // Clean up multiple & or trailing &
      cleanUrl = cleanUrl.replace(/&+/g, '&').replace(/&$/, '').replace(/\?&/, '?');
      
      if (cleanUrl !== originalUrl && !cleanUrl.endsWith('?')) {
        variations.push(cleanUrl);
      }

      // Try with different size parameters
      if (originalUrl.includes('s1080x1080')) {
        variations.push(originalUrl.replace('s1080x1080', 's640x640'));
        variations.push(originalUrl.replace('s1080x1080', 's480x480'));
      }

      // Try without query parameters entirely
      const urlWithoutQuery = originalUrl.split('?')[0];
      if (urlWithoutQuery !== originalUrl) {
        variations.push(urlWithoutQuery);
      }

    } catch (error) {
      console.warn(`⚠️ Error generating URL variations for ${originalUrl}:`, error);
    }

    return variations;
  };

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http') && url.includes('instagram.com');
    } catch {
      return false;
    }
  };

  const mediaUrls = getMediaUrls();
  const carouselMedia = getCarouselMedia();
  const isCarousel = post.media_type === 'CAROUSEL_ALBUM' && carouselMedia.length > 1;

  const handleMediaLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log(`✅ Successfully loaded media for post ${post.id} using URL ${currentImageIndex + 1}/${mediaUrls.length}: ${mediaUrls[currentImageIndex]}`);
  };

  const handleMediaError = () => {
    const failedUrl = mediaUrls[currentImageIndex];
    console.error(`❌ Failed to load media ${currentImageIndex + 1}/${mediaUrls.length} for post ${post.id}: ${failedUrl}`);
    
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

  const handleCarouselPrevious = () => {
    setCurrentCarouselIndex(prev => prev > 0 ? prev - 1 : carouselMedia.length - 1);
    setCurrentImageIndex(0);
    setImageError(false);
    setImageLoading(true);
    setRetryCount(0);
  };

  const handleCarouselNext = () => {
    setCurrentCarouselIndex(prev => prev < carouselMedia.length - 1 ? prev + 1 : 0);
    setCurrentImageIndex(0);
    setImageError(false);
    setImageLoading(true);
    setRetryCount(0);
  };

  const getCurrentMediaUrl = () => {
    return mediaUrls[currentImageIndex] || '';
  };

  const getCurrentMediaType = () => {
    if (post.media_type === 'CAROUSEL_ALBUM' && carouselMedia[currentCarouselIndex]) {
      return carouselMedia[currentCarouselIndex].media_type || 'IMAGE';
    }
    return post.media_type;
  };

  const isVideo = getCurrentMediaType() === 'VIDEO';

  // If no valid media URLs, show error immediately
  if (mediaUrls.length === 0) {
    console.error(`❌ No valid media URLs found for post ${post.id}`);
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No media available</p>
            <p className="text-xs text-gray-400 mt-1">Instagram content unavailable</p>
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
                  {retryCount > 0 && <span className="block">Try {retryCount + 1}/{mediaUrls.length}</span>}
                </p>
              </div>
            </div>
          )}
          
          {isVideo ? (
            <video 
              key={`${post.id}-${currentCarouselIndex}-${currentImageIndex}-${retryCount}`}
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
              key={`${post.id}-${currentCarouselIndex}-${currentImageIndex}-${retryCount}`}
              src={getCurrentMediaUrl()} 
              alt={post.caption || 'Route 66 Instagram post'}
              className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleMediaLoad}
              onError={handleMediaError}
              crossOrigin="anonymous"
              loading="lazy"
            />
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center p-4">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm mb-1">{isVideo ? 'Video' : 'Image'} unavailable</p>
            <p className="text-xs text-gray-400 mb-3">
              Tried {mediaUrls.length} source{mediaUrls.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 mb-3">Instagram content may be restricted</p>
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
      
      {/* Carousel Navigation */}
      {isCarousel && !imageError && (
        <>
          <button
            onClick={handleCarouselPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all duration-200 z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleCarouselNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-full transition-all duration-200 z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Carousel Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {carouselMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentCarouselIndex(index);
                  setCurrentImageIndex(0);
                  setImageError(false);
                  setImageLoading(true);
                  setRetryCount(0);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentCarouselIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
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
          {getCurrentMediaType() === 'VIDEO' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
              VIDEO
            </div>
          )}
          {post.media_type === 'CAROUSEL_ALBUM' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-bold">
              📸 {currentCarouselIndex + 1}/{carouselMedia.length}
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
