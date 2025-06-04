
import React from "react";
import { useCarouselLogic } from "./hooks/useCarouselLogic";
import InstagramCarouselHeader from "./components/InstagramCarouselHeader";
import InstagramCarouselGrid from "./components/InstagramCarouselGrid";
import InstagramCarouselFooter from "./components/InstagramCarouselFooter";
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
    goToPrevious,
    goToNext
  } = useCarouselLogic();

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
            
            <InstagramCarouselFooter
              currentPage={currentPage}
              totalPages={totalPages}
              visiblePostsCount={visiblePosts.length}
              totalPostsCount={posts.length}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={goToPrevious}
              onNext={goToNext}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramCarousel;
