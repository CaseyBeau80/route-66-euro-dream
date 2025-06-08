
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { TimelineFilters } from '../components/Timeline/TimelineFilters';
import { TimelineDesktop } from '../components/Timeline/TimelineDesktop';
import { TimelineMobile } from '../components/Timeline/TimelineMobile';
import { timelineMilestones, categoryLabels } from '../data/timelineData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
      <div className="pt-20 min-h-screen bg-route66-background-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Button
              variant="outline"
              onClick={handleBackToCelebration}
              className="mb-6 mx-auto flex items-center gap-2 hover:bg-route66-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Centennial Celebration
            </Button>
            
            <h1 className="text-4xl lg:text-5xl font-route66 text-route66-primary mb-4 font-bold">
              Route 66 Historic Timeline
            </h1>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto mb-8">
              Journey through 100 years of America's Mother Road - from its establishment in 1926 to today's centennial celebration
            </p>
            
            {/* Timeline Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {Object.entries(categoryLabels).map(([category, label]) => {
                const count = timelineMilestones.filter(m => m.category === category).length;
                return (
                  <div key={category} className="bg-white rounded-lg p-4 shadow-sm border border-route66-border">
                    <div className="text-2xl font-bold text-route66-primary">{count}</div>
                    <div className="text-xs text-route66-text-muted font-medium">{label}</div>
                  </div>
                );
              })}
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

          {/* Footer Section */}
          <div className="text-center mt-16 pt-8 border-t border-route66-border">
            <p className="text-route66-text-muted mb-4">
              Celebrating 100 years of America's most famous highway
            </p>
            <Button
              onClick={handleBackToCelebration}
              className="bg-route66-primary hover:bg-route66-primary-dark text-white"
            >
              Return to Centennial Celebration
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimelinePage;
