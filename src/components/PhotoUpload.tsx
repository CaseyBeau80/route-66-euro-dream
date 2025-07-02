import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  tripId?: string;
  stopId?: string;
  userSessionId?: string;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: string) => void;
}

interface UploadResult {
  success: boolean;
  photoUrl?: string;
  isTrailblazer?: boolean;
  moderationResults?: any;
  error?: string;
  message?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  tripId = 'route66-challenge',
  stopId = 'photo-spot',
  userSessionId = `upload-session-${Date.now()}`,
  onUploadSuccess,
  onUploadError
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Please select a JPG or PNG image file.';
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return 'File size must be under 50MB.';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadResult({
        success: false,
        error: validationError
      });
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('tripId', tripId);
      formData.append('stopId', stopId);
      formData.append('userSessionId', userSessionId);

      console.log('Starting upload for:', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        tripId,
        stopId,
        userSessionId
      });

      // Call the Edge Function
      const response = await fetch(
        'https://xbwaphzntaxmdfzfsmvt.supabase.co/functions/v1/moderate-and-upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUploadResult(result);
        onUploadSuccess?.(result);
      } else {
        const errorMsg = result.error || 'Upload failed';
        setUploadResult({
          success: false,
          error: errorMsg
        });
        onUploadError?.(errorMsg);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMsg = error.message || 'Upload failed';
      setUploadResult({
        success: false,
        error: errorMsg
      });
      onUploadError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Photo Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-400">JPG or PNG (max 50MB)</p>
            </div>
          </label>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Photo'
          )}
        </Button>

        {/* Reset Button */}
        {(selectedFile || uploadResult) && (
          <Button
            onClick={resetUpload}
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            Reset
          </Button>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <Alert className={uploadResult.success ? 'border-green-500' : 'border-red-500'}>
            <div className="flex items-start gap-2">
              {uploadResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription>
                  {uploadResult.success ? (
                    <div>
                      <p className="font-medium text-green-700">
                        {uploadResult.message || 'Upload successful!'}
                      </p>
                      {uploadResult.isTrailblazer && (
                        <p className="text-sm text-amber-600 mt-1">
                          🏆 Congratulations! You're the first Trailblazer at this location!
                        </p>
                      )}
                      {uploadResult.photoUrl && (
                        <p className="text-xs text-gray-500 mt-1">
                          Photo URL: {uploadResult.photoUrl}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-700">
                      {uploadResult.error || 'Upload failed'}
                    </p>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};