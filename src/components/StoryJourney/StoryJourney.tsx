
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Sparkles, Map as MapIcon } from 'lucide-react';
import { timelineMilestones } from '@/data/timelineData';
import { ImmersiveStorySection } from './components/ImmersiveStorySection';
import { ImmersiveProgressTracker } from './components/ImmersiveProgressTracker';
import { MobileSwipeNavigation } from './components/MobileSwipeNavigation';
import { AnimatedRouteLine } from './components/AnimatedRouteLine';
import { StoryMap } from './components/StoryMap';
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hasStartedJourney, setHasStartedJourney] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('route66-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('route66-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const handleStartJourney = () => {
    setShowIntro(false);
    setHasStartedJourney(true);
    setCurrentSectionIndex(0);
  };

  const handleSectionChange = (index: number) => {
    setCurrentSectionIndex(index);
    const section = document.getElementById(timelineMilestones[index]?.id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFavorite = (milestoneId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(milestoneId)) {
      newFavorites.delete(milestoneId);
    } else {
      newFavorites.add(milestoneId);
    }
    setFavorites(newFavorites);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showIntro) return;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          if (currentSectionIndex > 0) {
            handleSectionChange(currentSectionIndex - 1);
          }
          event.preventDefault();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          if (currentSectionIndex < timelineMilestones.length - 1) {
            handleSectionChange(currentSectionIndex + 1);
          }
          event.preventDefault();
          break;
        case 'm':
        case 'M':
          setIsMapVisible(!isMapVisible);
          event.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, timelineMilestones.length, isMapVisible, showIntro]);

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-section to-route66-background-alt flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-route66-primary rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-route66-accent-gold rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, delay: 1, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-16 h-16 bg-route66-accent-red rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, delay: 2, repeat: Infinity }}
          />
        </div>

        <motion.div 
          className="text-center z-10 max-w-4xl px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MapPin className="w-16 h-16 text-route66-primary mx-auto mb-4" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-route66 text-route66-primary mb-6 font-bold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Route 66 Journey
              <motion.div
                className="inline-block ml-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 text-route66-accent-gold" />
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-route66-text-secondary mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Experience 100 Years of America's Mother Road
            </motion.p>
            
            <motion.p 
              className="text-lg text-route66-text-muted max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Journey through time and space along the most iconic highway in America. 
              Discover the stories, places, and moments that shaped the Mother Road.
            </motion.p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-route66-border/20">
              <Calendar className="w-10 h-10 text-route66-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-route66-text-primary mb-2">Historic Timeline</h3>
              <p className="text-route66-text-muted">From 1926 to today's centennial</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-route66-border/20">
              <MapIcon className="w-10 h-10 text-route66-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-route66-text-primary mb-2">Interactive Experience</h3>
              <p className="text-route66-text-muted">Immersive storytelling with maps</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-route66-border/20">
              <Sparkles className="w-10 h-10 text-route66-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-route66-text-primary mb-2">Rich Stories</h3>
              <p className="text-route66-text-muted">Audio narration and favorites</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <Button
              onClick={handleStartJourney}
              size="lg"
              className="bg-route66-primary hover:bg-route66-primary-dark text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Begin Your Journey
              <ChevronDown className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-b from-route66-background to-route66-background-alt">
      {/* Progress Tracker - Desktop */}
      <ImmersiveProgressTracker
        milestones={timelineMilestones}
        currentIndex={currentSectionIndex}
        onNavigate={handleSectionChange}
      />

      {/* Animated Route Line - Desktop */}
      <AnimatedRouteLine
        milestones={timelineMilestones}
        currentIndex={currentSectionIndex}
      />

      {/* Mobile Navigation */}
      <MobileSwipeNavigation
        currentIndex={currentSectionIndex}
        totalSections={timelineMilestones.length}
        onNavigate={handleSectionChange}
        currentYear={timelineMilestones[currentSectionIndex]?.year || 1926}
        currentCategory={timelineMilestones[currentSectionIndex]?.category || 'establishment'}
      />

      {/* Map overlay */}
      {isMapVisible && (
        <div className="fixed inset-0 z-40 bg-black/50">
          <StoryMap
            currentMilestone={timelineMilestones[currentSectionIndex]}
            onClose={() => setIsMapVisible(false)}
          />
        </div>
      )}

      {/* Map toggle button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={() => setIsMapVisible(!isMapVisible)}
          variant={isMapVisible ? "default" : "outline"}
          className={`${
            isMapVisible 
              ? "bg-route66-primary hover:bg-route66-primary-dark text-white" 
              : "bg-white/90 backdrop-blur-sm border-route66-border hover:bg-white"
          } shadow-lg`}
        >
          <MapIcon className="w-4 h-4 mr-2" />
          {isMapVisible ? 'Hide Map' : 'Show Map'}
        </Button>
      </div>

      {/* Story sections */}
      <div className="relative z-30">
        {timelineMilestones.map((milestone, index) => (
          <ImmersiveStorySection
            key={milestone.id}
            milestone={milestone}
            index={index}
            isActive={currentSectionIndex === index}
            onBecomeActive={() => setCurrentSectionIndex(index)}
            onFavorite={handleFavorite}
            isFavorited={favorites.has(milestone.id)}
          />
        ))}

        {/* Journey completion */}
        <motion.div 
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-route66-primary/20 to-route66-accent-gold/20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-route66-accent-gold/20 rounded-full"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-48 h-48 bg-route66-primary/20 rounded-full"
              animate={{ scale: [1, 1.1, 1], rotate: [360, 180, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="text-center max-w-4xl px-8 z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-20 h-20 text-route66-accent-gold mx-auto mb-8" />
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-route66 text-route66-primary mb-6 font-bold"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Your Journey Complete
            </motion.h2>
            
            <motion.p 
              className="text-xl text-route66-text-secondary mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              You've traveled through 100 years of Route 66 history. The Mother Road continues to inspire new generations of travelers.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                size="lg"
                className="bg-route66-primary hover:bg-route66-primary-dark text-white px-8 py-3 rounded-full"
              >
                Start Over
              </Button>
              
              {favorites.size > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const favoritesList = Array.from(favorites).join(', ');
                    navigator.clipboard.writeText(`My favorite Route 66 moments: ${favoritesList}`);
                  }}
                  className="border-route66-border hover:bg-route66-primary/10 px-8 py-3 rounded-full"
                >
                  Share My Favorites ({favorites.size})
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoryJourney;
