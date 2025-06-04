
import { Button } from "@/components/ui/button";
import { ArrowRight, Route, MapPin } from "lucide-react";

type HeroProps = {
  language: string;
  onExploreMap?: () => void;
};

const heroContent = {
  en: {
    title: "Welcome to the Mother Road",
    subtitle: "Experience America's legendary highway from Chicago to Santa Monica",
    cta: "Start Your Journey",
    exploreMap: "Explore Interactive Map",
    established: "Established 1926",
    miles: "2,448 Miles of Adventure"
  },
  de: {
    title: "Willkommen auf der Mother Road",
    subtitle: "Erleben Sie Amerikas legendäre Straße von Chicago nach Santa Monica",
    cta: "Reise Beginnen",
    exploreMap: "Interaktive Karte Erkunden",
    established: "Gegründet 1926",
    miles: "2.448 Meilen Abenteuer"
  },
  fr: {
    title: "Bienvenue sur la Mother Road",
    subtitle: "Découvrez la route légendaire d'Amérique de Chicago à Santa Monica",
    cta: "Commencer le Voyage",
    exploreMap: "Explorer la Carte Interactive",
    established: "Établie en 1926",
    miles: "2 448 Miles d'Aventure"
  },
  nl: {
    title: "Welkom op de Mother Road",
    subtitle: "Beleef Amerika's legendarische weg van Chicago naar Santa Monica",
    cta: "Begin je Reis",
    exploreMap: "Verken Interactieve Kaart",
    established: "Opgericht in 1926",
    miles: "2.448 Mijl Avontuur"
  }
};

const Hero = ({ language, onExploreMap }: HeroProps) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  return (
    <div className="relative bg-gradient-to-br from-route66-vintage-brown via-route66-rust to-route66-vintage-brown">
      {/* Doormat Container */}
      <div className="w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Doormat Frame */}
          <div 
            className="relative p-8 md:p-12 lg:p-16 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
            style={{
              background: `
                linear-gradient(145deg, #F5F5DC 0%, #F0E68C 30%, #F5F5DC 70%, #DDBF94 100%),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 4px,
                  rgba(139, 69, 19, 0.1) 4px,
                  rgba(139, 69, 19, 0.1) 8px
                )
              `,
              border: '8px solid #8B4513',
              boxShadow: `
                inset 0 0 30px rgba(139, 69, 19, 0.2),
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 0 60px rgba(139, 69, 19, 0.2)
              `
            }}
          >
            {/* Decorative Border Pattern */}
            <div className="absolute inset-4 border-4 border-route66-vintage-brown rounded-lg opacity-60"></div>
            <div className="absolute inset-6 border-2 border-route66-rust rounded-lg opacity-40"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Vintage Route 66 Shield */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-route66-vintage-beige rounded-xl border-4 border-black shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-2 border-2 border-black rounded-lg"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <div className="text-black text-sm md:text-lg font-bold font-americana tracking-wider">ROUTE</div>
                      <div className="text-black text-3xl md:text-5xl font-black leading-none font-route66">66</div>
                      <div className="text-black text-xs font-travel">AMERICA'S HIGHWAY</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-route66-yellow opacity-20 blur-lg animate-pulse"></div>
                </div>
              </div>

              {/* Welcome Message */}
              <h1 className="font-route66 text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-route66-red drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                {content.title.toUpperCase()}
              </h1>
              
              {/* Status Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="bg-route66-vintage-yellow text-black px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg">
                  <Route className="inline mr-2" size={16} />
                  {content.established}
                </div>
                <div className="bg-route66-orange text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg">
                  <MapPin className="inline mr-2" size={16} />
                  {content.miles}
                </div>
              </div>
              
              {/* Slogan */}
              <p className="font-vintage text-lg md:text-xl lg:text-2xl mb-8 text-route66-vintage-brown leading-relaxed max-w-4xl mx-auto">
                {content.subtitle}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="vintage-button text-lg py-6 px-12 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {content.cta}
                  <ArrowRight className="ml-3" size={20} />
                </Button>
                {onExploreMap && (
                  <button 
                    onClick={onExploreMap}
                    className="inline-flex items-center gap-2 text-route66-vintage-brown font-semibold hover:text-route66-red transition-colors duration-200"
                  >
                    <span>{content.exploreMap}</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-route66-vintage-brown rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-route66-vintage-brown rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-route66-vintage-brown rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-route66-vintage-brown rounded-br-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
