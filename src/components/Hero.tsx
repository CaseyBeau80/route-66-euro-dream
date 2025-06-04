
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

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
    <div 
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/ef90c3a0-71fe-4f68-8671-5a455d6e9bc1.png')"
      }}
    >
      {/* Modern overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Modern Route 66 Shield */}
        <div className="mb-8">
          <div className="w-24 h-32 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300">
            <div className="text-route66-text-muted text-sm font-bold tracking-wider">ROUTE</div>
            <div className="text-route66-primary text-3xl font-black leading-none">66</div>
            <div className="text-route66-text-muted text-xs font-semibold tracking-wide">MOTHER ROAD</div>
          </div>
        </div>

        {/* Modern heading with improved typography */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-2xl max-w-6xl mx-auto">
          {content.title}
        </h1>
        
        {/* Refined subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white/95 leading-relaxed max-w-4xl mx-auto drop-shadow-lg font-medium">
          {content.subtitle}
        </p>
        
        {/* Modern call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-lg py-6 px-12 transform hover:scale-105 transition-all duration-300 shadow-2xl font-semibold rounded-xl backdrop-blur-sm"
          >
            {content.cta}
            <ArrowRight className="ml-3" size={20} />
          </Button>
          {onExploreMap && (
            <button 
              onClick={onExploreMap}
              className="inline-flex items-center gap-3 text-white/95 font-semibold hover:text-white transition-colors duration-200 px-8 py-4 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              <span className="text-lg">{isMapOpen ? content.hideMap : content.exploreMap}</span>
              {isMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
