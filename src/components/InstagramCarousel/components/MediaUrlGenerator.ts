
import { InstagramPost } from '../types';
import { ImageProxyService } from '../services/ImageProxyService';

export class MediaUrlGenerator {
  private post: InstagramPost;

  constructor(post: InstagramPost) {
    this.post = post;
  }

  // Enhanced media type detection with Reel support
  private detectActualMediaType(): 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' {
    // Check if this looks like a Reel based on URL patterns
    if (this.isLikelyReel()) {
      console.log(`🎬 Detected Reel for post ${this.post.id}: ${this.post.media_url}`);
      return 'VIDEO';
    }

    // Return the stored media type
    return this.post.media_type;
  }

  // Check if the post is likely a Reel based on URL patterns or other indicators
  private isLikelyReel(): boolean {
    const mediaUrl = this.post.media_url || '';
    const thumbnailUrl = this.post.thumbnail_url || '';
    
    // Instagram Reel URL patterns
    const reelPatterns = [
      /\/reel\//i,
      /\/reels\//i,
      /\/p\/.*\/.*video/i,
      /\.mp4/i,
      /video/i
    ];

    // Check if any URL contains Reel indicators
    const urlsToCheck = [mediaUrl, thumbnailUrl, this.post.permalink || ''];
    
    for (const url of urlsToCheck) {
      if (reelPatterns.some(pattern => pattern.test(url))) {
        return true;
      }
    }

    // Check if we have a thumbnail but the media_type is incorrectly set to IMAGE
    // This often happens with Reels
    if (this.post.thumbnail_url && this.post.media_type === 'IMAGE') {
      // If there's a separate thumbnail URL, it's likely a video
      if (this.post.media_url !== this.post.thumbnail_url) {
        console.log(`🔍 Potential Reel detected: post ${this.post.id} has separate thumbnail and media URLs`);
        return true;
      }
    }

    return false;
  }

  // Get media URLs with enhanced Reel handling
  async getMediaUrls(): Promise<string[]> {
    const urls = [];
    const actualMediaType = this.detectActualMediaType();
    
    console.log(`🔍 Analyzing post ${this.post.id}:`, {
      stored_media_type: this.post.media_type,
      detected_media_type: actualMediaType,
      media_url: this.post.media_url,
      thumbnail_url: this.post.thumbnail_url,
      is_likely_reel: this.isLikelyReel()
    });
    
    // For videos/Reels, prioritize the main media URL
    if (actualMediaType === 'VIDEO') {
      // Try main media URL first for videos
      if (this.post.media_url) {
        try {
          const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
            this.post.media_url, 
            this.post.id
          );
          urls.push(proxiedUrl);
        } catch (error) {
          console.warn(`⚠️ Failed to proxy video URL for post ${this.post.id}:`, error);
          urls.push(this.post.media_url);
        }
      }
      
      // Then try thumbnail as fallback
      if (this.post.thumbnail_url && this.post.thumbnail_url !== this.post.media_url) {
        try {
          const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
            this.post.thumbnail_url, 
            this.post.id
          );
          urls.push(proxiedUrl);
        } catch (error) {
          console.warn(`⚠️ Failed to proxy thumbnail for video post ${this.post.id}:`, error);
          urls.push(this.post.thumbnail_url);
        }
      }
    } else {
      // For images, try thumbnail first (usually more reliable)
      if (this.post.thumbnail_url) {
        try {
          const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
            this.post.thumbnail_url, 
            this.post.id
          );
          urls.push(proxiedUrl);
        } catch (error) {
          console.warn(`⚠️ Failed to proxy thumbnail for post ${this.post.id}:`, error);
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
          urls.push(this.post.media_url);
        }
      }
    }
    
    console.log(`🎯 Generated ${urls.length} URLs for post ${this.post.id} (${actualMediaType}):`, urls);
    
    return urls;
  }

  // Synchronous version for backward compatibility
  getMediaUrlsSync(): string[] {
    const urls = [];
    const actualMediaType = this.detectActualMediaType();
    
    console.log(`🔍 Analyzing post ${this.post.id} (sync):`, {
      stored_media_type: this.post.media_type,
      detected_media_type: actualMediaType,
      media_url: this.post.media_url,
      thumbnail_url: this.post.thumbnail_url
    });
    
    // For videos/Reels, prioritize the main media URL
    if (actualMediaType === 'VIDEO') {
      if (this.post.media_url) {
        urls.push(this.post.media_url);
      }
      if (this.post.thumbnail_url && this.post.thumbnail_url !== this.post.media_url) {
        urls.push(this.post.thumbnail_url);
      }
    } else {
      // For images, try thumbnail first
      if (this.post.thumbnail_url) {
        urls.push(this.post.thumbnail_url);
      }
      if (this.post.media_url && this.post.media_url !== this.post.thumbnail_url) {
        urls.push(this.post.media_url);
      }
    }
    
    console.log(`🎯 Generated ${urls.length} sync URLs for post ${this.post.id} (${actualMediaType}):`, urls);
    
    return urls;
  }

  getCurrentMediaType(): string {
    return this.detectActualMediaType();
  }
}
