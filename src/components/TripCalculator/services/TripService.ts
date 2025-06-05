
import { supabase } from '@/integrations/supabase/client';
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
    
    const { data, error } = await supabase
      .from('trips')
      .insert({
        title: title || tripPlan.title,
        description: description,
        trip_data: tripPlan as any, // Cast to any to satisfy Json type requirement
        share_code: shareCode,
        view_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving trip:', error);
      throw new Error(`Failed to save trip: ${error.message}`);
    }

    console.log('✅ Trip saved successfully:', data);
    return shareCode;
  }

  static async loadTripByShareCode(shareCode: string): Promise<SavedTrip> {
    console.log('📥 Loading trip by share code:', shareCode);

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (error) {
      console.error('❌ Error loading trip:', error);
      throw new Error(`Failed to load trip: ${error.message}`);
    }

    if (!data) {
      throw new Error('Trip not found');
    }

    console.log('✅ Trip loaded successfully:', data);
    
    // Type assertion to convert from database format to our interface
    return {
      ...data,
      trip_data: data.trip_data as TripPlan
    } as SavedTrip;
  }

  static async incrementViewCount(shareCode: string): Promise<void> {
    console.log('👁️ Incrementing view count for:', shareCode);

    const { error } = await supabase
      .from('trips')
      .update({ 
        view_count: supabase.rpc('increment_view_count', { current_count: 1 }) 
      })
      .eq('share_code', shareCode);

    if (error) {
      console.error('❌ Error incrementing view count:', error);
      // Don't throw error for view count increment failures
    } else {
      console.log('✅ View count incremented');
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
    return `${window.location.origin}/trip/${shareCode}`;
  }
}
