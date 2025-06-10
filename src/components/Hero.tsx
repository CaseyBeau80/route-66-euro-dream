
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { ArrowRight, MapPin, Route } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  language: "en" | "de" | "fr" | "pt-BR";
  onExploreMap: () => void;
  isMapOpen: boolean;
}

const Hero = ({ language, onExploreMap, isMapOpen }: HeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=2000&q=80'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const content = {
    en: {
      title: "Journey Along America's Mother Road",
      subtitle: "Experience the legend of Route 66 from Chicago to Santa Monica",
      description: "Discover iconic stops, hidden gems, and the spirit of adventure that has captivated travelers for generations.",
      exploreButton: "Explore Interactive Map",
      journeyButton: "Start Journey Experience",
      planButton: "Plan Your Trip"
    },
    de: {
      title: "Reise entlang Amerikas Hauptstraße",
      subtitle: "Erleben Sie die Legende der Route 66 von Chicago bis Santa Monica",
      description: "Entdecken Sie ikonische Stopps, versteckte Schätze und den Abenteuergeist, der Reisende seit Generationen fasziniert.",
      exploreButton: "Interaktive Karte erkunden",
      journeyButton: "Reiseerlebnis starten",
      planButton: "Ihre Reise planen"
    },
    fr: {
      title: "Voyage le long de la route mère de l'Amérique",
      subtitle: "Découvrez la légende de la Route 66 de Chicago à Santa Monica",
      description: "Découvrez des arrêts emblématiques, des joyaux cachés et l'esprit d'aventure qui fascine les voyageurs depuis des générations.",
      exploreButton: "Explorer la carte interactive",
      journeyButton: "Commencer l'expérience de voyage",
      planButton: "Planifiez votre voyage"
    },
    "pt-BR": {
      title: "Jornada pela Estrada Mãe da América",
      subtitle: "Experimente a lenda da Rota 66 de Chicago a Santa Monica",
      description: "Descubra paradas icônicas, joias escondidas e o espírito de aventura que cativa viajantes há gerações.",
      exploreButton: "Explorar Mapa Interativo",
      journeyButton: "Iniciar Experiência da Jornada",
      planButton: "Planeje Sua Viagem"
    }
  };

  const currentContent = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {currentContent.title}
        </h1>
        
        <h2 className="text-xl md:text-2xl font-light mb-8 text-route66-accent-gold">
          {currentContent.subtitle}
        </h2>
        
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          {currentContent.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onExploreMap}
            size="lg"
            className="bg-route66-primary hover:bg-route66-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {currentContent.exploreButton}
          </Button>

          <Link to="/horizontal-journey">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-route66-primary px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <Route className="mr-2 h-5 w-5" />
              {currentContent.journeyButton}
            </Button>
          </Link>

          <Link to="/trip-calculator">
            <Button
              size="lg"
              variant="outline"
              className="border-route66-accent-gold text-route66-accent-gold hover:bg-route66-accent-gold hover:text-black px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              {currentContent.planButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
