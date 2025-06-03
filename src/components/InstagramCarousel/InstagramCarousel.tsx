
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
  const [postsPerView, setPostsPerView] = useState(6); // Show more posts by default

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setPostsPerView(6); // Extra large screens - 6 posts
      } else if (window.innerWidth >= 1280) {
        setPostsPerView(4); // Large screens - 4 posts
      } else if (window.innerWidth >= 1024) {
        setPostsPerView(3); // Medium screens - 3 posts
      } else if (window.innerWidth >= 768) {
        setPostsPerView(2); // Tablets - 2 posts
      } else {
        setPostsPerView(1); // Mobile - 1 post
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

  if (error) {
    console.error("🚗 InstagramCarousel: Error loading posts:", error);
    return null;
  }

  const visiblePosts = posts.slice(currentIndex, currentIndex + postsPerView);
  const totalPages = Math.ceil(posts.length / postsPerView);
  const currentPage = Math.floor(currentIndex / postsPerView) + 1;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 bg-white p-8 rounded-xl shadow-2xl border-4 border-route66-red">
          <h2 className="text-4xl font-route66 text-route66-red mb-4 font-bold">
            Route 66 Adventures
          </h2>
          <p className="text-gray-900 max-w-2xl mx-auto text-xl font-semibold">
            Discover authentic moments from the Mother Road through the eyes of fellow travelers
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-route66-red"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {visiblePosts.map((post, index) => (
                <div key={`${post.id}-${currentIndex + index}`} className="w-full">
                  <InstagramCard post={post} />
                </div>
              ))}
            </div>
            
            {/* Navigation and Page Info */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-center text-gray-600">
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages} • Showing {visiblePosts.length} of {posts.length} posts
                </span>
              </div>
              
              <CarouselNavigation 
                onPrevious={goToPrevious}
                onNext={goToNext}
                canGoPrevious={currentIndex > 0}
                canGoNext={currentIndex + postsPerView < posts.length}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramCarousel;
