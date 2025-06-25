
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInstagramPosts } from "../hooks/useInstagramPosts";
import SimpleInstagramCard from "./SimpleInstagramCard";

const SimpleInstagramCarousel = () => {
  console.log("🚗 SimpleInstagramCarousel: Component rendering");
  
  const { posts, isLoading, error, updatePostLikes } = useInstagramPosts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postsPerView, setPostsPerView] = useState(4);

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

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - postsPerView, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + postsPerView, posts.length - postsPerView));
  };

  const handleLike = (postId: string) => {
    updatePostLikes(postId);
  };

  if (error) {
    console.error("🚗 SimpleInstagramCarousel: Error loading posts:", error);
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl font-route66 text-route66-primary mb-4 font-bold">
              Route 66 Adventures
            </h2>
            <p className="text-gray-600">
              Unable to load Instagram posts at the moment. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 bg-white p-8 rounded-xl shadow-2xl border-4 border-route66-primary">
            <h2 className="text-4xl font-route66 text-route66-primary mb-4 font-bold">
              Route 66 Adventures
            </h2>
            <p className="text-gray-900 max-w-2xl mx-auto text-xl font-semibold">
              Discover authentic moments from the Mother Road through the eyes of fellow travelers
            </p>
          </div>
          
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-route66-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  const visiblePosts = posts.slice(currentIndex, currentIndex + postsPerView);
  const totalPages = Math.ceil(posts.length / postsPerView);
  const currentPage = Math.floor(currentIndex / postsPerView) + 1;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with blue color scheme */}
        <div className="text-center mb-12 bg-white p-8 rounded-xl shadow-2xl border-4 border-route66-primary">
          <h2 className="text-4xl font-route66 text-route66-primary mb-4 font-bold">
            ROUTE 66 ADVENTURES
          </h2>
          <p className="text-gray-900 max-w-2xl mx-auto text-xl font-semibold">
            Discover authentic moments from the Mother Road through the eyes of fellow travelers
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Posts Grid - 4 larger photos per row with enhanced hover */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {visiblePosts.map((post, index) => (
              <div key={`${post.id}-${currentIndex + index}`} className="w-full">
                <SimpleInstagramCard post={post} onLike={handleLike} />
              </div>
            ))}
          </div>
          
          {/* Navigation and Page Info with blue theme */}
          {posts.length > postsPerView && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center text-gray-600">
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages} • Showing {visiblePosts.length} of {posts.length} posts
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-100 border-2 border-blue-300 text-route66-primary rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 hover:border-blue-400 transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <button
                  onClick={goToNext}
                  disabled={currentIndex + postsPerView >= posts.length}
                  className="flex items-center gap-2 px-6 py-3 bg-route66-primary border-2 border-route66-primary text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-route66-primary-dark hover:border-route66-primary-dark transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleInstagramCarousel;
