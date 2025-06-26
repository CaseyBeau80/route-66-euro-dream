
import { SupabaseImageService } from './SupabaseImageService';

export class EnhancedImageValidationService {
  private static readonly SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  // Updated fallback mapping using the new Supabase paths
  private static readonly FALLBACK_IMAGES = {
    1926: 'milestones/1926-route-66-is-born.jpg',
    1946: 'milestones/1946-get-your-kicks-on-route-66.jpg', 
    1950: 'milestones/1950-the-golden-age-begins.jpg',
    1956: 'milestones/1956-interstate-system-approved.jpg',
    1985: 'milestones/1985-official-decommissioning.jpg',
    1999: 'milestones/1999-historic-route-66-designation.jpg'
  };

  /**
   * Enhanced image URL validation with Supabase support
   */
  static isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      // Check if it's a valid URL
      new URL(url);
      
      const lowerUrl = url.toLowerCase();
      
      // Check for image extensions
      const hasImageExtension = this.SUPPORTED_FORMATS.some(format => 
        lowerUrl.includes(format)
      );
      
      // Check for known image hosts (including Supabase)
      const isKnownImageHost = [
        'supabase.co/storage',
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
   * Test if an image URL actually loads with timeout
   */
  static async testImageLoad(url: string, timeoutMs: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }, timeoutMs);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(false);
      };
      
      img.src = url;
    });
  }

  /**
   * Get fallback image URL for a given year
   */
  static getFallbackImageUrl(year: number): string | undefined {
    const fallbackPath = this.FALLBACK_IMAGES[year as keyof typeof this.FALLBACK_IMAGES];
    return fallbackPath ? SupabaseImageService.getImageUrl(fallbackPath) : undefined;
  }

  /**
   * Enhanced timeline image validation with Supabase integration
   */
  static async validateTimelineImages(milestones: Array<{ imageUrl?: string; title: string; year: number }>) {
    console.log('🔍 Starting enhanced timeline image validation with Supabase images...');
    
    const validationResults = await Promise.all(
      milestones.map(async (milestone) => {
        // For timeline images, always use the Supabase path based on year
        const supabaseUrl = SupabaseImageService.migrateTimelineImageUrl(milestone.imageUrl, milestone.year);
        
        if (!supabaseUrl) {
          console.log(`⚠️ No Supabase URL generated for ${milestone.title} (${milestone.year})`);
          return {
            title: milestone.title,
            year: milestone.year,
            originalUrl: milestone.imageUrl,
            finalUrl: undefined,
            isValid: false,
            source: 'none',
            hasUrl: false
          };
        }

        const isValidFormat = this.isValidImageUrl(supabaseUrl);
        
        if (!isValidFormat) {
          console.log(`❌ Invalid format for ${milestone.title} (${milestone.year}):`, supabaseUrl);
          return {
            title: milestone.title,
            year: milestone.year,
            originalUrl: milestone.imageUrl,
            finalUrl: supabaseUrl,
            isValid: false,
            source: 'invalid',
            hasUrl: true
          };
        }

        // Test actual loading for Supabase images
        const canLoad = await this.testImageLoad(supabaseUrl, 3000);
        
        console.log(`${canLoad ? '✅' : '⚠️'} Supabase image for ${milestone.title} (${milestone.year}):`, {
          url: supabaseUrl,
          canLoad
        });
        
        return {
          title: milestone.title,
          year: milestone.year,
          originalUrl: milestone.imageUrl,
          finalUrl: supabaseUrl,
          isValid: canLoad,
          source: canLoad ? 'supabase' : 'failed',
          hasUrl: true,
          canLoad
        };
      })
    );

    const summary = {
      total: validationResults.length,
      withUrls: validationResults.filter(r => r.hasUrl).length,
      valid: validationResults.filter(r => r.isValid).length,
      supabaseImages: validationResults.filter(r => r.source === 'supabase').length,
      failed: validationResults.filter(r => r.source === 'failed' || r.source === 'none').length
    };

    console.log('📊 Enhanced Timeline Image Validation Summary:', summary);
    return { validationResults, summary };
  }
}
