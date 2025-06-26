
export class ImageValidationService {
  private static readonly SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
  private static readonly MAX_RETRY_ATTEMPTS = 2;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Validates if a URL points to a supported image format
   */
  static isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname.toLowerCase();
      
      return this.SUPPORTED_FORMATS.some(format => 
        pathname.includes(format)
      );
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
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  }

  /**
   * Attempts to load an image with retry logic
   */
  static async loadImageWithRetry(
    url: string, 
    onSuccess: () => void, 
    onError: (error: string) => void,
    onRetry?: (attempt: number) => void
  ): Promise<void> {
    let attempts = 0;

    const attemptLoad = async (): Promise<void> => {
      attempts++;
      
      try {
        const success = await this.testImageLoad(url);
        
        if (success) {
          onSuccess();
          return;
        }
        
        if (attempts < this.MAX_RETRY_ATTEMPTS) {
          onRetry?.(attempts);
          console.log(`🔄 Retrying image load (attempt ${attempts + 1}/${this.MAX_RETRY_ATTEMPTS}): ${url}`);
          setTimeout(attemptLoad, this.RETRY_DELAY);
        } else {
          onError(`Failed to load after ${this.MAX_RETRY_ATTEMPTS} attempts`);
        }
      } catch (error) {
        if (attempts < this.MAX_RETRY_ATTEMPTS) {
          onRetry?.(attempts);
          setTimeout(attemptLoad, this.RETRY_DELAY);
        } else {
          onError(`Network error: ${error}`);
        }
      }
    };

    attemptLoad();
  }

  /**
   * Validates timeline image URLs and provides feedback
   */
  static validateTimelineImages(milestones: Array<{ imageUrl?: string; title: string; year: number }>) {
    const validationResults = milestones.map(milestone => {
      const isValid = milestone.imageUrl ? this.isValidImageUrl(milestone.imageUrl) : false;
      
      if (milestone.imageUrl && !isValid) {
        console.warn(`⚠️ Invalid image URL for ${milestone.title} (${milestone.year}):`, milestone.imageUrl);
      }
      
      return {
        title: milestone.title,
        year: milestone.year,
        url: milestone.imageUrl,
        isValid,
        hasUrl: !!milestone.imageUrl
      };
    });

    console.log('📊 Timeline Image Validation Results:', validationResults);
    return validationResults;
  }
}
