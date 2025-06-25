
import { useState, useEffect } from "react";
import { useInstagramPosts } from "./useInstagramPosts";

export const useCarouselLogic = () => {
  const { posts, isLoading, error } = useInstagramPosts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postsPerView, setPostsPerView] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPostsPerView(6); // Large screens - 6 posts to match reference
      } else if (window.innerWidth >= 768) {
        setPostsPerView(4); // Tablets - 4 posts
      } else {
        setPostsPerView(2); // Mobile - 2 posts
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - postsPerView, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + postsPerView, posts.length - postsPerView));
  };

  const visiblePosts = posts.slice(currentIndex, currentIndex + postsPerView);
  const totalPages = Math.ceil(posts.length / postsPerView);
  const currentPage = Math.floor(currentIndex / postsPerView) + 1;

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + postsPerView < posts.length;

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
    goToPrevious,
    goToNext
  };
};
