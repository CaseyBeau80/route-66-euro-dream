
import { supabase } from '@/lib/supabase';

export class SupabaseImageService {
  private static readonly BUCKET_NAME = 'timeline_images';
  private static readonly SUPABASE_URL = 'https://xbwaphzntaxmdfzfsmvt.supabase.co';

  /**
   * Get the full public URL for a Supabase storage image
   */
  static getImageUrl(path: string): string {
    if (!path) return '';
    
    // If it's already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${this.SUPABASE_URL}/storage/v1/object/public/${this.BUCKET_NAME}/${cleanPath}`;
  }

  /**
   * Check if an image exists in Supabase storage
   */
  static async imageExists(path: string): Promise<boolean> {
    try {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { search: cleanPath });
      
      if (error) {
        console.warn(`Error checking image existence: ${error.message}`);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.warn(`Error checking image existence:`, error);
      return false;
    }
  }

  /**
   * Upload an image to Supabase storage (for future admin use)
   */
  static async uploadImage(file: File, path: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        url: this.getImageUrl(data.path)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get timeline image path from milestone data
   */
  static getTimelineImagePath(year: number): string {
    // Map years to the actual uploaded filenames
    const imageMapping: Record<number, string> = {
      1926: 'milestones/1926-route-66-is-born.jpg',
      1946: 'milestones/1946-get-your-kicks-on-route-66.jpg',
      1950: 'milestones/1950-the-golden-age-begins.jpg',
      1956: 'milestones/1956-interstate-system-approved.jpg',
      1985: 'milestones/1985-official-decommissioning.jpg',
      1999: 'milestones/1999-historic-route-66-designation.jpg'
    };
    
    return imageMapping[year] || `milestones/${year}.jpg`;
  }

  /**
   * Migrate a timeline milestone to use Supabase storage URL
   */
  static migrateTimelineImageUrl(imageUrl?: string, year?: number): string | undefined {
    // If we have a year, always use the Supabase path
    if (year) {
      return this.getImageUrl(this.getTimelineImagePath(year));
    }
    
    // If no year provided but we have an imageUrl, check if it needs migration
    if (imageUrl) {
      // If already using Supabase storage, return as-is
      if (imageUrl.includes('supabase.co/storage')) {
        return imageUrl;
      }
      
      // If it's a relative path that looks like our new format, convert it
      if (imageUrl.startsWith('milestones/')) {
        return this.getImageUrl(imageUrl);
      }
      
      // For old lovable-uploads paths, try to map to our new system
      if (imageUrl.includes('/lovable-uploads/')) {
        // This is an old path, we'll rely on fallback logic
        return undefined;
      }
    }
    
    return imageUrl;
  }
}
