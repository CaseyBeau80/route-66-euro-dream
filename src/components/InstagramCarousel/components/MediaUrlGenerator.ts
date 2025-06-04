
import { InstagramPost } from '../types';

export class MediaUrlGenerator {
  private post: InstagramPost;
  private currentCarouselIndex: number;

  constructor(post: InstagramPost, currentCarouselIndex: number = 0) {
    this.post = post;
    this.currentCarouselIndex = currentCarouselIndex;
  }

  // Parse carousel media if available
  getCarouselMedia() {
    if (this.post.media_type !== 'CAROUSEL_ALBUM' || !this.post.carousel_media) {
      return [];
    }
    
    try {
      const carouselData = typeof this.post.carousel_media === 'string' 
        ? JSON.parse(this.post.carousel_media) 
        : this.post.carousel_media;
      
      if (Array.isArray(carouselData)) {
        console.log(`🎠 Parsed ${carouselData.length} carousel items for post ${this.post.id}`);
        return carouselData;
      }
      
      console.warn(`⚠️ Carousel data is not an array for post ${this.post.id}:`, carouselData);
      return [];
    } catch (error) {
      console.error(`❌ Failed to parse carousel media for post ${this.post.id}:`, error);
      return [];
    }
  }

  // More comprehensive URL generation with better fallbacks
  getMediaUrls(): string[] {
    const urls = [];
    
    console.log(`🔍 Analyzing post ${this.post.id}:`, {
      media_type: this.post.media_type,
      has_media_url: !!this.post.media_url,
      has_thumbnail_url: !!this.post.thumbnail_url,
      has_carousel_media: !!this.post.carousel_media,
      currentCarouselIndex: this.currentCarouselIndex
    });
    
    if (this.post.media_type === 'CAROUSEL_ALBUM') {
      const carouselMedia = this.getCarouselMedia();
      
      if (carouselMedia.length > 0 && carouselMedia[this.currentCarouselIndex]) {
        const currentMedia = carouselMedia[this.currentCarouselIndex];
        
        console.log(`🔍 Carousel item ${this.currentCarouselIndex}:`, currentMedia);
        
        // Try both thumbnail_url and media_url for carousel items
        if (currentMedia.thumbnail_url) {
          urls.push(currentMedia.thumbnail_url);
        }
        if (currentMedia.media_url && currentMedia.media_url !== currentMedia.thumbnail_url) {
          urls.push(currentMedia.media_url);
        }
      }
    }
    
    // Always try main post URLs as fallbacks
    if (this.post.thumbnail_url && !urls.includes(this.post.thumbnail_url)) {
      urls.push(this.post.thumbnail_url);
    }
    
    if (this.post.media_url && !urls.includes(this.post.media_url)) {
      urls.push(this.post.media_url);
    }
    
    // Filter out invalid URLs and remove duplicates
    const validUrls = urls.filter(url => url && url.trim() !== '' && this.isValidUrl(url));
    
    console.log(`🎯 Generated ${validUrls.length} URLs for post ${this.post.id}:`, validUrls);
    
    // If we still have no URLs, log detailed info for debugging
    if (validUrls.length === 0) {
      console.warn(`⚠️ No valid URLs found for post ${this.post.id}. Raw data:`, {
        media_url: this.post.media_url,
        thumbnail_url: this.post.thumbnail_url,
        carousel_media: this.post.carousel_media
      });
    }
    
    return validUrls;
  }

  // Validate URL format
  private isValidUrl(url: string): boolean {
    try {
      const validUrl = new URL(url);
      return validUrl.protocol === 'http:' || validUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  getCurrentMediaType(): string {
    if (this.post.media_type === 'CAROUSEL_ALBUM') {
      const carouselMedia = this.getCarouselMedia();
      if (carouselMedia[this.currentCarouselIndex]) {
        return carouselMedia[this.currentCarouselIndex].media_type || 'IMAGE';
      }
    }
    return this.post.media_type;
  }
}
