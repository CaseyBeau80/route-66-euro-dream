
import React from 'react';

const InstagramCarouselHeader = () => {
  return (
    <div className="mb-12">
      {/* Header with blue color scheme */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-route66-primary overflow-hidden">
        <div className="py-8 px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-route66-primary mb-4 uppercase tracking-wide">
            ROUTE 66 ADVENTURES
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover authentic moments from the Mother Road through the eyes of fellow travelers
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstagramCarouselHeader;
