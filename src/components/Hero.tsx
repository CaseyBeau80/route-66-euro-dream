
import { Button } from "@/components/ui/button";
import { ArrowRight, Route, MapPin, ChevronDown, ChevronUp } from "lucide-react";

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
    hideMap: "Hide Map",
    established: "Established 1926",
    miles: "2,448 Miles of Adventure"
  },
  de: {
    title: "Willkommen auf der Mother Road",
    subtitle: "Erleben Sie Amerikas legendäre Straße von Chicago nach Santa Monica",
    cta: "Reise Beginnen",
    exploreMap: "Interaktive Karte Erkunden",
    hideMap: "Karte Verstecken",
    established: "Gegründet 1926",
    miles: "2.448 Meilen Abenteuer"
  },
  fr: {
    title: "Bienvenue sur la Mother Road",
    subtitle: "Découvrez la route légendaire d'Amérique de Chicago à Santa Monica",
    cta: "Commencer le Voyage",
    exploreMap: "Explorer la Carte Interactive",
    hideMap: "Masquer la Carte",
    established: "Établie en 1926",
    miles: "2 448 Miles d'Aventure"
  },
  nl: {
    title: "Welkom op de Mother Road",
    subtitle: "Beleef Amerika's legendarische weg van Chicago naar Santa Monica",
    cta: "Begin je Reis",
    exploreMap: "Verken Interactieve Kaart",
    hideMap: "Verberg Kaart",
    established: "Opgericht in 1926",
    miles: "2.448 Mijl Avontuur"
  }
};

const Hero = ({ language, onExploreMap, isMapOpen = false }: HeroProps) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  return (
    <div className="relative bg-gradient-to-br from-route66-primary via-route66-primary-dark to-route66-secondary-dark">
      {/* Hero Container with modern design */}
      <div className="w-full px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Modern Hero Card */}
          <div 
            className="relative p-8 md:p-12 lg:p-16 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 bg-route66-background border border-route66-border"
          >
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Modern Route 66 Shield */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-route66-background rounded-xl border-2 border-route66-primary shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-2 border border-route66-border rounded-lg"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="text-route66-text-muted text-sm md:text-lg font-semibold tracking-wider">ROUTE</div>
                      <div className="text-route66-primary text-3xl md:text-5xl font-black leading-none">66</div>
                      <div className="text-route66-text-muted text-xs font-medium">AMERICA'S HIGHWAY</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-route66-primary/20 opacity-20 blur-lg animate-pulse"></div>
                </div>
              </div>

              {/* Modern Welcome Message */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-route66-text-primary">
                {content.title}
              </h1>
              
              {/* Modern Status Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="bg-route66-accent-yellow text-route66-text-primary px-6 py-2 font-semibold text-sm rounded-full border border-route66-border shadow-md">
                  <Route className="inline mr-2" size={16} />
                  {content.established}
                </div>
                <div className="bg-route66-primary text-white px-6 py-2 font-semibold text-sm rounded-full shadow-md">
                  <MapPin className="inline mr-2" size={16} />
                  {content.miles}
                </div>
              </div>
              
              {/* Modern Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-route66-text-secondary leading-relaxed max-w-4xl mx-auto">
                {content.subtitle}
              </p>
              
              {/* Modern CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-lg py-6 px-12 transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold rounded-lg"
                >
                  {content.cta}
                  <ArrowRight className="ml-3" size={20} />
                </Button>
                {onExploreMap && (
                  <button 
                    onClick={onExploreMap}
                    className="inline-flex items-center gap-2 text-route66-text-secondary font-semibold hover:text-route66-primary transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-route66-hover"
                  >
                    <span>{isMapOpen ? content.hideMap : content.exploreMap}</span>
                    {isMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
            </div>
            
            {/* Modern Corner Decorations */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-route66-border rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-route66-border rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-route66-border rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-route66-border rounded-br-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
