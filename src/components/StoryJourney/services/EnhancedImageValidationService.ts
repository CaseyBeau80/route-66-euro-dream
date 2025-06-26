
import { SupabaseImageService } from './SupabaseImageService';

export class EnhancedImageValidationService {
  private static readonly SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  private static readonly FALLBACK_IMAGES = {
    1926: 'milestones/1926-establishment.jpg',
    1946: 'milestones/1946-cultural.jpg', 
    1950: 'milestones/1950-golden-age.jpg',
    1956: 'milestones/1956-interstate.jpg',
    1985: 'milestones/1985-decommission.jpg',
    1999: 'milestones/1999-historic.jpg'
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
    console.log('🔍 Starting enhanced timeline image validation...');
    
    const validationResults = await Promise.all(
      milestones.map(async (milestone) => {
        const migratedUrl = SupabaseImageService.migrateTimelineImageUrl(milestone.imageUrl, milestone.year);
        const fallbackUrl = this.getFallbackImageUrl(milestone.year);
        
        if (!migratedUrl) {
          console.log(`⚠️ No image URL for ${milestone.title} (${milestone.year})`);
          return {
            title: milestone.title,
            year: milestone.year,
            originalUrl: milestone.imageUrl,
            finalUrl: fallbackUrl,
            isValid: !!fallbackUrl,
            source: fallbackUrl ? 'fallback' : 'none',
            hasUrl: !!fallbackUrl
          };
        }

        const isValidFormat = this.isValidImageUrl(migratedUrl);
        
        if (!isValidFormat) {
          console.log(`❌ Invalid format for ${milestone.title} (${milestone.year}):`, migratedUrl);
          return {
            title: milestone.title,
            year: milestone.year,
            originalUrl: milestone.imageUrl,
            finalUrl: fallbackUrl,
            isValid: !!fallbackUrl,
            source: fallbackUrl ? 'fallback' : 'invalid',
            hasUrl: !!fallbackUrl
          };
        }

        // Test actual loading for Supabase images
        let canLoad = true;
        if (migratedUrl.includes('supabase.co/storage')) {
          canLoad = await this.testImageLoad(migratedUrl, 3000);
        }

        const finalUrl = canLoad ? migratedUrl : fallbackUrl;
        
        console.log(`${canLoad ? '✅' : '⚠️'} Image for ${milestone.title} (${milestone.year}):`, {
          url: finalUrl,
          source: canLoad ? 'supabase' : 'fallback',
          canLoad
        });
        
        return {
          title: milestone.title,
          year: milestone.year,
          originalUrl: milestone.imageUrl,
          finalUrl,
          isValid: !!finalUrl,
          source: canLoad ? 'supabase' : (fallbackUrl ? 'fallback' : 'none'),
          hasUrl: !!finalUrl,
          canLoad
        };
      })
    );

    const summary = {
      total: validationResults.length,
      withUrls: validationResults.filter(r => r.hasUrl).length,
      valid: validationResults.filter(r => r.isValid).length,
      supabaseImages: validationResults.filter(r => r.source === 'supabase').length,
      fallbackImages: validationResults.filter(r => r.source === 'fallback').length,
      failed: validationResults.filter(r => r.source === 'none').length
    };

    console.log('📊 Enhanced Timeline Image Validation Summary:', summary);
    return { validationResults, summary };
  }
}
