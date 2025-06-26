
import { supabase } from '@/integrations/supabase/client';

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
    return `milestones/${year}.jpg`;
  }

  /**
   * Migrate a timeline milestone to use Supabase storage URL
   */
  static migrateTimelineImageUrl(imageUrl?: string, year?: number): string | undefined {
    if (!imageUrl && !year) return undefined;
    
    // If already using Supabase storage, return as-is
    if (imageUrl && imageUrl.includes('supabase.co/storage')) {
      return imageUrl;
    }
    
    // If using old lovable-uploads path, convert to Supabase path
    if (imageUrl && imageUrl.includes('/lovable-uploads/')) {
      const filename = imageUrl.split('/').pop();
      if (filename && year) {
        return this.getImageUrl(`milestones/${year}-${filename}`);
      }
    }
    
    // Fallback to year-based path
    if (year) {
      return this.getImageUrl(this.getTimelineImagePath(year));
    }
    
    return imageUrl;
  }
}
