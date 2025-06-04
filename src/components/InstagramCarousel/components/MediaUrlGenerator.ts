
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

  // More conservative URL generation - only try the most reliable sources
  getMediaUrls(): string[] {
    const urls = [];
    
    if (this.post.media_type === 'CAROUSEL_ALBUM') {
      const carouselMedia = this.getCarouselMedia();
      
      if (carouselMedia.length > 0 && carouselMedia[this.currentCarouselIndex]) {
        const currentMedia = carouselMedia[this.currentCarouselIndex];
        
        console.log(`🔍 Carousel item ${this.currentCarouselIndex}:`, currentMedia);
        
        // Only try thumbnail_url for carousel items as it's most likely to work
        if (currentMedia.thumbnail_url) {
          urls.push(currentMedia.thumbnail_url);
        }
      }
    }
    
    // Add main post thumbnail URL only - it's the most stable
    if (this.post.thumbnail_url && !urls.includes(this.post.thumbnail_url)) {
      urls.push(this.post.thumbnail_url);
    }
    
    // Filter out invalid URLs and limit to 2 attempts max
    const validUrls = urls.filter(url => url && url.trim() !== '' && this.isValidUrl(url)).slice(0, 2);
    
    console.log(`🎯 Generated ${validUrls.length} URLs for post ${this.post.id}:`, validUrls);
    
    return validUrls;
  }

  // Validate URL format
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http');
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
