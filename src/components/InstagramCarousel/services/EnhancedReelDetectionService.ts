
import { InstagramPost } from '../types';

export class EnhancedReelDetectionService {
  // Comprehensive Reel and video detection patterns
  private static videoPatterns = [
    // Direct video file patterns
    /\.mp4(\?|$)/i,
    /\.mov(\?|$)/i,
    /\.webm(\?|$)/i,
    /\.m4v(\?|$)/i,
    
    // Instagram Reel URL patterns - enhanced
    /\/reel\//i,
    /\/reels\//i,
    /\/tv\//i,
    /\/stories\//i,
    /\/p\/[A-Za-z0-9_-]+\//i, // Instagram post pattern that could be a reel
    
    // Video content indicators in URLs
    /video/i,
    /\.cdninstagram\.com.*video/i,
    /scontent.*video/i,
    
    // Instagram video CDN patterns
    /instagram.*\.mp4/i,
    /fbcdn.*\.mp4/i,
    /video\..*\.instagram/i
  ];

  // Patterns that suggest video content even without explicit video extensions
  private static videoIndicators = [
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

    // Check if already correctly marked as video
    if (post.media_type === 'VIDEO') {
      confidence = 100;
      detectionMethods.push('stored_media_type');
      isVideo = true;
    }

    // Enhanced Instagram Reel detection based on permalink structure
    if (post.permalink) {
      // Check for Instagram post URL that could be a reel
      const postUrlMatch = post.permalink.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/);
      if (postUrlMatch) {
        confidence = Math.max(confidence, 80);
        detectionMethods.push('instagram_post_url_pattern');
        isVideo = true;
        console.log(`🎬 Instagram post URL detected, likely a Reel: ${post.permalink}`);
      }
      
      // Direct reel URLs
      if (post.permalink.includes('/reel/') || post.permalink.includes('/tv/')) {
        confidence = Math.max(confidence, 95);
        detectionMethods.push('permalink_reel');
        isVideo = true;
        console.log(`🎬 Direct Reel detected from permalink: ${post.permalink}`);
      }
    }

    // Analyze URLs for video patterns
    const urlsToCheck = [
      post.media_url,
      post.thumbnail_url,
      post.permalink
    ].filter(Boolean);

    for (const url of urlsToCheck) {
      // Check for direct video patterns
      if (this.videoPatterns.some(pattern => pattern.test(url))) {
        confidence = Math.max(confidence, 90);
        detectionMethods.push('video_pattern_url');
        isVideo = true;
        console.log(`✅ Video pattern detected in URL: ${url}`);
      }

      // Check for video indicators
      if (this.videoIndicators.some(pattern => pattern.test(url))) {
        confidence = Math.max(confidence, 70);
        detectionMethods.push('video_indicator');
        isVideo = true;
        console.log(`🎯 Video indicator detected in URL: ${url}`);
      }
    }

    // Check if we have both media_url and thumbnail_url (common for videos)
    if (post.media_url && post.thumbnail_url && post.media_url !== post.thumbnail_url) {
      confidence = Math.max(confidence, 60);
      detectionMethods.push('dual_urls');
      isVideo = true;
      console.log(`📹 Dual URLs detected - likely video content`);
    }

    // Special case: if media_type is IMAGE but we have thumbnail_url, it's likely a video
    if (post.media_type === 'IMAGE' && post.thumbnail_url && post.media_url !== post.thumbnail_url) {
      confidence = Math.max(confidence, 85);
      detectionMethods.push('image_with_thumbnail');
      isVideo = true;
      console.log(`🎥 IMAGE type with separate thumbnail - likely misclassified video`);
    }

    // Caption analysis for video keywords
    if (post.caption) {
      const videoKeywords = ['reel', 'video', 'watch', 'sound', 'music', 'audio'];
      const hasVideoKeywords = videoKeywords.some(keyword => 
        post.caption!.toLowerCase().includes(keyword)
      );
      if (hasVideoKeywords) {
        confidence = Math.max(confidence, 40);
        detectionMethods.push('caption_keywords');
        console.log(`🗣️ Video keywords detected in caption`);
      }
    }

    const suggestedMediaType = isVideo ? 'VIDEO' : post.media_type;
    const detectionMethod = detectionMethods.join(', ') || 'none';

    console.log(`📊 Analysis result for post ${post.id}:`, {
      isVideo,
      confidence,
      detectionMethod,
      suggestedMediaType
    });

    return {
      isVideo,
      confidence,
      detectionMethod,
      suggestedMediaType
    };
  }

  static isLikelyVideo(post: InstagramPost): boolean {
    const analysis = this.analyzePost(post);
    return analysis.isVideo && analysis.confidence >= 50;
  }

  static getCorrectMediaType(post: InstagramPost): 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' {
    const analysis = this.analyzePost(post);
    return analysis.suggestedMediaType;
  }
}
