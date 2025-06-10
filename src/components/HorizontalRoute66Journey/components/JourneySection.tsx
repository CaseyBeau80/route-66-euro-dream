
import React from 'react';
import { JourneyStop } from '../types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star } from 'lucide-react';

interface JourneySectionProps {
  stop: JourneyStop;
  isActive: boolean;
  isVisible: boolean;
}

const categoryColors = {
  start: 'bg-green-500 text-white',
  major: 'bg-route66-primary text-white',
  scenic: 'bg-blue-500 text-white',
  cultural: 'bg-purple-500 text-white',
  end: 'bg-route66-accent-gold text-black'
};

const categoryIcons = {
  start: '🚗',
  major: '🏙️',
  scenic: '🏔️',
  cultural: '🎭',
  end: '🏁'
};

export const JourneySection: React.FC<JourneySectionProps> = ({ 
  stop, 
  isActive, 
  isVisible 
}) => {
  return (
    <section 
      id={`journey-${stop.id}`}
      className={`relative min-w-full h-screen flex items-center justify-center transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-70'
      }`}
    >
      {/* Background Image/Video */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${stop.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-4xl mx-auto px-8 text-center text-white transition-all duration-1000 ${
        isActive ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-80'
      }`}>
        {/* Category Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Badge className={`${categoryColors[stop.category]} px-4 py-2 text-sm font-semibold`}>
            <span className="mr-2">{categoryIcons[stop.category]}</span>
            {stop.category.charAt(0).toUpperCase() + stop.category.slice(1)} Stop
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">
            Stop {stop.sequence} of 24
          </Badge>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white drop-shadow-lg">
          {stop.city}
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl font-light mb-6 text-route66-accent-gold drop-shadow-md">
          {stop.subtitle}
        </h2>

        {/* Location Info */}
        <div className="flex items-center justify-center gap-4 mb-8 text-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{stop.state}</span>
          </div>
          {stop.yearEstablished && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Est. {stop.yearEstablished}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto drop-shadow-md">
          {stop.description}
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {stop.highlights.map((highlight, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-left"
            >
              <Star className="w-5 h-5 text-route66-accent-gold flex-shrink-0" />
              <span className="text-white">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Journey Indicator */}
        <div className="mt-12 text-sm opacity-75">
          <p>Mile {Math.round((stop.sequence - 1) * (2448 / 23))} • {2448 - Math.round((stop.sequence - 1) * (2448 / 23))} miles to go</p>
        </div>
      </div>

      {/* Scroll Indicator */}
      {stop.sequence < 24 && (
        <div className="absolute bottom-8 right-8 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Continue Journey</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
