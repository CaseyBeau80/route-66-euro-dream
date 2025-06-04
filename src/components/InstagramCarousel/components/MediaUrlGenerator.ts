
import { InstagramPost } from '../types';
import { ImageProxyService } from '../services/ImageProxyService';

export class MediaUrlGenerator {
  private post: InstagramPost;

  constructor(post: InstagramPost) {
    this.post = post;
  }

  // Get media URLs with proxy fallback
  async getMediaUrls(): Promise<string[]> {
    const urls = [];
    
    console.log(`🔍 Analyzing post ${this.post.id}:`, {
      media_type: this.post.media_type,
      media_url: this.post.media_url,
      thumbnail_url: this.post.thumbnail_url
    });
    
    // Try thumbnail first (usually more reliable)
    if (this.post.thumbnail_url) {
      try {
        const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
          this.post.thumbnail_url, 
          this.post.id
        );
        urls.push(proxiedUrl);
      } catch (error) {
        console.warn(`⚠️ Failed to proxy thumbnail for post ${this.post.id}:`, error);
        // Still add original URL as fallback
        urls.push(this.post.thumbnail_url);
      }
    }
    
    // Then try media URL if different
    if (this.post.media_url && this.post.media_url !== this.post.thumbnail_url) {
      try {
        const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
          this.post.media_url, 
          this.post.id
        );
        urls.push(proxiedUrl);
      } catch (error) {
        console.warn(`⚠️ Failed to proxy media URL for post ${this.post.id}:`, error);
        // Still add original URL as fallback
        urls.push(this.post.media_url);
      }
    }
    
    console.log(`🎯 Generated ${urls.length} URLs for post ${this.post.id}:`, urls);
    
    return urls;
  }

  // Synchronous version for backward compatibility
  getMediaUrlsSync(): string[] {
    const urls = [];
    
    console.log(`🔍 Analyzing post ${this.post.id} (sync):`, {
      media_type: this.post.media_type,
      media_url: this.post.media_url,
      thumbnail_url: this.post.thumbnail_url
    });
    
    // Try thumbnail first (usually more reliable)
    if (this.post.thumbnail_url) {
      urls.push(this.post.thumbnail_url);
    }
    
    // Then try media URL if different
    if (this.post.media_url && this.post.media_url !== this.post.thumbnail_url) {
      urls.push(this.post.media_url);
    }
    
    console.log(`🎯 Generated ${urls.length} sync URLs for post ${this.post.id}:`, urls);
    
    return urls;
  }

  getCurrentMediaType(): string {
    return this.post.media_type;
  }
}
