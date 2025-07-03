
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Upload, Trophy } from 'lucide-react';
import TrailblazerBadge from './TrailblazerBadge';

interface UploadedImageDisplayProps {
  photoUrl: string;
  onReplacePhoto: () => void;
  isTrailblazer?: boolean;
  canUploadMore?: boolean;
  uploadCount?: number;
  maxPhotos?: number;
}

export const UploadedImageDisplay: React.FC<UploadedImageDisplayProps> = ({
  photoUrl,
  onReplacePhoto,
  isTrailblazer = false,
  canUploadMore = true,
  uploadCount = 0,
  maxPhotos = 5
}) => {
  if (!photoUrl) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 border-b border-green-200">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Upload Successful!
          {isTrailblazer && (
            <TrailblazerBadge 
              isTrailblazer={true} 
              size="md"
              className="ml-2"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Image Display */}
          <div className="relative group">
            <img
              src={photoUrl}
              alt="Uploaded Route 66 photo"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-105"
            />
            {isTrailblazer && (
              <div className="absolute top-2 left-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  🏆 TRAILBLAZER PHOTO
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-green-800">
              Your Route 66 adventure photo is now live!
            </p>
            {isTrailblazer ? (
              <div className="space-y-2">
                <p className="text-sm text-yellow-700 font-medium">
                  🎉 Congratulations! You're the first to capture this location!
                </p>
                <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Trailblazer Achievement Unlocked
                  </span>
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Thank you for contributing to the Route 66 photo challenge!
              </p>
            )}
          </div>

          {/* Photo Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-green-600 font-semibold">
                  ✅ Approved & Live
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-blue-600">
                  {isTrailblazer ? '🏆 Trailblazer' : '📸 Challenge'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Uploaded:</span>
                <span className="ml-2 text-gray-600">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Challenge:</span>
                <span className="ml-2 text-purple-600">Route 66</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            {canUploadMore ? (
              <Button
                onClick={onReplacePhoto}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Another Photo
              </Button>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-red-600 font-medium">
                  Upload limit reached ({uploadCount}/{maxPhotos} photos)
                </p>
                <p className="text-xs text-gray-500">
                  Refresh the page to start a new session
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
