
import React from 'react';
import { useInstagramPosts } from './hooks/useInstagramPosts';
import InstagramCard from './components/InstagramCard';
import CarouselNavigation from './components/CarouselNavigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const InstagramCarousel = () => {
  const { posts, isLoading, error } = useInstagramPosts();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-route66 text-4xl md:text-5xl text-route66-vintage-yellow mb-4">
              ROUTE 66 ADVENTURES
            </h2>
            <p className="font-travel text-xl text-white">Loading Instagram posts...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="w-full h-64 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-route66 text-4xl md:text-5xl text-route66-vintage-yellow mb-4">
            ROUTE 66 ADVENTURES
          </h2>
          <p className="font-travel text-xl text-white">
            Unable to load Instagram posts at the moment. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full px-4 py-8 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-route66 text-4xl md:text-5xl text-route66-vintage-yellow mb-4">
            ROUTE 66 ADVENTURES
          </h2>
          <p className="font-travel text-xl text-white">
            No Instagram posts available yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(posts.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(posts.length / 3)) % Math.ceil(posts.length / 3));
  };

  const visiblePosts = posts.slice(currentIndex * 3, (currentIndex + 1) * 3);

  return (
    <div className="w-full px-4 py-8 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-route66 text-4xl md:text-5xl text-route66-vintage-yellow mb-4 drop-shadow-lg">
            ROUTE 66 ADVENTURES
          </h2>
          <p className="font-travel text-xl text-white max-w-3xl mx-auto">
            Follow the journey through America's most iconic highway
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="text-route66-vintage-yellow text-2xl">📸</span>
            <span className="font-americana text-white">@route66adventures</span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-route66-vintage-yellow text-black p-3 rounded-full shadow-lg hover:bg-route66-orange transition-colors duration-200"
            aria-label="Previous posts"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-route66-vintage-yellow text-black p-3 rounded-full shadow-lg hover:bg-route66-orange transition-colors duration-200"
            aria-label="Next posts"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Posts Grid */}
          <div className="mx-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
              {visiblePosts.map((post) => (
                <InstagramCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          <CarouselNavigation 
            totalSlides={Math.ceil(posts.length / 3)}
            currentIndex={currentIndex}
            onSlideChange={setCurrentIndex}
          />
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <a 
            href="https://instagram.com/route66adventures" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block vintage-button px-8 py-3 text-lg font-bold"
          >
            VIEW MORE ON INSTAGRAM
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstagramCarousel;
