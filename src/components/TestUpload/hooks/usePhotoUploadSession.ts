import { useState, useEffect } from 'react';

const MAX_PHOTOS_PER_SESSION = 5;
const SESSION_STORAGE_KEY = 'route66_photo_session';

interface PhotoUploadSession {
  uploadedPhotos: string[];
  sessionId: string;
  timestamp: number;
}

export const usePhotoUploadSession = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Load session data on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      try {
        const session: PhotoUploadSession = JSON.parse(stored);
        // Check if session is from current browser session (not persisted across page reloads)
        // We'll consider a session valid only for the current page session
        setUploadedPhotos(session.uploadedPhotos || []);
      } catch (error) {
        console.warn('Failed to parse stored session data:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  // Save session data whenever it changes
  useEffect(() => {
    const sessionData: PhotoUploadSession = {
      uploadedPhotos,
      sessionId,
      timestamp: Date.now()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }, [uploadedPhotos, sessionId]);

  const addPhoto = (photoUrl: string) => {
    if (uploadedPhotos.length < MAX_PHOTOS_PER_SESSION) {
      setUploadedPhotos(prev => [...prev, photoUrl]);
      return true;
    }
    return false;
  };

  const removePhoto = (photoUrl: string) => {
    setUploadedPhotos(prev => prev.filter(url => url !== photoUrl));
  };

  const resetSession = () => {
    setUploadedPhotos([]);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const canUploadMore = uploadedPhotos.length < MAX_PHOTOS_PER_SESSION;
  const remainingUploads = MAX_PHOTOS_PER_SESSION - uploadedPhotos.length;
  const uploadCount = uploadedPhotos.length;

  return {
    uploadedPhotos,
    uploadCount,
    maxPhotos: MAX_PHOTOS_PER_SESSION,
    remainingUploads,
    canUploadMore,
    addPhoto,
    removePhoto,
    resetSession,
    sessionId
  };
};