
import React from 'react';

const InstagramCarouselHeader = () => {
  return (
    <div className="mb-16">
      {/* Hero-style Header Banner */}
      <div className="bg-gradient-to-r from-route66-background-alt to-white rounded-2xl shadow-lg border border-route66-border/20 overflow-hidden">
        <div className="py-12 px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-route66 font-bold text-route66-primary mb-6 uppercase tracking-wide">
            Route 66 Adventures
          </h2>
          <p className="text-xl md:text-2xl text-route66-text-secondary max-w-4xl mx-auto leading-relaxed font-medium">
            Discover authentic moments from the Mother Road through the eyes of fellow travelers
          </p>
        </div>
        
        {/* Decorative Bottom Border */}
        <div className="h-2 bg-gradient-to-r from-route66-primary via-route66-accent-red to-route66-orange"></div>
      </div>
      
      {/* Optional Section Divider */}
      <div className="mt-8 flex justify-center">
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-route66-text-muted to-transparent rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default InstagramCarouselHeader;
