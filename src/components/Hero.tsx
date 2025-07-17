
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp, Map } from "lucide-react";
import ScrollIndicator from "./ScrollIndicator";

type HeroProps = {
  language: string;
  onExploreMap?: () => void;
  isMapOpen?: boolean;
};

const heroContent = {
  en: {
    title: "Welcome to the Mother Road",
    subtitle: "Experience America's legendary highway from Chicago to Santa Monica",
    cta: "Start Your Journey",
    exploreMap: "Explore Interactive Map",
    hideMap: "Hide Map"
  },
  de: {
    title: "Willkommen auf der Mother Road",
    subtitle: "Erleben Sie Amerikas legendäre Straße von Chicago nach Santa Monica",
    cta: "Reise Beginnen",
    exploreMap: "Interaktive Karte Erkunden",
    hideMap: "Karte Verstecken"
  },
  fr: {
    title: "Bienvenue sur la Mother Road",
    subtitle: "Découvrez la route légendaire d'Amérique de Chicago à Santa Monica",
    cta: "Commencer le Voyage",
    exploreMap: "Explorer la Carte Interactive",
    hideMap: "Masquer la Carte"
  },
  nl: {
    title: "Welkom op de Mother Road",
    subtitle: "Beleef Amerika's legendarische weg van Chicago naar Santa Monica",
    cta: "Begin je Reis",
    exploreMap: "Verken Interactieve Kaart",
    hideMap: "Verberg Kaart"
  }
};

const Hero = ({ language, onExploreMap, isMapOpen = false }: HeroProps) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  return (
    <>
      <div 
        className="relative w-full h-[70vh] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/website_header_Route66.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center"
        }}
      >
        {/* Light dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        
        {/* Fun overlapping yellow caption */}
        <div className="absolute top-8 right-8 z-30 transform rotate-12">
          <div className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-yellow-500 text-lg">
            Plan your Route 66 trip. Big Bo says so.
          </div>
        </div>
        
        {/* Content overlay - positioned further down above the Route 66 shield */}
        <div className="relative z-20 flex flex-col items-center justify-start pt-56 h-full text-center px-4 max-w-6xl mx-auto">
          {/* Enhanced typography with better contrast */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-2xl max-w-5xl mx-auto">
            {content.title}
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/95 leading-relaxed max-w-4xl mx-auto drop-shadow-lg font-medium">
            {content.subtitle}
          </p>
          
          {/* Modern call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-lg py-6 px-10 transform hover:scale-105 transition-all duration-300 shadow-2xl font-semibold rounded-xl"
            >
              {content.cta}
              <ArrowRight className="ml-3" size={20} />
            </Button>
            {onExploreMap && (
              <button 
                onClick={onExploreMap}
                className="inline-flex items-center gap-3 text-white/95 font-semibold hover:text-white transition-colors duration-200 px-8 py-4 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 text-lg"
              >
                <Map size={20} />
                <span>{isMapOpen ? content.hideMap : content.exploreMap}</span>
                {isMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator - now pointing to centennial section */}
      <ScrollIndicator targetId="centennial" />
    </>
  );
};

export default Hero;
