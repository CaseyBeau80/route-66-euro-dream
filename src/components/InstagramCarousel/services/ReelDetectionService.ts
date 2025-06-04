
import { InstagramPost } from '../types';

export class ReelDetectionService {
  // Enhanced Reel detection patterns
  private static reelPatterns = [
    /\/reel\//i,
    /\/reels\//i,
    /\/p\/.*\/.*video/i,
    /\.mp4/i,
    /video/i,
    /reels/i
  ];

  // Video file extensions that indicate video content
  private static videoExtensions = [
    '.mp4', '.mov', '.avi', '.webm', '.m4v'
  ];

  static isLikelyReel(post: InstagramPost): boolean {
    const mediaUrl = post.media_url || '';
    const thumbnailUrl = post.thumbnail_url || '';
    const permalink = post.permalink || '';
    
    console.log(`🔍 Checking if post ${post.id} is a Reel:`, {
      mediaUrl,
      thumbnailUrl,
      permalink,
      storedType: post.media_type
    });

    // Check URL patterns
    const urlsToCheck = [mediaUrl, thumbnailUrl, permalink];
    
    for (const url of urlsToCheck) {
      // Check Reel patterns
      if (this.reelPatterns.some(pattern => pattern.test(url))) {
        console.log(`✅ Reel pattern found in URL: ${url}`);
        return true;
      }
      
      // Check video file extensions
      if (this.videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
        console.log(`✅ Video extension found in URL: ${url}`);
        return true;
      }
    }

    // Check if we have a thumbnail but the media_type is incorrectly set to IMAGE
    // This often happens with Reels
    if (post.thumbnail_url && post.media_type === 'IMAGE') {
      // If there's a separate thumbnail URL, it's likely a video
      if (post.media_url !== post.thumbnail_url) {
        console.log(`✅ Potential Reel detected: post ${post.id} has separate thumbnail and media URLs`);
        return true;
      }
    }

    // Check Instagram post URL structure
    if (permalink.includes('/reel/') || permalink.includes('/reels/')) {
      console.log(`✅ Reel detected from permalink structure: ${permalink}`);
      return true;
    }

    console.log(`❌ No Reel indicators found for post ${post.id}`);
    return false;
  }

  static getCorrectMediaType(post: InstagramPost): 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' {
    if (this.isLikelyReel(post)) {
      console.log(`🎬 Correcting media type for post ${post.id}: IMAGE -> VIDEO (Reel detected)`);
      return 'VIDEO';
    }
    
    return post.media_type;
  }

  static shouldShowAsVideo(post: InstagramPost): boolean {
    return this.getCorrectMediaType(post) === 'VIDEO';
  }
}
