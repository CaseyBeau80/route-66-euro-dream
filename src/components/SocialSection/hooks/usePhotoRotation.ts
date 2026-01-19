import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GalleryPhoto {
  id: string;
  photo_url: string;
  stop_id: string;
  created_at: string;
  is_trailblazer: boolean;
  user_session_id: string;
}

interface UsePhotoRotationConfig {
  totalPhotos?: number;
  displayCount?: number;
  rotationInterval?: number; // in milliseconds
}

const DEFAULT_CONFIG: Required<UsePhotoRotationConfig> = {
  totalPhotos: 30,
  displayCount: 6,
  rotationInterval: 8000, // 8 seconds
};

export const usePhotoRotation = (config: UsePhotoRotationConfig = {}) => {
  const { totalPhotos, displayCount, rotationInterval } = { ...DEFAULT_CONFIG, ...config };
  
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>([]);
  const [visiblePhotoIndices, setVisiblePhotoIndices] = useState<number[]>([]);
  const [currentRotationIndex, setCurrentRotationIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  // Fetch photos from database
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('photo_challenges')
        .select('*')
        .not('moderation_result', 'is', null)
        .order('created_at', { ascending: false })
        .limit(totalPhotos);

      if (error) {
        console.error('Error fetching photos:', error);
        setError('Failed to load photos');
        return;
      }

      // Filter for approved photos
      const approvedPhotos = data?.filter(photo => {
        if (!photo.moderation_result) return false;
        const moderation = photo.moderation_result as any;
        return (
          (moderation.adult === 'VERY_UNLIKELY' || moderation.adult === 'UNLIKELY') &&
          (moderation.violence === 'VERY_UNLIKELY' || moderation.violence === 'UNLIKELY') &&
          (moderation.racy === 'VERY_UNLIKELY' || moderation.racy === 'UNLIKELY')
        );
      }) || [];

      setAllPhotos(approvedPhotos);
      
      // Initialize visible photos with first batch
      if (approvedPhotos.length > 0) {
        const initialIndices = Array.from({ length: Math.min(displayCount, approvedPhotos.length) }, (_, i) => i);
        setVisiblePhotoIndices(initialIndices);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [totalPhotos, displayCount]);

  // Generate new random selection of photos
  const getRandomPhotoIndices = useCallback(() => {
    if (allPhotos.length <= displayCount) {
      return Array.from({ length: allPhotos.length }, (_, i) => i);
    }

    const indices = new Set<number>();
    while (indices.size < displayCount) {
      const randomIndex = Math.floor(Math.random() * allPhotos.length);
      indices.add(randomIndex);
    }
    return Array.from(indices).sort((a, b) => allPhotos[b].created_at.localeCompare(allPhotos[a].created_at));
  }, [allPhotos, displayCount]);

  // Rotate to next set of photos
  const rotatePhotos = useCallback(() => {
    if (allPhotos.length > displayCount) {
      const newIndices = getRandomPhotoIndices();
      setVisiblePhotoIndices(newIndices);
      setCurrentRotationIndex(prev => prev + 1);
    }
  }, [allPhotos.length, displayCount, getRandomPhotoIndices]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isRotating || allPhotos.length <= displayCount) return;

    const interval = setInterval(() => {
      rotatePhotos();
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [isRotating, rotatePhotos, rotationInterval, allPhotos.length, displayCount]);

  // Initial fetch
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Get currently visible photos
  const currentPhotos = visiblePhotoIndices.map(index => allPhotos[index]).filter(Boolean);

  const controls = {
    startRotation: () => setIsRotating(true),
    stopRotation: () => setIsRotating(false),
    manualRotate: rotatePhotos,
    refresh: fetchPhotos,
  };

  return {
    photos: currentPhotos,
    allPhotosCount: allPhotos.length,
    loading,
    error,
    isRotating,
    currentRotationIndex,
    controls,
  };
};