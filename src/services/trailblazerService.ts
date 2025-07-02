
import { supabase } from '@/integrations/supabase/client';

export interface LocationTrailblazer {
  has_trailblazer: boolean;
  user_session_id: string | null;
  achieved_at: string | null;
  photo_url: string | null;
}

export interface TrailblazerLeaderboard {
  user_session_id: string;
  trailblazer_count: number;
  latest_achievement: string;
  locations: string[];
}

export class TrailblazerService {
  
  static async getLocationTrailblazer(stopId: string): Promise<LocationTrailblazer | null> {
    try {
      console.log('🔍 Checking trailblazer status for stop:', stopId);
      
      const { data, error } = await supabase
        .rpc('get_location_trailblazer', { location_stop_id: stopId });

      if (error) {
        console.error('❌ Error fetching location trailblazer:', error);
        throw error;
      }

      console.log('✅ Location trailblazer data:', data);
      return data?.[0] || null;
    } catch (error) {
      console.error('💥 TrailblazerService.getLocationTrailblazer error:', error);
      throw error;
    }
  }

  static async getTrailblazerLeaderboard(): Promise<TrailblazerLeaderboard[]> {
    try {
      console.log('🏆 Fetching trailblazer leaderboard...');
      
      const { data, error } = await supabase
        .rpc('get_trailblazer_leaderboard');

      if (error) {
        console.error('❌ Error fetching trailblazer leaderboard:', error);
        throw error;
      }

      console.log('✅ Trailblazer leaderboard data:', data);
      return data || [];
    } catch (error) {
      console.error('💥 TrailblazerService.getTrailblazerLeaderboard error:', error);
      throw error;
    }
  }

  static async getUserTrailblazerStats(userSessionId: string): Promise<TrailblazerLeaderboard | null> {
    try {
      console.log('📊 Fetching user trailblazer stats for:', userSessionId);
      
      const { data, error } = await supabase
        .from('trailblazer_achievements')
        .select(`
          stop_id,
          achieved_at,
          photo_challenges!inner(photo_url)
        `)
        .eq('user_session_id', userSessionId)
        .order('achieved_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user trailblazer stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const stats: TrailblazerLeaderboard = {
        user_session_id: userSessionId,
        trailblazer_count: data.length,
        latest_achievement: data[0].achieved_at,
        locations: data.map(achievement => achievement.stop_id)
      };

      console.log('✅ User trailblazer stats:', stats);
      return stats;
    } catch (error) {
      console.error('💥 TrailblazerService.getUserTrailblazerStats error:', error);
      throw error;
    }
  }
}
