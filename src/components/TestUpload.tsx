
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Route } from 'lucide-react';
import { usePhotoUpload } from './TestUpload/hooks/usePhotoUpload';
import { FileUploadInput } from './TestUpload/components/FileUploadInput';
import { StatusAlert } from './TestUpload/components/StatusAlert';
import { LoadingSpinner } from './TestUpload/components/LoadingSpinner';
import { ModerationResults } from './TestUpload/components/ModerationResults';
import { UploadedImageDisplay } from './TestUpload/components/UploadedImageDisplay';

export default function TestUpload() {
  const {
    status,
    loading,
    moderationResults,
    photoUrl,
    handleUpload,
    resetUpload
  } = usePhotoUpload();

  const handleFileSelect = (file: File) => {
    handleUpload(file);
  };

  const handleReplacePhoto = () => {
    resetUpload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Route 66 Media Upload Challenge
          </CardTitle>
          <CardDescription>
            Share your Route 66 adventure content! Upload photos, videos, or travel planning materials from your journey along the historic highway.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

      <ModerationResults results={moderationResults} />

      <UploadedImageDisplay 
        photoUrl={photoUrl} 
        onReplacePhoto={handleReplacePhoto}
      />
    </div>
  );
}
