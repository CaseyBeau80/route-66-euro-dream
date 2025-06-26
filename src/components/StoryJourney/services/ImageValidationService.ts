
export class ImageValidationService {
  private static readonly SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  /**
   * Validates if a URL points to a supported image format
   */
  static isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      // Check if it's a valid URL
      new URL(url);
      
      // More lenient check - if it contains an image extension or is from a known image host
      const lowerUrl = url.toLowerCase();
      const hasImageExtension = this.SUPPORTED_FORMATS.some(format => 
        lowerUrl.includes(format)
      );
      
      const isKnownImageHost = [
        'lovable-uploads',
        'images.unsplash.com',
        'unsplash.com',
        'cdn.',
        'imgur.com',
        'cloudinary.com'
      ].some(host => lowerUrl.includes(host));

      return hasImageExtension || isKnownImageHost;
    } catch {
      return false;
    }
  }

  /**
   * Tests if an image URL actually loads
   */
  static async testImageLoad(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 10 seconds
      setTimeout(() => resolve(false), 10000);
    });
  }

  /**
   * Validates timeline image URLs and provides feedback
   */
  static validateTimelineImages(milestones: Array<{ imageUrl?: string; title: string; year: number }>) {
    console.log('🔍 Starting timeline image validation...');
    
    const validationResults = milestones.map(milestone => {
      if (!milestone.imageUrl) {
        console.log(`⚠️ No image URL for ${milestone.title} (${milestone.year})`);
        return {
          title: milestone.title,
          year: milestone.year,
          url: milestone.imageUrl,
          isValid: false,
          hasUrl: false
        };
      }

      const isValid = this.isValidImageUrl(milestone.imageUrl);
      
      console.log(`${isValid ? '✅' : '❌'} Image URL for ${milestone.title} (${milestone.year}):`, {
        url: milestone.imageUrl,
        isValid
      });
      
      return {
        title: milestone.title,
        year: milestone.year,
        url: milestone.imageUrl,
        isValid,
        hasUrl: true
      };
    });

    const summary = {
      total: validationResults.length,
      withUrls: validationResults.filter(r => r.hasUrl).length,
      valid: validationResults.filter(r => r.isValid).length,
      invalid: validationResults.filter(r => r.hasUrl && !r.isValid).length
    };

    console.log('📊 Timeline Image Validation Summary:', summary);
    return validationResults;
  }
}
