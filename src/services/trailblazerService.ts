
import { supabase } from '@/integrations/supabase/client';

export interface TrailblazerLeader {
  user_session_id: string;
  trailblazer_count: number;
  latest_achievement: string;
  locations: string[];
}

export interface LocationTrailblazer {
  has_trailblazer: boolean;
  user_session_id?: string;
  achieved_at?: string;
  photo_url?: string;
}

export class TrailblazerService {
  static async getLeaderboard(limit: number = 10): Promise<TrailblazerLeader[]> {
    try {
      const { data, error } = await supabase.rpc('get_trailblazer_leaderboard');
      
      if (error) {
        console.error('Error fetching trailblazer leaderboard:', error);
        return [];
      }

      return (data || []).slice(0, limit);
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      return [];
    }
  }

  static async getLocationTrailblazer(stopId: string): Promise<LocationTrailblazer | null> {
    try {
      const { data, error } = await supabase.rpc('get_location_trailblazer', {
        location_stop_id: stopId
      });
      
      if (error) {
        console.error('Error fetching location trailblazer:', error);
        return null;
      }

      return data?.[0] || { has_trailblazer: false };
    } catch (error) {
      console.error('Error in getLocationTrailblazer:', error);
      return null;
    }
  }

  static async getTrailblazerStats(): Promise<{
    totalTrailblazers: number;
    totalLocations: number;
    recentAchievements: number;
  }> {
    try {
      const { data: achievements, error } = await supabase
        .from('trailblazer_achievements')
        .select('*');

      if (error) {
        console.error('Error fetching trailblazer stats:', error);
        return { totalTrailblazers: 0, totalLocations: 0, recentAchievements: 0 };
      }

      const uniqueTrailblazers = new Set(achievements.map(a => a.user_session_id)).size;
      const uniqueLocations = new Set(achievements.map(a => a.stop_id)).size;
      
      // Recent achievements (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const recentAchievements = achievements.filter(
        a => new Date(a.achieved_at) > oneDayAgo
      ).length;

      return {
        totalTrailblazers: uniqueTrailblazers,
        totalLocations: uniqueLocations,
        recentAchievements
      };
    } catch (error) {
      console.error('Error in getTrailblazerStats:', error);
      return { totalTrailblazers: 0, totalLocations: 0, recentAchievements: 0 };
    }
  }
}
