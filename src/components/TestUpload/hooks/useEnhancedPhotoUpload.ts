
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
  photoUrl?: string;
  isTrailblazer?: boolean;
  moderationResults?: ModerationResults;
  error?: string;
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

      // Check if location already has a trailblazer
      const existingTrailblazer = await TrailblazerService.getLocationTrailblazer(stopId);
      const isLocationUnclaimed = !existingTrailblazer?.has_trailblazer;

      if (isLocationUnclaimed) {
        setStatus('🔥 This location is unclaimed! You could be the first Trailblazer here...');
      }

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tripId', 'route66-challenge');
      formData.append('stopId', stopId);
      formData.append('userSessionId', 'challenge-session-' + Date.now());

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
          
          // Check if this upload made the user a trailblazer
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
          photoUrl: result.photoUrl,
          isTrailblazer: isNewTrailblazer,
          moderationResults: result.moderationResults
        };
      } else {
        setStatus(`❌ Upload failed: ${result.error}`);
        return {
          success: false,
          error: result.error
        };
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = `❌ Upload failed: ${error.message}`;
      setStatus(errorMessage);
      return {
        success: false,
        error: error.message
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
