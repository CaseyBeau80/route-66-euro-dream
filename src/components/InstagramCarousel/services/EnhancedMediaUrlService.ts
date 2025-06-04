
import { InstagramPost } from '../types';
import { EnhancedReelDetectionService } from './EnhancedReelDetectionService';
import { ImageProxyService } from './ImageProxyService';

export class EnhancedMediaUrlService {
  private post: InstagramPost;
  private analysis: any;

  constructor(post: InstagramPost) {
    this.post = post;
    this.analysis = EnhancedReelDetectionService.analyzePost(post);
  }

  async getOptimizedMediaUrls(): Promise<{
    urls: string[];
    mediaType: 'IMAGE' | 'VIDEO';
    confidence: number;
  }> {
    const urls: string[] = [];
    const isVideo = this.analysis.isVideo;

    console.log(`🔧 Generating optimized URLs for post ${this.post.id}:`, {
      detectedAsVideo: isVideo,
      confidence: this.analysis.confidence,
      method: this.analysis.detectionMethod
    });

    if (isVideo) {
      // For videos, prioritize media_url (actual video) then thumbnail
      await this.addVideoUrls(urls);
    } else {
      // For images, prioritize thumbnail then media_url
      await this.addImageUrls(urls);
    }

    // If no URLs found, try alternative approaches
    if (urls.length === 0) {
      console.warn(`⚠️ No URLs generated for post ${this.post.id}, trying fallback`);
      await this.addFallbackUrls(urls);
    }

    console.log(`🎯 Generated ${urls.length} optimized URLs for post ${this.post.id}:`, urls);

    return {
      urls,
      mediaType: isVideo ? 'VIDEO' : 'IMAGE',
      confidence: this.analysis.confidence
    };
  }

  private async addVideoUrls(urls: string[]): Promise<void> {
    // Try media_url first for videos (this is usually the video file)
    if (this.post.media_url) {
      try {
        const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
          this.post.media_url,
          this.post.id
        );
        urls.push(proxiedUrl);
        console.log(`✅ Added proxied video URL for post ${this.post.id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to proxy video URL, using direct: ${error}`);
        urls.push(this.post.media_url);
      }
    }

    // Add thumbnail as fallback for videos
    if (this.post.thumbnail_url && this.post.thumbnail_url !== this.post.media_url) {
      try {
        const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
          this.post.thumbnail_url,
          this.post.id + '-thumb'
        );
        urls.push(proxiedUrl);
        console.log(`✅ Added proxied thumbnail URL for video post ${this.post.id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to proxy thumbnail URL: ${error}`);
        urls.push(this.post.thumbnail_url);
      }
    }
  }

  private async addImageUrls(urls: string[]): Promise<void> {
    // For images, try thumbnail first (usually more reliable)
    if (this.post.thumbnail_url) {
      try {
        const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
          this.post.thumbnail_url,
          this.post.id
        );
        urls.push(proxiedUrl);
        console.log(`✅ Added proxied thumbnail URL for image post ${this.post.id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to proxy thumbnail URL: ${error}`);
        urls.push(this.post.thumbnail_url);
      }
    }

    // Then try media_url if different
    if (this.post.media_url && this.post.media_url !== this.post.thumbnail_url) {
      try {
        const proxiedUrl = await ImageProxyService.getProxiedImageUrl(
          this.post.media_url,
          this.post.id + '-media'
        );
        urls.push(proxiedUrl);
        console.log(`✅ Added proxied media URL for image post ${this.post.id}`);
      } catch (error) {
        console.warn(`⚠️ Failed to proxy media URL: ${error}`);
        urls.push(this.post.media_url);
      }
    }
  }

  private async addFallbackUrls(urls: string[]): Promise<void> {
    // Add any available URLs without proxying as last resort
    if (this.post.media_url) {
      urls.push(this.post.media_url);
      console.log(`🔄 Added fallback media URL for post ${this.post.id}`);
    }
    if (this.post.thumbnail_url && this.post.thumbnail_url !== this.post.media_url) {
      urls.push(this.post.thumbnail_url);
      console.log(`🔄 Added fallback thumbnail URL for post ${this.post.id}`);
    }
  }

  getMediaType(): 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' {
    return this.analysis.suggestedMediaType;
  }

  isVideo(): boolean {
    return this.analysis.isVideo;
  }

  getConfidence(): number {
    return this.analysis.confidence;
  }
}
