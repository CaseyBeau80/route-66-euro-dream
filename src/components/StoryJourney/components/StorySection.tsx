
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, Clock, ArrowRight, Image, ExternalLink } from 'lucide-react';
import type { TimelineMilestone } from '@/data/timelineData';
import { categoryColors } from '@/data/timelineData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StorySectionProps {
  milestone: TimelineMilestone;
  index: number;
  isActive: boolean;
  isVisible: boolean;
  onBecomeActive: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({
  milestone,
  index,
  isActive,
  isVisible,
  onBecomeActive
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          onBecomeActive();
          if (!hasAnimated) {
            setHasAnimated(true);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [onBecomeActive, hasAnimated]);

  if (!isVisible) {
    return <div id={`story-section-${index}`} className="h-screen" />;
  }

  const backgroundClass = categoryColors[milestone.category] || 'bg-gray-50';

  return (
    <div 
      id={`story-section-${index}`}
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center px-4 py-20 transition-all duration-1000 ${
        isActive ? 'opacity-100' : 'opacity-70'
      }`}
      style={{
        background: `linear-gradient(135deg, 
          ${milestone.category === 'establishment' ? 'rgba(34, 197, 94, 0.1)' : 
            milestone.category === 'cultural' ? 'rgba(147, 51, 234, 0.1)' : 
            milestone.category === 'decline' ? 'rgba(249, 115, 22, 0.1)' : 
            'rgba(59, 130, 246, 0.1)'
          } 0%, 
          rgba(255, 255, 255, 0.05) 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content side */}
        <div className={`space-y-8 transform transition-all duration-1000 ${
          hasAnimated ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          {/* Year badge */}
          <div className="flex items-center gap-4">
            <div className="text-6xl md:text-8xl font-bold text-route66-primary/20">
              {milestone.year}
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-route66-text-muted uppercase tracking-wider">
                {milestone.category.replace('_', ' ')}
              </div>
              <div className="flex items-center gap-2 text-route66-text-secondary">
                <Calendar className="w-4 h-4" />
                <span>{milestone.year}</span>
              </div>
            </div>
          </div>

          {/* Title and description */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-route66-text-primary leading-tight">
              {milestone.title}
            </h2>
            <p className="text-xl text-route66-text-secondary leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Details */}
          {milestone.details && milestone.details.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-route66-border/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-route66-text-primary mb-4 flex items-center gap-2">
                  <div className="text-2xl">{milestone.icon}</div>
                  Key Details
                </h3>
                <ul className="space-y-3">
                  {milestone.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-route66-primary mt-1 flex-shrink-0" />
                      <span className="text-route66-text-secondary">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Navigation hint */}
          <div className="text-center lg:text-left">
            <p className="text-route66-text-muted text-sm">
              Scroll to continue the journey
            </p>
          </div>
        </div>

        {/* Visual side with authentic photos */}
        <div className={`transform transition-all duration-1000 delay-300 ${
          hasAnimated ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}>
          <div className="relative">
            {milestone.imageUrl ? (
              <div className="space-y-6">
                {/* Historical Photo */}
                <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-route66-border/20 overflow-hidden">
                  <div className="relative">
                    <img
                      src={milestone.imageUrl}
                      alt={milestone.title}
                      className={`w-full h-80 object-cover transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        // Fallback to icon display if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-8xl opacity-30">{milestone.icon}</div>
                      </div>
                    )}
                    
                    {/* Photo overlay badge */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      <span>{milestone.year}</span>
                    </div>
                  </div>
                  
                  {/* Photo caption and attribution */}
                  {milestone.imageCaption && (
                    <CardContent className="p-6">
                      <p className="text-sm text-route66-text-secondary leading-relaxed mb-3">
                        {milestone.imageCaption}
                      </p>
                      {milestone.imageSource && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-route66-text-muted">
                            Source: {milestone.imageSource}
                          </p>
                          <ExternalLink className="w-3 h-3 text-route66-text-muted" />
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Floating icon element */}
                <div className="relative">
                  <div className="absolute -top-12 -right-8 w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-route66-border/20 flex items-center justify-center">
                    <div className="text-4xl">{milestone.icon}</div>
                  </div>
                </div>
              </div>
            ) : (
              // Fallback to original icon display if no image available
              <div className="relative">
                <div className="text-[20rem] text-route66-primary/10 text-center leading-none">
                  {milestone.icon}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-route66-border/20 max-w-sm">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{milestone.icon}</div>
                      <div className="text-lg font-semibold text-route66-text-primary">
                        {milestone.year}
                      </div>
                      <div className="text-sm text-route66-text-muted uppercase tracking-wider">
                        {milestone.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-route66-accent-gold/30 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-route66-accent-red/30 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
