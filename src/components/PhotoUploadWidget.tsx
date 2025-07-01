
import React, { useState } from 'react';
import { Camera, Upload, Trophy, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TrailblazerService } from '@/services/trailblazerService';
import { useQuery } from '@tanstack/react-query';

interface PhotoUploadWidgetProps {
  location?: string;
  showMiniLeaderboard?: boolean;
  className?: string;
}

const PhotoUploadWidget: React.FC<PhotoUploadWidgetProps> = ({ 
  location = "Route 66", 
  showMiniLeaderboard = true,
  className = ""
}) => {
  const navigate = useNavigate();
  
  const { data: leaderboard } = useQuery({
    queryKey: ['trailblazer-leaderboard-mini'],
    queryFn: () => TrailblazerService.getLeaderboard(3),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleStartChallenge = () => {
    navigate('/test-upload');
  };

  return (
    <Card className={`bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Camera className="w-5 h-5" />
          Route 66 Photo Challenge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <p className="font-semibold text-yellow-800">Become a Trailblazer!</p>
            <p className="text-sm text-yellow-700">
              Share your {location} adventure and be the first to capture iconic locations
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-yellow-700">
            <Camera className="w-4 h-4" />
            <span>Upload photos from your journey</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-700">
            <Trophy className="w-4 h-4" />
            <span>Earn Trailblazer status at new locations</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-700">
            <MapPin className="w-4 h-4" />
            <span>Join the Route 66 community</span>
          </div>
        </div>

        {showMiniLeaderboard && leaderboard && leaderboard.length > 0 && (
          <div className="border-t border-yellow-200 pt-3">
            <p className="text-xs font-semibold text-yellow-800 mb-2">🏆 Top Trailblazers</p>
            <div className="space-y-1">
              {leaderboard.slice(0, 3).map((leader, index) => (
                <div key={leader.user_session_id} className="flex justify-between items-center text-xs">
                  <span className="text-yellow-700">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} Traveler #{leader.user_session_id.slice(-4)}
                  </span>
                  <span className="text-yellow-600 font-medium">{leader.trailblazer_count} locations</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={handleStartChallenge}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold"
        >
          <Upload className="w-4 h-4 mr-2" />
          Start Photo Challenge
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhotoUploadWidget;
