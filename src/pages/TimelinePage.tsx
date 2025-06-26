
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { TimelineFilters } from '../components/Timeline/TimelineFilters';
import { TimelineDesktop } from '../components/Timeline/TimelineDesktop';
import { TimelineMobile } from '../components/Timeline/TimelineMobile';
import { StoryJourney } from '../components/StoryJourney';
import { timelineMilestones, categoryLabels } from '../data/timelineData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Sparkles, Play, List } from 'lucide-react';

type ViewMode = 'timeline' | 'journey';

const TimelinePage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const navigate = useNavigate();

  // Filter milestones based on selected category
  const filteredMilestones = selectedCategory 
    ? timelineMilestones.filter(milestone => milestone.category === selectedCategory)
    : timelineMilestones;

  const handleBackToCelebration = () => {
    navigate('/#centennial');
  };

  if (viewMode === 'journey') {
    return (
      <MainLayout language={language} setLanguage={setLanguage}>
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={() => setViewMode('timeline')}
            className="bg-white/90 backdrop-blur-sm border-route66-border hover:bg-white shadow-lg"
          >
            <List className="w-4 h-4 mr-2" />
            Traditional Timeline
          </Button>
        </div>
        <StoryJourney />
      </MainLayout>
    );
  }

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-route66-background via-route66-background-section to-route66-background-alt">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section with View Toggle */}
          <div className="text-center mb-12">
            <Button
              variant="outline"
              onClick={handleBackToCelebration}
              className="mb-8 mx-auto flex items-center gap-2 hover:bg-route66-hover border-route66-primary text-route66-primary hover:text-route66-primary-dark transition-all duration-300 hover:scale-105"
              aria-label="Return to Centennial Celebration"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Centennial Celebration
            </Button>
            
            <div className="relative mb-8">
              <h1 className="text-4xl lg:text-6xl font-route66 text-route66-primary mb-4 font-bold animate-nostalgic-glow">
                Route 66 Historic Timeline
                <Sparkles className="inline-block ml-4 w-8 h-8 lg:w-12 lg:h-12 text-route66-accent-gold animate-birthday-sparkle" />
              </h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-route66-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
              Journey through 100 years of America's Mother Road - from its establishment in 1926 to today's centennial celebration
            </p>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                onClick={() => setViewMode('timeline')}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Traditional Timeline
              </Button>
              <Button
                variant={viewMode === 'journey' ? 'default' : 'outline'}
                onClick={() => setViewMode('journey')}
                className="flex items-center gap-2 bg-gradient-to-r from-route66-primary to-route66-accent-gold hover:from-route66-primary-dark hover:to-route66-accent-gold/90 text-white border-0"
              >
                <Play className="w-4 h-4" />
                Immersive Journey
                <Sparkles className="w-4 h-4 animate-pulse" />
              </Button>
            </div>
            
            {/* Enhanced Timeline Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto mb-8">
              {Object.entries(categoryLabels).map(([category, label]) => {
                const count = timelineMilestones.filter(m => m.category === category).length;
                const icons = {
                  establishment: MapPin,
                  cultural: Sparkles,
                  decline: Clock,
                  revival: Calendar
                };
                const IconComponent = icons[category as keyof typeof icons];
                
                return (
                  <div key={category} className="bg-white rounded-xl p-4 lg:p-6 shadow-nostalgic border border-route66-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-route66-primary" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-route66-primary mb-1">{count}</div>
                    <div className="text-xs lg:text-sm text-route66-text-muted font-medium leading-tight">{label}</div>
                  </div>
                );
              })}
            </div>
            
            {/* Total milestones highlight */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-route66-primary/10 border border-route66-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-route66-primary" />
              <span className="text-sm font-semibold text-route66-primary">
                {filteredMilestones.length} of {timelineMilestones.length} milestones
              </span>
            </div>
          </div>

          {/* Category Filters */}
          <TimelineFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Timeline Display - Desktop */}
          <div className="hidden md:block">
            <TimelineDesktop milestones={filteredMilestones} />
          </div>

          {/* Timeline Display - Mobile */}
          <div className="md:hidden">
            <TimelineMobile milestones={filteredMilestones} />
          </div>

          {/* Enhanced Footer Section */}
          <div className="text-center mt-20 pt-12 border-t-2 border-route66-border bg-gradient-to-r from-transparent via-route66-primary/5 to-transparent rounded-lg">
            <div className="max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-route66-accent-gold mx-auto mb-4 animate-birthday-sparkle" />
              <h3 className="text-2xl font-bold text-route66-primary mb-4">
                Celebrating a Century of Adventure
              </h3>
              <p className="text-route66-text-muted mb-6 leading-relaxed">
                From dusty trails to digital highways, Route 66 continues to inspire wanderers and dreamers across the globe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setViewMode('journey')}
                  className="bg-gradient-to-r from-route66-primary to-route66-accent-gold hover:from-route66-primary-dark hover:to-route66-accent-gold/90 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 shadow-nostalgic"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Experience the Journey
                </Button>
                <Button
                  onClick={handleBackToCelebration}
                  variant="outline"
                  className="border-route66-primary text-route66-primary hover:bg-route66-primary/10 px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Return to Celebration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimelinePage;
