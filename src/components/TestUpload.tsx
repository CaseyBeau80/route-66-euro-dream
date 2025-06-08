
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';

interface ModerationResults {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

export default function TestUpload() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [moderationResults, setModerationResults] = useState<ModerationResults | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!apiKey.trim()) {
      setStatus('❌ Please enter your Google Cloud Vision API key');
      return;
    }

    try {
      setLoading(true);
      setStatus('🔍 Analyzing image for content moderation...');
      setModerationResults(null);
      setPhotoUrl('');

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('image', file);
      formData.append('apiKey', apiKey);
      formData.append('tripId', 'demo-trip');
      formData.append('stopId', 'tulsa');
      formData.append('userSessionId', 'test-session-' + Date.now());

      console.log('Sending request to Edge Function...');

      // Call the Supabase Edge Function
      const response = await fetch('https://xbwaphzntaxmdfzfsmvt.supabase.co/functions/v1/moderate-and-upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo`
        }
      });

      console.log('Edge Function response status:', response.status);

      const result = await response.json();
      console.log('Edge Function response:', result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (result.success) {
        setModerationResults(result.moderationResults);
        
        if (result.allowed) {
          setPhotoUrl(result.photoUrl);
          setStatus('✅ Upload successful! Image passed moderation and was saved.');
        } else {
          setStatus('❌ Image rejected: Content does not meet safety guidelines');
        }
      } else {
        setStatus(`❌ Upload failed: ${result.error}`);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setStatus(`❌ Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'VERY_UNLIKELY':
      case 'UNLIKELY':
        return 'text-green-600';
      case 'POSSIBLE':
        return 'text-yellow-600';
      case 'LIKELY':
      case 'VERY_LIKELY':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google Cloud Vision API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUpload">Select Image (JPG or PNG)</Label>
            <Input
              id="fileUpload"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleUpload}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Trip ID: demo-trip | Stop ID: tulsa
            </p>
          </div>

          {status && (
            <Alert variant={status.includes('❌') ? 'destructive' : 'default'}>
              <div className="flex items-center gap-2">
                {status.includes('✅') && <CheckCircle className="h-4 w-4" />}
                {status.includes('❌') && <AlertTriangle className="h-4 w-4" />}
                <AlertDescription>{status}</AlertDescription>
              </div>
            </Alert>
          )}

          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Processing via Edge Function...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {moderationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Moderation Results</CardTitle>
            <CardDescription>
              Google Cloud Vision SafeSearch Analysis (from Edge Function)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Adult:</span>
                  <span className={getStatusColor(moderationResults.adult)}>
                    {moderationResults.adult}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Violence:</span>
                  <span className={getStatusColor(moderationResults.violence)}>
                    {moderationResults.violence}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Racy:</span>
                  <span className={getStatusColor(moderationResults.racy)}>
                    {moderationResults.racy}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Spoof:</span>
                  <span className={getStatusColor(moderationResults.spoof)}>
                    {moderationResults.spoof}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Medical:</span>
                  <span className={getStatusColor(moderationResults.medical)}>
                    {moderationResults.medical}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {photoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={photoUrl} 
              alt="Uploaded challenge photo" 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Image URL: {photoUrl}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
