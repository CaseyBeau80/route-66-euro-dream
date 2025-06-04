
import { InstagramPost } from '../types';

export class MediaUrlGenerator {
  private post: InstagramPost;

  constructor(post: InstagramPost) {
    this.post = post;
  }

  // Simplified URL generation - just get the basic media URL
  getMediaUrls(): string[] {
    const urls = [];
    
    console.log(`🔍 Analyzing post ${this.post.id}:`, {
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
    
    console.log(`🎯 Generated ${urls.length} URLs for post ${this.post.id}:`, urls);
    
    return urls;
  }

  getCurrentMediaType(): string {
    return this.post.media_type;
  }
}
