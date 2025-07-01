
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Map, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import PhotoUploadWidget from '../PhotoUploadWidget';
import { useQuery } from '@tanstack/react-query';
import { TrailblazerService } from '@/services/trailblazerService';

type EnhancedHeroSectionProps = {
  language: string;
};

const heroContent = {
  en: {
    title: "Welcome to the Mother Road",
    subtitle: "Experience America's legendary highway from Chicago to Santa Monica",
    cta: "Start Your Journey",
    exploreMap: "Explore Route",
    shareJourney: "Share Your Journey"
  },
  de: {
    title: "Willkommen auf der Mother Road",
    subtitle: "Erleben Sie Amerikas legendäre Straße von Chicago nach Santa Monica",
    cta: "Reise Beginnen",
    exploreMap: "Route Erkunden",
    shareJourney: "Teile deine Reise"
  },
  fr: {
    title: "Bienvenue sur la Mother Road",
    subtitle: "Découvrez la route légendaire d'Amérique de Chicago à Santa Monica",
    cta: "Commencer le Voyage",
    exploreMap: "Explorer la Route",
    shareJourney: "Partagez votre Voyage"
  },
  "pt-BR": {
    title: "Bem-vindos à Mother Road",
    subtitle: "Experimente a lendária estrada da América de Chicago a Santa Monica",
    cta: "Iniciar Sua Jornada",
    exploreMap: "Explorar Rota",
    shareJourney: "Compartilhe sua Jornada"
  }
};

const EnhancedHeroSection = ({ language }: EnhancedHeroSectionProps) => {
  const navigate = useNavigate();
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  const { data: stats } = useQuery({
    queryKey: ['trailblazer-stats'],
    queryFn: TrailblazerService.getTrailblazerStats,
    refetchInterval: 60000 // Refresh every minute
  });

  return (
    <div 
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: "url('https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/website_header_Route66.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center"
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      
      {/* Content */}
      <div className="relative z-20 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white drop-shadow-2xl">
                {content.title}
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/95 leading-relaxed drop-shadow-lg font-medium">
                {content.subtitle}
              </p>
              
              {/* Stats Bar */}
              {stats && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/90">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-bold text-lg">{stats.totalTrailblazers}</span>
                    </div>
                    <p className="text-xs">Trailblazers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Map className="w-4 h-4" />
                      <span className="font-bold text-lg">{stats.totalLocations}</span>
                    </div>
                    <p className="text-xs">Locations</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      <span className="font-bold text-lg">{stats.recentAchievements}</span>
                    </div>
                    <p className="text-xs">Today</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-lg py-6 px-10 transform hover:scale-105 transition-all duration-300 shadow-2xl font-semibold rounded-xl"
                  onClick={() => navigate('/trip-calculator')}
                >
                  {content.cta}
                  <ArrowRight className="ml-3" size={20} />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg py-6 px-10 font-semibold rounded-xl"
                  onClick={() => navigate('/test-upload')}
                >
                  <Camera className="mr-3" size={20} />
                  {content.shareJourney}
                </Button>
              </div>
            </div>
            
            {/* Right Column - Photo Upload Widget */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <PhotoUploadWidget 
                  location="Route 66 Adventure"
                  showMiniLeaderboard={true}
                  className="backdrop-blur-sm bg-white/95"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeroSection;
