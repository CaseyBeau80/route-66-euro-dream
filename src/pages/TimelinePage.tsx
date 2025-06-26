
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { StoryJourney } from '../components/StoryJourney';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TimelinePage = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const navigate = useNavigate();

  const handleBackToCelebration = () => {
    navigate('/#centennial');
  };

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          onClick={handleBackToCelebration}
          className="bg-white/90 backdrop-blur-sm border-route66-border hover:bg-white shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Celebration
        </Button>
      </div>
      <StoryJourney />
    </MainLayout>
  );
};

export default TimelinePage;
