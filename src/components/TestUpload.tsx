
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { usePhotoUpload } from './TestUpload/hooks/usePhotoUpload';
import { ApiKeyInput } from './TestUpload/components/ApiKeyInput';
import { FileUploadInput } from './TestUpload/components/FileUploadInput';
import { StatusAlert } from './TestUpload/components/StatusAlert';
import { LoadingSpinner } from './TestUpload/components/LoadingSpinner';
import { ModerationResults } from './TestUpload/components/ModerationResults';
import { UploadedImageDisplay } from './TestUpload/components/UploadedImageDisplay';

export default function TestUpload() {
  const [apiKey, setApiKey] = useState('');
  const {
    status,
    loading,
    moderationResults,
    photoUrl,
    handleUpload
  } = usePhotoUpload();

  const handleFileSelect = (file: File) => {
    handleUpload(file, apiKey);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Photo Challenge Upload Test (Edge Function)
          </CardTitle>
          <CardDescription>
            Test the server-side photo moderation system with Google Cloud Vision API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApiKeyInput
            apiKey={apiKey}
            onChange={setApiKey}
          />

          <FileUploadInput
            onFileSelect={handleFileSelect}
            disabled={loading}
          />

          <StatusAlert status={status} />

          <LoadingSpinner loading={loading} />
        </CardContent>
      </Card>

      <ModerationResults results={moderationResults} />

      <UploadedImageDisplay photoUrl={photoUrl} />
    </div>
  );
}
