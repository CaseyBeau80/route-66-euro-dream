import { useState } from 'react';
import { useEnhancedPhotoUpload } from '@/components/TestUpload/hooks/useEnhancedPhotoUpload';

export const useSocialPhotoUpload = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  const {
    status,
    loading,
    moderationResults,
    photoUrl,
    isTrailblazer,
    showTrailblazerCelebration,
    handleUpload: baseHandleUpload,
    resetUpload: baseResetUpload,
    closeTrailblazerCelebration,
    resultsRef
  } = useEnhancedPhotoUpload();

  const handleSocialUpload = async (file: File, location?: string, hashtag?: string) => {
    try {
      const result = await baseHandleUpload(file, 'social-photo-spot', location, hashtag);
      
      // Track uploaded photos for the session
      if (result.success && result.photoUrl) {
        setUploadedPhotos(prev => [...prev, result.photoUrl!]);
      }
      
      return result;
    } catch (error: any) {
      console.error('Social upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  };

  const resetUpload = () => {
    baseResetUpload();
    // Keep the uploaded photos list - don't clear session history
  };

  const clearSession = () => {
    setUploadedPhotos([]);
    baseResetUpload();
  };

  return {
    status,
    loading,
    moderationResults,
    photoUrl,
    isTrailblazer,
    showTrailblazerCelebration,
    uploadedPhotos,
    handleUpload: handleSocialUpload,
    resetUpload,
    clearSession,
    closeTrailblazerCelebration,
    resultsRef
  };
};
