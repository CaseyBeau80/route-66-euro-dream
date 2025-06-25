
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { TrailblazerService, LocationTrailblazer } from '@/services/trailblazerService';
import TrailblazerBadge from './TrailblazerBadge';

interface TrailblazerStatusDisplayProps {
  stopId: string;
  locationName?: string;
  className?: string;
  showDetails?: boolean;
}

const TrailblazerStatusDisplay: React.FC<TrailblazerStatusDisplayProps> = ({
  stopId,
  locationName = 'this location',
  className = '',
  showDetails = true
}) => {
  const [trailblazer, setTrailblazer] = useState<LocationTrailblazer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrailblazer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TrailblazerService.getLocationTrailblazer(stopId);
        setTrailblazer(data);
      } catch (err) {
        console.error('Failed to fetch trailblazer:', err);
        setError('Failed to load trailblazer status');
      } finally {
        setLoading(false);
      }
    };

    if (stopId) {
      fetchTrailblazer();
    }
  }, [stopId]);

  if (loading) {
    return (
      <Card className={`${className} border-dashed border-gray-300`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} border-red-200 bg-red-50`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trailblazer || !trailblazer.has_trailblazer) {
    return (
      <Card className={`${className} border-blue-200 bg-blue-50`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                No Trailblazer Yet!
              </p>
              <p className="text-xs text-blue-700">
                Be the first to capture {locationName}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
              Unclaimed
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayName = TrailblazerService.formatSessionId(trailblazer.user_session_id);
  const achievedDate = new Date(trailblazer.achieved_at);

  return (
    <Card className={`${className} border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Trailblazer Photo */}
          <div className="relative">
            {trailblazer.photo_url ? (
              <img
                src={trailblazer.photo_url}
                alt="Trailblazer photo"
                className="w-12 h-12 rounded-lg object-cover border-2 border-yellow-300 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center border-2 border-yellow-300">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            )}
            <div className="absolute -top-1 -right-1">
              <Crown className="w-4 h-4 text-yellow-600" />
            </div>
          </div>

          {/* Trailblazer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TrailblazerBadge isTrailblazer={true} size="sm" />
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-600 mb-2">
              First to discover {locationName}
            </p>
            
            {showDetails && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{achievedDate.toLocaleDateString()}</span>
                </div>
                {trailblazer.photo_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => window.open(trailblazer.photo_url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Photo
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Achievement Highlight */}
        <div className="mt-3 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-md border border-yellow-200">
          <div className="flex items-center justify-center gap-2 text-xs text-yellow-800">
            <Trophy className="w-3 h-3" />
            <span className="font-medium">Pioneer of {locationName}</span>
            <Trophy className="w-3 h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrailblazerStatusDisplay;
