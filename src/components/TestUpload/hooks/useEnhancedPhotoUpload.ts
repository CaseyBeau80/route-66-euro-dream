
import { useState, useRef } from 'react';
import { TrailblazerService } from '@/services/trailblazerService';

interface ModerationResults {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

interface EnhancedUploadResult {
  success: boolean;
  allowed?: boolean;
  photoUrl?: string;
  isTrailblazer?: boolean;
  moderationResults?: ModerationResults;
  error?: string;
  message?: string;
}

export const useEnhancedPhotoUpload = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [moderationResults, setModerationResults] = useState<ModerationResults | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isTrailblazer, setIsTrailblazer] = useState(false);
  const [showTrailblazerCelebration, setShowTrailblazerCelebration] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const resetUpload = () => {
    setStatus('');
    setModerationResults(null);
    setPhotoUrl('');
    setIsTrailblazer(false);
    setShowTrailblazerCelebration(false);
  };

  const handleUpload = async (file: File, stopId: string = 'photo-spot'): Promise<EnhancedUploadResult> => {
    try {
      setLoading(true);
      setStatus('📸 Processing your Route 66 photo...');
      setModerationResults(null);
      setPhotoUrl('');
      setIsTrailblazer(false);
      setShowTrailblazerCelebration(false);

      console.log('🚀 Starting enhanced upload process for stopId:', stopId);

      // Check if location already has a trailblazer (for user info)
      let existingTrailblazer = null;
      let isLocationUnclaimed = true;
      
      try {
        existingTrailblazer = await TrailblazerService.getLocationTrailblazer(stopId);
        isLocationUnclaimed = !existingTrailblazer?.has_trailblazer;
        console.log('✅ Trailblazer check completed. Unclaimed:', isLocationUnclaimed);
      } catch (trailblazerError) {
        console.warn('⚠️ Trailblazer check failed, continuing with upload:', trailblazerError);
      }

      if (isLocationUnclaimed) {
        setStatus('🔥 This location is unclaimed! You could be the first Trailblazer here...');
      }

      setStatus('🔍 Moderating and uploading your photo...');

      // Create FormData for the Edge Function
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tripId', 'b3c134a9-d90a-4a13-b789-10206ddf90ec');
      formData.append('stopId', stopId);
      formData.append('userSessionId', 'challenge-session-' + Date.now());

      console.log('📡 Calling Edge Function...');

      // Call the Edge Function with timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000); // 60 second timeout

      const response = await fetch('https://xbwaphzntaxmdfzfsmvt.supabase.co/functions/v1/moderate-and-upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📊 Edge Function response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
      }

      const result = await response.json();
      console.log('📄 Edge Function response data:', result);

      if (result.success) {
        setModerationResults(result.moderationResults);
        
        if (result.allowed) {
          setPhotoUrl(result.photoUrl);
          
          const isNewTrailblazer = result.isTrailblazer || false;
          setIsTrailblazer(isNewTrailblazer);
          
          if (isNewTrailblazer) {
            setStatus('🏆 INCREDIBLE! You are now a TRAILBLAZER - the first to capture this Route 66 location!');
            setShowTrailblazerCelebration(true);
          } else {
            setStatus('🎉 Amazing! Your Route 66 photo has been successfully uploaded and is now part of the challenge!');
          }
        } else {
          setStatus('📝 Your photo needs some adjustments to meet our community guidelines. Please try a different image!');
        }
        
        scrollToResults();
        
        return {
          success: true,
          allowed: result.allowed,
          photoUrl: result.photoUrl,
          isTrailblazer: result.isTrailblazer,
          moderationResults: result.moderationResults,
          message: result.message
        };
      } else {
        const errorMessage = result.error || 'Upload failed';
        setStatus(`❌ Upload failed: ${errorMessage}`);
        return {
          success: false,
          error: errorMessage
        };
      }

    } catch (error: any) {
      console.error('💥 Upload error:', error);
      
      let errorMessage = 'Upload failed';
      if (error.name === 'AbortError') {
        errorMessage = 'Upload timed out. Please try again.';
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      setStatus(`❌ ${errorMessage}`);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const closeTrailblazerCelebration = () => {
    setShowTrailblazerCelebration(false);
  };

  return {
    status,
    loading,
    moderationResults,
    photoUrl,
    isTrailblazer,
    showTrailblazerCelebration,
    handleUpload,
    resetUpload,
    closeTrailblazerCelebration,
    resultsRef
  };
};
