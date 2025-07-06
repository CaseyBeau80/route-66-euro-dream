import { useState, useEffect, useCallback } from 'react';
import { useInstagramPosts } from './useInstagramPosts';

interface UseEnhancedCarouselConfig {
  rotationInterval?: number; // in milliseconds
  autoRotate?: boolean;
}

const DEFAULT_CONFIG: Required<UseEnhancedCarouselConfig> = {
  rotationInterval: 6000, // 6 seconds
  autoRotate: true,
};

export const useEnhancedCarouselLogic = (config: UseEnhancedCarouselConfig = {}) => {
  const { rotationInterval, autoRotate } = { ...DEFAULT_CONFIG, ...config };
  
  const { posts, isLoading, error, updatePostLikes } = useInstagramPosts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postsPerView, setPostsPerView] = useState(4);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [currentRotationIndex, setCurrentRotationIndex] = useState(0);

  // Handle responsive posts per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setPostsPerView(4); // Tablets and larger - 4 posts
      } else {
        setPostsPerView(2); // Mobile - 2 posts
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - postsPerView, 0));
  }, [postsPerView]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, posts.length - postsPerView);
      return Math.min(prevIndex + postsPerView, maxIndex);
    });
  }, [posts.length, postsPerView]);

  // Auto-rotation function
  const rotateToNext = useCallback(() => {
    if (posts.length <= postsPerView) return;
    
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, posts.length - postsPerView);
      const nextIndex = prevIndex + postsPerView;
      
      // If we're at the end, go back to the beginning
      if (nextIndex >= maxIndex) {
        setCurrentRotationIndex(prev => prev + 1);
        return 0;
      }
      
      return nextIndex;
    });
  }, [posts.length, postsPerView]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isRotating || posts.length <= postsPerView || isLoading) return;

    const interval = setInterval(() => {
      rotateToNext();
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [isRotating, rotateToNext, rotationInterval, posts.length, postsPerView, isLoading]);

  // Calculate derived values
  const visiblePosts = posts.slice(currentIndex, currentIndex + postsPerView);
  const totalPages = Math.ceil(posts.length / postsPerView);
  const currentPage = Math.floor(currentIndex / postsPerView) + 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + postsPerView < posts.length;

  // Control functions
  const controls = {
    startRotation: () => setIsRotating(true),
    stopRotation: () => setIsRotating(false),
    manualNext: () => {
      setIsRotating(false); // Stop auto-rotation when user manually navigates
      goToNext();
    },
    manualPrevious: () => {
      setIsRotating(false); // Stop auto-rotation when user manually navigates
      goToPrevious();
    },
    refresh: () => {
      // This will trigger a refetch of posts
      window.location.reload();
    },
  };

  return {
    posts,
    isLoading,
    error,
    currentIndex,
    postsPerView,
    visiblePosts,
    totalPages,
    currentPage,
    canGoPrevious,
    canGoNext,
    isRotating,
    currentRotationIndex,
    goToPrevious,
    goToNext,
    controls,
    updatePostLikes,
  };
};