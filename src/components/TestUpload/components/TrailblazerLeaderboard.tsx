
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import { TrailblazerService, TrailblazerLeaderboard } from '@/services/trailblazerService';

interface TrailblazerLeaderboardProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

const TrailblazerLeaderboardComponent: React.FC<TrailblazerLeaderboardProps> = ({
  limit = 10,
  showTitle = true,
  className = ''
}) => {
  const [leaderboard, setLeaderboard] = useState<TrailblazerLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TrailblazerService.getTrailblazerLeaderboard(limit);
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Trailblazer Leaderboard
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-red-500" />
              Trailblazer Leaderboard
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className={className}>
        {showTitle && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Trailblazer Leaderboard
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No Trailblazers Yet!</p>
            <p className="text-sm">Be the first to discover Route 66 locations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Trailblazer Leaderboard
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            const displayName = TrailblazerService.formatSessionId(entry.user_session_id);
            
            return (
              <div
                key={entry.user_session_id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md
                  ${rank <= 3 ? getRankColor(rank) : 'bg-gray-50 hover:bg-gray-100'}
                `}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8">
                  {rank <= 3 ? (
                    getRankIcon(rank)
                  ) : (
                    <span className="font-bold text-gray-600">#{rank}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      {displayName}
                    </span>
                    {rank === 1 && (
                      <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 text-xs">
                        👑 CHAMPION
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={rank <= 3 ? 'text-white/90' : 'text-gray-600'}>
                      {entry.trailblazer_count} location{entry.trailblazer_count !== 1 ? 's' : ''}
                    </span>
                    <span className={rank <= 3 ? 'text-white/70' : 'text-gray-400'}>•</span>
                    <span className={rank <= 3 ? 'text-white/90' : 'text-gray-600'}>
                      Latest: {new Date(entry.latest_achievement).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Achievement Count Badge */}
                <Badge 
                  variant={rank <= 3 ? "secondary" : "outline"}
                  className={`
                    font-bold
                    ${rank <= 3 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  `}
                >
                  {entry.trailblazer_count}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Join the Adventure!
            </p>
            <p className="text-xs text-gray-600">
              Upload photos at Route 66 locations to become a Trailblazer
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrailblazerLeaderboardComponent;
