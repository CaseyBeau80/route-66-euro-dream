import { useState, useRef } from 'react';
import { TrailblazerService } from '@/services/trailblazerService';
import { usePhotoUploadSession } from '@/components/TestUpload/hooks/usePhotoUploadSession';

interface ModerationResults {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

interface SocialUploadResult {
  success: boolean;
  allowed?: boolean;
  photoUrl?: string;
  isTrailblazer?: boolean;
  moderationResults?: ModerationResults;
  error?: string;
  message?: string;
}

export const useSocialPhotoUpload = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [moderationResults, setModerationResults] = useState<ModerationResults | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isTrailblazer, setIsTrailblazer] = useState(false);
  const [showTrailblazerCelebration, setShowTrailblazerCelebration] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Session management for upload limits
  const {
    uploadCount,
    maxPhotos,
    remainingUploads,
    canUploadMore,
    addPhoto,
    resetSession
  } = usePhotoUploadSession();

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

  const handleUpload = async (file: File, category?: string, state?: string): Promise<SocialUploadResult> => {
    try {
      // Check upload limit before processing
      if (!canUploadMore) {
        const limitMessage = "You've reached the limit of 5 photos. Please choose your best shots!";
        setStatus(`🚫 ${limitMessage}`);
        return {
          success: false,
          error: limitMessage
        };
      }

      setLoading(true);
      setStatus('📸 Processing your Route 66 photo...');
      setModerationResults(null);
      setPhotoUrl('');
      setIsTrailblazer(false);
      setShowTrailblazerCelebration(false);

      console.log('🚀 Starting social photo upload process');

      // Check if location already has a trailblazer (for user info)
      let existingTrailblazer = null;
      let isLocationUnclaimed = true;
      
      try {
        existingTrailblazer = await TrailblazerService.getLocationTrailblazer('social-photo-spot');
        isLocationUnclaimed = !existingTrailblazer?.has_trailblazer;
        console.log('✅ Trailblazer check completed. Unclaimed:', isLocationUnclaimed);
      } catch (trailblazerError) {
        console.warn('⚠️ Trailblazer check failed, continuing with upload:', trailblazerError);
      }

      if (isLocationUnclaimed) {
        setStatus('🔥 This could make you a community Trailblazer...');
      }

      setStatus('🔍 Moderating and uploading your photo...');

      // Create FormData for the Edge Function
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tripId', 'social-photo-gallery');
      formData.append('stopId', 'social-photo-spot');
      formData.append('userSessionId', 'social-session-' + Date.now());
      
      // Add optional fields if provided
      if (category) {
        formData.append('category', category);
      }
      if (state) {
        formData.append('state', state);
      }

      console.log('📡 Calling Edge Function with category:', category, 'state:', state);

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
          
          // Add photo to session tracking
          addPhoto(result.photoUrl);
          
          // Add to uploaded photos list
          setUploadedPhotos(prev => [...prev, result.photoUrl]);
          
          const isNewTrailblazer = result.isTrailblazer || false;
          setIsTrailblazer(isNewTrailblazer);
          
          if (isNewTrailblazer) {
            setStatus('🏆 INCREDIBLE! You are now a TRAILBLAZER - the first to share from this community spot!');
            setShowTrailblazerCelebration(true);
          } else {
            setStatus('🎉 Amazing! Your Route 66 photo has been added to our community gallery!');
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
    uploadedPhotos,
    handleUpload,
    resetUpload,
    closeTrailblazerCelebration,
    resultsRef,
    // Session data for upload limits
    uploadCount,
    maxPhotos,
    remainingUploads,
    canUploadMore,
    resetSession
  };
};