
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp, Map, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import ScrollIndicator from "../ScrollIndicator";

type EnhancedHeroProps = {
  language: string;
  onExploreMap?: () => void;
  isMapOpen?: boolean;
  onPlanTrip?: () => void;
};

const heroContent = {
  en: {
    title: "Welcome to the Mother Road",
    subtitle: "Experience America's legendary highway from Chicago to Santa Monica",
    description: "Discover 100 years of Route 66 heritage with our comprehensive travel guide, interactive maps, and personalized trip planning tools.",
    ctaPrimary: "Plan Your Journey",
    ctaSecondary: "Explore Interactive Map",
    hideMap: "Hide Map",
    features: [
      "🗺️ Interactive Route 66 Map",
      "📅 Custom Trip Planning",
      "📸 Photo Challenges & Social Features",
      "🏛️ Heritage Cities Directory"
    ]
  },
  de: {
    title: "Willkommen auf der Mother Road",
    subtitle: "Erleben Sie Amerikas legendäre Straße von Chicago nach Santa Monica",
    description: "Entdecken Sie 100 Jahre Route 66 Geschichte mit unserem umfassenden Reiseführer, interaktiven Karten und personalisierten Reiseplanungstools.",
    ctaPrimary: "Reise Planen",
    ctaSecondary: "Interaktive Karte Erkunden",
    hideMap: "Karte Verstecken",
    features: [
      "🗺️ Interaktive Route 66 Karte",
      "📅 Individuelle Reiseplanung",
      "📸 Foto-Herausforderungen & Social Features",
      "🏛️ Heritage Cities Verzeichnis"
    ]
  },
  fr: {
    title: "Bienvenue sur la Mother Road",
    subtitle: "Découvrez la route légendaire d'Amérique de Chicago à Santa Monica",
    description: "Découvrez 100 ans d'histoire de la Route 66 avec notre guide de voyage complet, nos cartes interactives et nos outils de planification de voyage personnalisés.",
    ctaPrimary: "Planifier le Voyage",
    ctaSecondary: "Explorer la Carte Interactive",
    hideMap: "Masquer la Carte",
    features: [
      "🗺️ Carte Interactive Route 66",
      "📅 Planification de Voyage Personnalisée",
      "📸 Défis Photo & Fonctionnalités Sociales",
      "🏛️ Répertoire des Villes Patrimoniales"
    ]
  }
};

const EnhancedHero = ({ language, onExploreMap, isMapOpen = false, onPlanTrip }: EnhancedHeroProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  return (
    <>
      <div 
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/website_header_Route66.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center"
        }}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-route66-accent-red/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-60 left-1/4 w-2 h-2 bg-route66-primary/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-route66-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-2xl border border-white/20">
            <Calendar className="w-4 h-4" />
            CENTENNIAL CELEBRATION 2026
          </div>

          {/* Enhanced typography */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white drop-shadow-2xl max-w-6xl mx-auto font-route66">
            {content.title}
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/95 leading-relaxed max-w-5xl mx-auto drop-shadow-lg font-semibold">
            {content.subtitle}
          </p>

          <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
            {content.description}
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white text-sm font-medium"
              >
                {feature}
              </div>
            ))}
          </div>
          
          {/* Enhanced call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              onClick={onPlanTrip}
              size="lg" 
              className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-xl py-7 px-12 transform hover:scale-105 transition-all duration-300 shadow-2xl font-bold rounded-xl"
            >
              <MapPin className="mr-3" size={24} />
              {content.ctaPrimary}
              <ArrowRight className="ml-3" size={24} />
            </Button>
            
            {onExploreMap && (
              <button 
                onClick={onExploreMap}
                className="inline-flex items-center gap-3 text-white/95 font-bold hover:text-white transition-colors duration-200 px-10 py-7 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 text-xl"
              >
                <Map size={24} />
                <span>{isMapOpen ? content.hideMap : content.ctaSecondary}</span>
                {isMapOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-white">
            <div className="text-center">
              <div className="text-3xl font-black text-route66-accent-gold mb-1">2,448</div>
              <div className="text-sm opacity-90">Miles of Adventure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-route66-accent-gold mb-1">100</div>
              <div className="text-sm opacity-90">Years of History</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-route66-accent-gold mb-1">8</div>
              <div className="text-sm opacity-90">States to Explore</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <ScrollIndicator targetId="centennial" />
    </>
  );
};

export default EnhancedHero;
