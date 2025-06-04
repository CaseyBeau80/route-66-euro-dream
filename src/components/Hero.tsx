
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
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Simplified Route 66 Shield */}
        <div className="mb-8">
          <div className="w-20 h-26 bg-white rounded-lg border-2 border-route66-primary shadow-2xl flex flex-col items-center justify-center">
            <div className="text-route66-text-muted text-xs font-semibold tracking-wider">ROUTE</div>
            <div className="text-route66-primary text-2xl font-black leading-none">66</div>
            <div className="text-route66-text-muted text-[8px] font-medium">MOTHER ROAD</div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-2xl">
          {content.title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
          {content.subtitle}
        </p>
        
        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-lg py-6 px-12 transform hover:scale-105 transition-all duration-300 shadow-2xl font-semibold rounded-lg"
          >
            {content.cta}
            <ArrowRight className="ml-3" size={20} />
          </Button>
          {onExploreMap && (
            <button 
              onClick={onExploreMap}
              className="inline-flex items-center gap-2 text-white/90 font-semibold hover:text-white transition-colors duration-200 px-6 py-3 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <span>{isMapOpen ? content.hideMap : content.exploreMap}</span>
              {isMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
