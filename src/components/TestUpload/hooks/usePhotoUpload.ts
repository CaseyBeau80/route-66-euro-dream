
import { useState } from 'react';

interface ModerationResults {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

export const usePhotoUpload = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [moderationResults, setModerationResults] = useState<ModerationResults | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');

  const handleUpload = async (file: File, apiKey: string) => {
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

  return {
    status,
    loading,
    moderationResults,
    photoUrl,
    handleUpload
  };
};
