
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Route, Trophy } from 'lucide-react';
import { useEnhancedPhotoUpload } from './TestUpload/hooks/useEnhancedPhotoUpload';
import { FileUploadInput } from './TestUpload/components/FileUploadInput';
import { StatusAlert } from './TestUpload/components/StatusAlert';
import { LoadingSpinner } from './TestUpload/components/LoadingSpinner';
import { ModerationResults } from './TestUpload/components/ModerationResults';
import { UploadedImageDisplay } from './TestUpload/components/UploadedImageDisplay';
import TrailblazerBadge from './TestUpload/components/TrailblazerBadge';
import TrailblazerCelebration from './TestUpload/components/TrailblazerCelebration';
import TrailblazerStatusDisplay from './TestUpload/components/TrailblazerStatusDisplay';
import TrailblazerLeaderboardComponent from './TestUpload/components/TrailblazerLeaderboard';

export default function TestUpload() {
  const [selectedStopId, setSelectedStopId] = useState('photo-spot');
  const [selectedLocationName, setSelectedLocationName] = useState('Route 66 Photo Spot');
  
  const {
    status,
    loading,
    moderationResults,
    photoUrl,
    isTrailblazer,
    showTrailblazerCelebration,
    handleUpload,
    resetUpload,
    closeTrailblazerCelebration
  } = useEnhancedPhotoUpload();

  const handleFileSelect = (file: File) => {
    handleUpload(file, selectedStopId);
  };

  const handleReplacePhoto = () => {
    resetUpload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Trailblazer Celebration Modal */}
      <TrailblazerCelebration
        isVisible={showTrailblazerCelebration}
        onClose={closeTrailblazerCelebration}
        locationName={selectedLocationName}
      />

      {/* Main Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Route 66 Photo Challenge
            {isTrailblazer && <TrailblazerBadge isTrailblazer={true} size="sm" />}
          </CardTitle>
          <CardDescription>
            Share your Route 66 adventure content! Upload photos from your journey along the historic highway.
            {!photoUrl && (
              <span className="block mt-2 text-sm font-medium text-blue-600">
                💡 Be the first to capture a location and become a <strong>Trailblazer</strong>!
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Select Location
            </label>
            <select
              value={selectedStopId}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedStopId(value);
                // Update location name based on selection
                const locationNames: Record<string, string> = {
                  'photo-spot': 'Route 66 Photo Spot',
                  'chicago-start': 'Chicago - Route 66 Start',
                  'springfield-il': 'Springfield, Illinois',
                  'st-louis-mo': 'St. Louis, Missouri',
                  'tulsa-ok': 'Tulsa, Oklahoma',
                  'amarillo-tx': 'Amarillo, Texas',
                  'albuquerque-nm': 'Albuquerque, New Mexico',
                  'flagstaff-az': 'Flagstaff, Arizona',
                  'santa-monica-ca': 'Santa Monica - Route 66 End'
                };
                setSelectedLocationName(locationNames[value] || 'Route 66 Location');
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="photo-spot">Route 66 Photo Spot</option>
              <option value="chicago-start">Chicago - Route 66 Start</option>
              <option value="springfield-il">Springfield, Illinois</option>
              <option value="st-louis-mo">St. Louis, Missouri</option>
              <option value="tulsa-ok">Tulsa, Oklahoma</option>
              <option value="amarillo-tx">Amarillo, Texas</option>
              <option value="albuquerque-nm">Albuquerque, New Mexico</option>
              <option value="flagstaff-az">Flagstaff, Arizona</option>
              <option value="santa-monica-ca">Santa Monica - Route 66 End</option>
            </select>
          </div>

          {/* Trailblazer Status for Selected Location */}
          <TrailblazerStatusDisplay
            stopId={selectedStopId}
            locationName={selectedLocationName}
            showDetails={true}
          />

          {/* File Upload */}
          {!photoUrl && (
            <FileUploadInput
              onFileSelect={handleFileSelect}
              disabled={loading}
            />
          )}

          <StatusAlert status={status} />
          <LoadingSpinner loading={loading} />
        </CardContent>
      </Card>

      {/* Results */}
      <ModerationResults results={moderationResults} />
      <UploadedImageDisplay 
        photoUrl={photoUrl} 
        onReplacePhoto={handleReplacePhoto}
        isTrailblazer={isTrailblazer}
      />

      {/* Trailblazer Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrailblazerLeaderboardComponent 
          limit={10}
          className="h-fit"
        />
        
        {/* Info Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Trailblazer Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">First to Discover</p>
                  <p className="text-xs text-gray-600">
                    Be the first to upload a photo at any Route 66 location
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Earn Recognition</p>
                  <p className="text-xs text-gray-600">
                    Get the Trailblazer badge and appear on the leaderboard
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Route className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Explore More</p>
                  <p className="text-xs text-gray-600">
                    Discover hidden gems and collect multiple Trailblazer achievements
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800 text-center">
                🎯 Ready to become a Trailblazer?
              </p>
              <p className="text-xs text-yellow-700 text-center mt-1">
                Upload your first photo and start your Route 66 adventure!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
