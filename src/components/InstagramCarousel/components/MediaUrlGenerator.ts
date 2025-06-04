
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

  // Enhanced URL generation with more fallback strategies
  getMediaUrls(): string[] {
    const urls = [];
    
    if (this.post.media_type === 'CAROUSEL_ALBUM') {
      const carouselMedia = this.getCarouselMedia();
      
      if (carouselMedia.length > 0 && carouselMedia[this.currentCarouselIndex]) {
        const currentMedia = carouselMedia[this.currentCarouselIndex];
        
        console.log(`🔍 Carousel item ${this.currentCarouselIndex}:`, currentMedia);
        
        // Add carousel item URLs with variations
        if (currentMedia.media_url) {
          urls.push(currentMedia.media_url);
          
          // Add URL variations for carousel media
          const variations = this.generateUrlVariations(currentMedia.media_url);
          urls.push(...variations);
        }
        
        if (currentMedia.thumbnail_url && currentMedia.thumbnail_url !== currentMedia.media_url) {
          urls.push(currentMedia.thumbnail_url);
          
          const thumbnailVariations = this.generateUrlVariations(currentMedia.thumbnail_url);
          urls.push(...thumbnailVariations);
        }
      }
    }
    
    // Add main post URLs with variations
    if (this.post.media_url && !urls.includes(this.post.media_url)) {
      urls.push(this.post.media_url);
      
      const variations = this.generateUrlVariations(this.post.media_url);
      urls.push(...variations);
    }
    
    if (this.post.thumbnail_url && this.post.thumbnail_url !== this.post.media_url && !urls.includes(this.post.thumbnail_url)) {
      urls.push(this.post.thumbnail_url);
      
      const thumbnailVariations = this.generateUrlVariations(this.post.thumbnail_url);
      urls.push(...thumbnailVariations);
    }
    
    // Remove duplicates and filter out invalid URLs
    const uniqueUrls = [...new Set(urls)].filter(url => url && url.trim() !== '' && this.isValidUrl(url));
    console.log(`🎯 Generated ${uniqueUrls.length} unique URLs for post ${this.post.id}:`, uniqueUrls);
    
    return uniqueUrls;
  }

  // Generate URL variations to improve loading success
  private generateUrlVariations(originalUrl: string): string[] {
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
  }

  // Validate URL format
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http') && url.includes('instagram.com');
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
