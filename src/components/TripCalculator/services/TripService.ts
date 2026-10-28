
import { supabase } from '@/lib/supabase';
import { TripPlan } from './Route66TripPlannerService';

export interface SavedTrip {
  id: string;
  title: string;
  description?: string;
  trip_data: TripPlan;
  share_code: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export class TripService {
  static async saveTrip(tripPlan: TripPlan, title?: string, description?: string): Promise<string> {
    console.log('💾 Saving trip to database:', { tripPlan, title, description });
    
    // Generate a unique share code
    const shareCode = this.generateShareCode();
    
    try {
      const { error } = await (supabase as any)
        .from('trips')
        .insert({
          title: title || tripPlan.title,
          description: description,
          trip_data: tripPlan as any, // Cast to any to satisfy Json type requirement
          share_code: shareCode,
          view_count: 0
        });

      if (error) {
        console.error('❌ Error saving trip:', error);
        throw new Error(`Failed to save trip: ${error.message}`);
      }

      console.log('✅ Trip saved successfully');
      return shareCode;
    } catch (error) {
      console.error('❌ Unexpected error saving trip:', error);
      throw new Error('Failed to save trip to database');
    }
  }

  static async loadTripByShareCode(shareCode: string): Promise<SavedTrip> {
    console.log('📥 Loading trip by share code:', shareCode);

    if (!shareCode || shareCode.length !== 8) {
      throw new Error('Invalid share code format');
    }

    try {
      const { data: rows, error } = await supabase.rpc('get_shared_trip', { p_share_code: shareCode });
      const data = rows?.[0];

      if (error) {
        console.error('❌ Error loading trip:', error);
        throw new Error(`Failed to load trip: ${error.message}`);
      }

      if (!data) {
        throw new Error('Trip not found');
      }

      console.log('✅ Trip loaded successfully:', data);
      
      // Safe type assertion with validation
      if (!data.trip_data || typeof data.trip_data !== 'object') {
        throw new Error('Invalid trip data format');
      }
      
      return {
        ...data,
        trip_data: data.trip_data as unknown as TripPlan
      } as SavedTrip;
    } catch (error) {
      console.error('❌ Unexpected error loading trip:', error);
      throw error instanceof Error ? error : new Error('Failed to load trip');
    }
  }

  static async incrementViewCount(shareCode: string): Promise<void> {
    console.log('👁️ Incrementing view count for:', shareCode);

    if (!shareCode) {
      console.warn('⚠️ No share code provided for view count increment');
      return;
    }

    try {
      const { error } = await supabase.rpc('increment_trip_view', { p_share_code: shareCode });

      if (error) {
        console.error('❌ Error incrementing view count:', error);
        // Don't throw error for view count increment failures
      } else {
        console.log('✅ View count incremented');
      }
    } catch (error) {
      console.error('❌ Unexpected error incrementing view count:', error);
      // Don't throw error for view count failures
    }
  }

  private static generateShareCode(): string {
    // Generate a random 8-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static getShareUrl(shareCode: string): string {
    if (!shareCode) {
      throw new Error('Share code is required to generate URL');
    }
    return `${window.location.origin}/trip/${shareCode}`;
  }
}
