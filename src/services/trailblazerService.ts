
import { supabase } from '@/integrations/supabase/client';

export interface TrailblazerAchievement {
  id: string;
  stop_id: string;
  user_session_id: string | null;
  achieved_at: string;
  photo_challenge_id: string;
}

export interface TrailblazerLeaderboard {
  user_session_id: string;
  trailblazer_count: number;
  latest_achievement: string;
  locations: string[];
}

export interface LocationTrailblazer {
  has_trailblazer: boolean;
  user_session_id: string;
  achieved_at: string;
  photo_url: string;
}

export class TrailblazerService {
  /**
   * Check if a location has a trailblazer
   */
  static async getLocationTrailblazer(stopId: string): Promise<LocationTrailblazer | null> {
    console.log('🏆 Checking trailblazer status for stop:', stopId);
    
    try {
      const { data, error } = await supabase
        .rpc('get_location_trailblazer', { location_stop_id: stopId });

      if (error) {
        console.error('❌ Error fetching location trailblazer:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('📍 No trailblazer found for location:', stopId);
        return null;
      }

      const trailblazer = data[0];
      console.log('🎯 Found trailblazer:', trailblazer);
      return trailblazer;
    } catch (error) {
      console.error('❌ Failed to fetch location trailblazer:', error);
      return null;
    }
  }

  /**
   * Get the trailblazer leaderboard
   */
  static async getTrailblazerLeaderboard(limit: number = 10): Promise<TrailblazerLeaderboard[]> {
    console.log('🏆 Fetching trailblazer leaderboard');
    
    try {
      const { data, error } = await supabase.rpc('get_trailblazer_leaderboard');

      if (error) {
        console.error('❌ Error fetching trailblazer leaderboard:', error);
        return [];
      }

      if (!data) {
        console.log('📊 No trailblazer data found');
        return [];
      }

      // Limit results and format data
      const leaderboard = data.slice(0, limit).map((entry: any) => ({
        user_session_id: entry.user_session_id,
        trailblazer_count: Number(entry.trailblazer_count),
        latest_achievement: entry.latest_achievement,
        locations: entry.locations || []
      }));

      console.log(`✅ Retrieved ${leaderboard.length} trailblazer entries`);
      return leaderboard;
    } catch (error) {
      console.error('❌ Failed to fetch trailblazer leaderboard:', error);
      return [];
    }
  }

  /**
   * Get user's trailblazer achievements
   */
  static async getUserTrailblazerAchievements(userSessionId: string): Promise<TrailblazerAchievement[]> {
    console.log('🏆 Fetching user trailblazer achievements for:', userSessionId);
    
    try {
      const { data, error } = await supabase
        .from('trailblazer_achievements')
        .select('*')
        .eq('user_session_id', userSessionId)
        .order('achieved_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user achievements:', error);
        return [];
      }

      console.log(`✅ Retrieved ${data?.length || 0} achievements for user`);
      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch user achievements:', error);
      return [];
    }
  }

  /**
   * Check if user has any trailblazer achievements
   */
  static async hasTrailblazerAchievements(userSessionId: string): Promise<boolean> {
    const achievements = await this.getUserTrailblazerAchievements(userSessionId);
    return achievements.length > 0;
  }

  /**
   * Generate a user-friendly session ID display
   */
  static formatSessionId(sessionId: string): string {
    if (!sessionId) return 'Anonymous';
    
    // Extract meaningful part from session ID
    if (sessionId.includes('challenge-session-')) {
      const timestamp = sessionId.replace('challenge-session-', '');
      const date = new Date(Number(timestamp));
      if (!isNaN(date.getTime())) {
        return `Traveler ${date.toLocaleDateString()}`;
      }
    }
    
    // Use first 8 characters for display
    return `Traveler ${sessionId.substring(0, 8)}`;
  }

  /**
   * Get trailblazer rank for a user
   */
  static async getUserTrailblazerRank(userSessionId: string): Promise<number | null> {
    const leaderboard = await this.getTrailblazerLeaderboard(100);
    const userIndex = leaderboard.findIndex(entry => entry.user_session_id === userSessionId);
    return userIndex >= 0 ? userIndex + 1 : null;
  }
}
