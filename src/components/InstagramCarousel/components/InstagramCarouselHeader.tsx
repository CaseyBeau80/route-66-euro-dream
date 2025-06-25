
import React from 'react';

const InstagramCarouselHeader = () => {
  return (
    <div className="mb-16">
      {/* Hero-style Header Banner with Blue Theme */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg border-2 border-blue-500/20 overflow-hidden">
        <div className="py-12 px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-6 uppercase tracking-wide">
            Route 66 Adventures
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover authentic moments from the Mother Road through the eyes of fellow travelers
          </p>
        </div>
        
        {/* Decorative Bottom Border with Blue Theme */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"></div>
      </div>
      
      {/* Optional Section Divider */}
      <div className="mt-8 flex justify-center">
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default InstagramCarouselHeader;
