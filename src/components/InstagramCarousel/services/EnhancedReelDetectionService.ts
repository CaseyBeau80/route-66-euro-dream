
import { InstagramPost } from '../types';

export class EnhancedReelDetectionService {
  // More conservative video detection patterns - only match clear video indicators
  private static strongVideoPatterns = [
    // Direct video file patterns
    /\.mp4(\?|$)/i,
    /\.mov(\?|$)/i,
    /\.webm(\?|$)/i,
    /\.m4v(\?|$)/i,
    
    // Clear Instagram Reel URL patterns
    /\/reel\//i,
    /\/reels\//i,
    /\/tv\//i,
    
    // Video content indicators in URLs
    /\.cdninstagram\.com.*video/i,
    /scontent.*video/i,
    /instagram.*\.mp4/i,
    /fbcdn.*\.mp4/i,
    /video\..*\.instagram/i
  ];

  // Weak indicators that need additional evidence
  private static weakVideoPatterns = [
    /\/p\/[A-Za-z0-9_-]+\//i, // Instagram post pattern
    /\/stories\//i,
    /thumbnail/i,
    /poster/i,
    /preview/i,
    /frame/i
  ];

  static analyzePost(post: InstagramPost): {
    isVideo: boolean;
    confidence: number;
    detectionMethod: string;
    suggestedMediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  } {
    console.log(`🔍 Enhanced analysis for post ${post.id}:`, {
      stored_media_type: post.media_type,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url,
      permalink: post.permalink
    });

    let confidence = 0;
    let detectionMethods: string[] = [];
    let isVideo = false;

    // Trust the stored media type if it's already VIDEO
    if (post.media_type === 'VIDEO') {
      confidence = 100;
      detectionMethods.push('stored_media_type');
      isVideo = true;
      console.log(`✅ Trusting stored VIDEO type for post ${post.id}`);
    } else {
      // Only override if we have strong evidence
      const urlsToCheck = [
        post.media_url,
        post.thumbnail_url,
        post.permalink
      ].filter(Boolean);

      // Check for strong video patterns first
      let hasStrongEvidence = false;
      for (const url of urlsToCheck) {
        if (this.strongVideoPatterns.some(pattern => pattern.test(url))) {
          confidence = Math.max(confidence, 90);
          detectionMethods.push('strong_video_pattern');
          isVideo = true;
          hasStrongEvidence = true;
          console.log(`🎬 Strong video evidence in URL: ${url}`);
          break;
        }
      }

      // Only check weak patterns if we don't have strong evidence
      if (!hasStrongEvidence) {
        // Check for dual URLs (media_url + thumbnail_url) as potential video indicator
        if (post.media_url && post.thumbnail_url && post.media_url !== post.thumbnail_url) {
          // Additional check: make sure URLs don't end with image extensions
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i;
          const mediaIsImage = imageExtensions.test(post.media_url);
          const thumbIsImage = imageExtensions.test(post.thumbnail_url);
          
          if (!mediaIsImage || !thumbIsImage) {
            confidence = Math.max(confidence, 70);
            detectionMethods.push('dual_urls_mixed_types');
            isVideo = true;
            console.log(`🎥 Mixed media types detected - potential video`);
          } else {
            console.log(`📸 Both URLs are images - keeping as IMAGE`);
          }
        }

        // Check permalink for reel indicators
        if (post.permalink && (post.permalink.includes('/reel/') || post.permalink.includes('/tv/'))) {
          confidence = Math.max(confidence, 85);
          detectionMethods.push('permalink_reel_direct');
          isVideo = true;
          console.log(`🎬 Direct reel URL in permalink: ${post.permalink}`);
        }
      }
    }

    // Be conservative - only suggest VIDEO if confidence is high enough
    const shouldOverride = isVideo && confidence >= 80;
    const suggestedMediaType = shouldOverride ? 'VIDEO' : post.media_type;
    const detectionMethod = detectionMethods.join(', ') || 'none';

    console.log(`📊 Analysis result for post ${post.id}:`, {
      isVideo: shouldOverride,
      confidence,
      detectionMethod,
      suggestedMediaType,
      willOverride: shouldOverride && post.media_type !== 'VIDEO'
    });

    return {
      isVideo: shouldOverride,
      confidence,
      detectionMethod,
      suggestedMediaType
    };
  }

  static isLikelyVideo(post: InstagramPost): boolean {
    const analysis = this.analyzePost(post);
    return analysis.isVideo && analysis.confidence >= 80;
  }

  static getCorrectMediaType(post: InstagramPost): 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' {
    const analysis = this.analyzePost(post);
    return analysis.suggestedMediaType;
  }
}
