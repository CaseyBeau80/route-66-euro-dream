
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
    <div className="relative bg-gradient-to-br from-route66-asphalt via-route66-charcoal to-route66-dark">
      {/* Hero Container with new color scheme */}
      <div className="w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Frame with cream/vintage styling */}
          <div 
            className="relative p-8 md:p-12 lg:p-16 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
            style={{
              background: `
                linear-gradient(145deg, #faf8f3 0%, #f7f5f0 30%, #faf8f3 70%, #fefcf8 100%),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 4px,
                  rgba(45, 45, 45, 0.1) 4px,
                  rgba(45, 45, 45, 0.1) 8px
                )
              `,
              border: '8px solid #2d2d2d',
              boxShadow: `
                inset 0 0 30px rgba(45, 45, 45, 0.2),
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 0 60px rgba(45, 45, 45, 0.2)
              `
            }}
          >
            {/* Decorative Border Pattern */}
            <div className="absolute inset-4 border-4 border-route66-asphalt rounded-lg opacity-60"></div>
            <div className="absolute inset-6 border-2 border-route66-charcoal rounded-lg opacity-40"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Vintage Route 66 Shield with new colors */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-route66-cream rounded-xl border-4 border-route66-dark shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-2 border-2 border-route66-dark rounded-lg"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="text-route66-dark text-sm md:text-lg font-bold font-americana tracking-wider">ROUTE</div>
                      <div className="text-route66-dark text-3xl md:text-5xl font-black leading-none font-route66">66</div>
                      <div className="text-route66-dark text-xs font-travel">AMERICA'S HIGHWAY</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-route66-sunshine-yellow opacity-20 blur-lg animate-pulse"></div>
                </div>
              </div>

              {/* Welcome Message with neon red */}
              <h1 className="font-route66 text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-route66-neon-red drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                {content.title.toUpperCase()}
              </h1>
              
              {/* Status Badges with new color scheme */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="bg-route66-sunshine-yellow text-route66-dark px-6 py-2 font-bold text-sm rounded-full border-2 border-route66-dark shadow-lg">
                  <Route className="inline mr-2" size={16} />
                  {content.established}
                </div>
                <div className="bg-route66-sky-blue text-route66-cream px-6 py-2 font-bold text-sm rounded-full border-2 border-route66-dark shadow-lg">
                  <MapPin className="inline mr-2" size={16} />
                  {content.miles}
                </div>
              </div>
              
              {/* Slogan with charcoal text */}
              <p className="font-vintage text-lg md:text-xl lg:text-2xl mb-8 text-route66-charcoal leading-relaxed max-w-4xl mx-auto">
                {content.subtitle}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-route66-neon-red hover:bg-route66-neon-red/90 text-route66-cream border-2 border-route66-dark text-lg py-6 px-12 transform hover:scale-105 transition-all duration-300 shadow-lg font-bold"
                >
                  {content.cta}
                  <ArrowRight className="ml-3" size={20} />
                </Button>
                {onExploreMap && (
                  <button 
                    onClick={onExploreMap}
                    className="inline-flex items-center gap-2 text-route66-charcoal font-semibold hover:text-route66-neon-red transition-colors duration-200"
                  >
                    <span>{isMapOpen ? content.hideMap : content.exploreMap}</span>
                    {isMapOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
            </div>
            
            {/* Corner Decorations with new colors */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-route66-asphalt rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-route66-asphalt rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-route66-asphalt rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-route66-asphalt rounded-br-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
