import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Camera, Trophy, MapPin } from 'lucide-react';
import { TrailblazerService } from '@/services/trailblazerService';
// No props needed - English only
interface StatsData {
  totalPhotos: number;
  totalTrailblazers: number;
  uniqueLocations: number;
  todayUploads: number;
}
const content = {
  en: {
    title: "Community Impact",
    totalPhotos: "Photos Shared",
    totalTrailblazers: "Trailblazers",
    uniqueLocations: "Locations Captured",
    todayUploads: "Uploaded Today"
  },
  de: {
    title: "Gemeinschaftseinfluss",
    totalPhotos: "Geteilte Fotos",
    totalTrailblazers: "Wegbereiter",
    uniqueLocations: "Erfasste Orte",
    todayUploads: "Heute hochgeladen"
  },
  fr: {
    title: "Impact communautaire",
    totalPhotos: "Photos partagées",
    totalTrailblazers: "Pionniers",
    uniqueLocations: "Lieux capturés",
    todayUploads: "Téléchargées aujourd'hui"
  },
  'pt-BR': {
    title: "Impacto da comunidade",
    totalPhotos: "Fotos compartilhadas",
    totalTrailblazers: "Desbravadores",
    uniqueLocations: "Locais capturados",
    todayUploads: "Enviadas hoje"
  }
};
const CommunityStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalPhotos: 0,
    totalTrailblazers: 0,
    uniqueLocations: 0,
    todayUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const statsContent = content.en; // Always use English
  useEffect(() => {
    fetchCommunityStats();
  }, []);
  const fetchCommunityStats = async () => {
    try {
      // Get total photos count
      const {
        count: totalPhotos
      } = await supabase.from('photo_challenges').select('*', {
        count: 'exact',
        head: true
      }).not('moderation_result', 'is', null);

      // Get trailblazers count
      const trailblazerLeaderboard = await TrailblazerService.getTrailblazerLeaderboard(1000);
      const totalTrailblazers = trailblazerLeaderboard.length;

      // Get unique locations count
      const {
        data: uniqueLocationsData
      } = await supabase.from('photo_challenges').select('stop_id').not('moderation_result', 'is', null);
      const uniqueLocations = new Set(uniqueLocationsData?.map(item => item.stop_id) || []).size;

      // Get today's uploads
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const {
        count: todayUploads
      } = await supabase.from('photo_challenges').select('*', {
        count: 'exact',
        head: true
      }).gte('created_at', today.toISOString()).not('moderation_result', 'is', null);
      setStats({
        totalPhotos: totalPhotos || 0,
        totalTrailblazers,
        uniqueLocations,
        todayUploads: todayUploads || 0
      });
    } catch (error) {
      console.error('Error fetching community stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  const statItems = [{
    icon: Camera,
    value: stats.totalPhotos,
    label: statsContent.totalPhotos,
    color: 'text-route66-primary'
  }, {
    icon: Trophy,
    value: stats.totalTrailblazers,
    label: statsContent.totalTrailblazers,
    color: 'text-route66-accent'
  }, {
    icon: MapPin,
    value: stats.uniqueLocations,
    label: statsContent.uniqueLocations,
    color: 'text-blue-600'
  }, {
    icon: Users,
    value: stats.todayUploads,
    label: statsContent.todayUploads,
    color: 'text-green-600'
  }];
  if (loading) {
    return <Card className="border-route66-border">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="text-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded mx-auto mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>)}
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="border-route66-border bg-gradient-to-r from-route66-background to-route66-background-alt">
      <CardContent className="p-3">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {statItems.map((item, index) => <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm mb-1 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-route66-text-primary mb-1">
                {formatNumber(item.value)}
              </div>
              <div className="text-xs text-route66-text-secondary">
                {item.label}
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default CommunityStats;