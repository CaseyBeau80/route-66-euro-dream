
import React from "react";
import { useEnhancedCarouselLogic } from "./hooks/useEnhancedCarouselLogic";
import InstagramCarouselHeader from "./components/InstagramCarouselHeader";
import InstagramCarouselGrid from "./components/InstagramCarouselGrid";
import EnhancedInstagramCarouselFooter from "./components/EnhancedInstagramCarouselFooter";
import InstagramCarouselLoading from "./components/InstagramCarouselLoading";

const InstagramCarousel = () => {
  console.log("🚗 InstagramCarousel: Component rendering");
  
  const {
    posts,
    isLoading,
    error,
    visiblePosts,
    totalPages,
    currentPage,
    currentIndex,
    canGoPrevious,
    canGoNext,
    isRotating,
    controls,
  } = useEnhancedCarouselLogic();

  if (error) {
    console.error("🚗 InstagramCarousel: Error loading posts:", error);
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <InstagramCarouselHeader />
        
        {isLoading ? (
          <InstagramCarouselLoading />
        ) : (
          <div className="space-y-8">
            <InstagramCarouselGrid 
              visiblePosts={visiblePosts}
              currentIndex={currentIndex}
            />
            
            <EnhancedInstagramCarouselFooter
              currentPage={currentPage}
              totalPages={totalPages}
              visiblePostsCount={visiblePosts.length}
              totalPostsCount={posts.length}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              isRotating={isRotating}
              onPrevious={controls.manualPrevious}
              onNext={controls.manualNext}
              onStartRotation={controls.startRotation}
              onStopRotation={controls.stopRotation}
              onRefresh={controls.refresh}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramCarousel;
