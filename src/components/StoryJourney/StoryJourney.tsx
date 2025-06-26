
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { timelineMilestones } from '@/data/timelineData';
import { StorySection } from './components/StorySection';
import { StoryMap } from './components/StoryMap';
import { StoryProgress } from './components/StoryProgress';
import { StoryNavigation } from './components/StoryNavigation';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import { Button } from '@/components/ui/button';

const StoryJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentSectionIndex,
    setCurrentSectionIndex,
    isMapVisible,
    setIsMapVisible,
    progress
  } = useStoryNavigation(timelineMilestones.length);

  const [showIntro, setShowIntro] = useState(true);

  const handleStartJourney = () => {
    setShowIntro(false);
    setCurrentSectionIndex(0);
  };

  const handleSectionChange = (index: number) => {
    setCurrentSectionIndex(index);
    // Smooth scroll to section
    const section = document.getElementById(`story-section-${index}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-section to-route66-background-alt flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-route66-primary rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-route66-accent-gold rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-route66-accent-red rounded-full animate-pulse delay-2000"></div>
        </div>

        <div className="text-center z-10 max-w-4xl px-8">
          <div className="mb-8">
            <MapPin className="w-16 h-16 text-route66-primary mx-auto mb-4 animate-bounce" />
            <h1 className="text-5xl md:text-7xl font-route66 text-route66-primary mb-6 font-bold">
              Route 66 Journey
              <Sparkles className="inline-block ml-4 w-12 h-12 text-route66-accent-gold animate-spin" />
            </h1>
            <p className="text-2xl md:text-3xl text-route66-text-secondary mb-8 leading-relaxed">
              Experience 100 Years of America's Mother Road
            </p>
            <p className="text-lg text-route66-text-muted max-w-2xl mx-auto mb-12">
              Journey through time and space along the most iconic highway in America. 
              Discover the stories, places, and moments that shaped the Mother Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-route66-border/20">
              <Calendar className="w-10 h-10 text-route66-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-route66-text-primary mb-2">Historic Timeline</h3>
              <p className="text-route66-text-muted">From 1926 to today's centennial</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-route66-border/20">
              <MapPin className="w-10 h-10 text-route66-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-route66-text-primary mb-2">Interactive Maps</h3>
              <p className="text-route66-text-muted">Explore key locations and landmarks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-route66-border/20">
              <Sparkles className="w-10 h-10 text-route66-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-route66-text-primary mb-2">Rich Stories</h3>
              <p className="text-route66-text-muted">Immersive storytelling experience</p>
            </div>
          </div>

          <Button
            onClick={handleStartJourney}
            size="lg"
            className="bg-route66-primary hover:bg-route66-primary-dark text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Begin Your Journey
            <ChevronDown className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-route66-background">
      {/* Fixed navigation and progress */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-route66-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-route66 text-route66-primary font-bold">Route 66 Journey</h2>
            <StoryNavigation
              currentSection={currentSectionIndex}
              totalSections={timelineMilestones.length}
              onSectionChange={handleSectionChange}
              isMapVisible={isMapVisible}
              onToggleMap={() => setIsMapVisible(!isMapVisible)}
            />
          </div>
          <StoryProgress progress={progress} />
        </div>
      </div>

      {/* Main content area */}
      <div className="pt-32 relative">
        {/* Map overlay */}
        {isMapVisible && (
          <div className="fixed inset-0 z-40 pt-32">
            <StoryMap
              currentMilestone={timelineMilestones[currentSectionIndex]}
              onClose={() => setIsMapVisible(false)}
            />
          </div>
        )}

        {/* Story sections */}
        <div className="relative z-30">
          {timelineMilestones.map((milestone, index) => (
            <StorySection
              key={milestone.id}
              milestone={milestone}
              index={index}
              isActive={currentSectionIndex === index}
              isVisible={Math.abs(currentSectionIndex - index) <= 1}
              onBecomeActive={() => setCurrentSectionIndex(index)}
            />
          ))}
        </div>

        {/* Journey completion */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-route66-primary/20 to-route66-accent-gold/20">
          <div className="text-center max-w-4xl px-8">
            <Sparkles className="w-20 h-20 text-route66-accent-gold mx-auto mb-8 animate-spin" />
            <h2 className="text-4xl md:text-6xl font-route66 text-route66-primary mb-6 font-bold">
              Your Journey Complete
            </h2>
            <p className="text-xl text-route66-text-secondary mb-8">
              You've traveled through 100 years of Route 66 history. The Mother Road continues to inspire new generations of travelers.
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              size="lg"
              className="bg-route66-primary hover:bg-route66-primary-dark text-white px-8 py-3 rounded-full"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryJourney;
