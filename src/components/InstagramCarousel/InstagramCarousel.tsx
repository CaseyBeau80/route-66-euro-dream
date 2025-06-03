import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstagramPosts } from "./hooks/useInstagramPosts";
import InstagramCard from "./components/InstagramCard";
import CarouselNavigation from "./components/CarouselNavigation";
import FixedHeaderSection from "./components/FixedHeaderSection";

const InstagramCarousel = () => {
  console.log("🚗 InstagramCarousel: Component rendering");
  
  const { posts, isLoading, error } = useInstagramPosts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postsPerView, setPostsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPostsPerView(3);
      } else if (window.innerWidth >= 768) {
        setPostsPerView(2);
      } else {
        setPostsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, posts.length - postsPerView));
  };

  if (error) {
    console.error("🚗 InstagramCarousel: Error loading posts:", error);
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <FixedHeaderSection />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-route66-red"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / postsPerView)}%)`,
                  width: `${(posts.length / postsPerView) * 100}%`
                }}
              >
                {posts.map((post, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0"
                    style={{ width: `${100 / postsPerView}%` }}
                  >
                    <div className="px-3">
                      <InstagramCard post={post} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <CarouselNavigation 
              onPrevious={goToPrevious}
              onNext={goToNext}
              canGoPrevious={currentIndex > 0}
              canGoNext={currentIndex < posts.length - postsPerView}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramCarousel;
