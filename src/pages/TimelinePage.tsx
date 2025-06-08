
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { TimelineFilters } from '../components/Timeline/TimelineFilters';
import { TimelineDesktop } from '../components/Timeline/TimelineDesktop';
import { TimelineMobile } from '../components/Timeline/TimelineMobile';
import { timelineMilestones, categoryLabels } from '../data/timelineData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

const TimelinePage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter milestones based on selected category
  const filteredMilestones = selectedCategory 
    ? timelineMilestones.filter(milestone => milestone.category === selectedCategory)
    : timelineMilestones;

  const handleBackToCelebration = () => {
    navigate('/#centennial');
  };

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-route66-background via-route66-background-section to-route66-background-alt">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
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
            
            <div className="relative">
              <h1 className="text-4xl lg:text-6xl font-route66 text-route66-primary mb-4 font-bold animate-nostalgic-glow">
                Route 66 Historic Timeline
                <Sparkles className="inline-block ml-4 w-8 h-8 lg:w-12 lg:h-12 text-route66-accent-gold animate-birthday-sparkle" />
              </h1>
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4">
                <div className="w-4 h-4 lg:w-6 lg:h-6 bg-route66-accent-gold rounded-full animate-birthday-pulse opacity-75"></div>
              </div>
            </div>
            
            <p className="text-xl lg:text-2xl text-route66-text-secondary max-w-4xl mx-auto mb-8 leading-relaxed">
              Journey through 100 years of America's Mother Road - from its establishment in 1926 to today's centennial celebration
            </p>
            
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
              <Button
                onClick={handleBackToCelebration}
                className="bg-route66-primary hover:bg-route66-primary-dark text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 shadow-nostalgic"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Return to Centennial Celebration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimelinePage;
