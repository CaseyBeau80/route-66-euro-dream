
import { Button } from "@/components/ui/button";
import { ArrowRight, Route, MapPin } from "lucide-react";

type HeroProps = {
  language: string;
};

const heroContent = {
  en: {
    title: "Get Your Kicks on Route 66!",
    subtitle: "Experience America's Mother Road - from Chicago's skyline to Santa Monica's sunset",
    cta: "Start Your Journey",
    established: "Established 1926",
    miles: "2,448 Miles of Adventure"
  },
  de: {
    title: "Erleben Sie die Route 66!",
    subtitle: "Amerikas legendäre Straße - von Chicago bis Santa Monica",
    cta: "Reise Beginnen",
    established: "Gegründet 1926",
    miles: "2.448 Meilen Abenteuer"
  },
  fr: {
    title: "Vivez la Route 66!",
    subtitle: "La route légendaire d'Amérique - de Chicago à Santa Monica",
    cta: "Commencer le Voyage",
    established: "Établie en 1926",
    miles: "2 448 Miles d'Aventure"
  },
  nl: {
    title: "Beleef Route 66!",
    subtitle: "Amerika's legendarische weg - van Chicago naar Santa Monica",
    cta: "Begin je Reis",
    established: "Opgericht in 1926",
    miles: "2.448 Mijl Avontuur"
  }
};

const Hero = ({ language }: HeroProps) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  return (
    <div className="relative h-screen min-h-[700px] flex items-center overflow-hidden pt-16">
      {/* Vintage Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80" 
          alt="Route 66 desert landscape" 
          className="w-full h-full object-cover sepia-[0.2] contrast-110 saturate-110"
        />
        {/* Vintage film overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-route66-red/30 via-transparent to-route66-yellow/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
        
        {/* Vintage texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(210, 4, 26, 0.1) 2px,
            rgba(210, 4, 26, 0.1) 4px
          ), repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 2px,
            rgba(255, 215, 0, 0.1) 2px,
            rgba(255, 215, 0, 0.1) 4px
          )`
        }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Route 66 Shield Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-40 bg-white rounded-xl border-6 border-route66-navy shadow-2xl flex flex-col items-center justify-center route66-shield transform hover:scale-105 transition-transform duration-300">
                <div className="bg-route66-red text-white px-4 py-2 text-sm font-bold rounded-t-lg w-full text-center">ROUTE</div>
                <div className="text-route66-navy text-lg font-bold mt-2">US</div>
                <div className="text-route66-navy text-5xl font-black leading-none">66</div>
                <div className="text-route66-navy text-xs mt-1">AMERICA'S HIGHWAY</div>
              </div>
              {/* Vintage neon glow */}
              <div className="absolute inset-0 rounded-xl bg-route66-yellow opacity-30 blur-xl animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="font-route66 text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-fade-in">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 text-white drop-shadow-[0_4px_8px_rgba(210,4,26,0.8)]">
              {content.title}
            </span>
          </h1>
          
          {/* Vintage badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="highway-sign animate-vintage-flicker">
              <Route className="inline mr-2" size={16} />
              {content.established}
            </div>
            <div className="highway-sign animate-vintage-flicker" style={{ animationDelay: "0.5s" }}>
              <MapPin className="inline mr-2" size={16} />
              {content.miles}
            </div>
          </div>
          
          <p className="font-vintage text-xl md:text-2xl mb-10 text-route66-cream drop-shadow-lg animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
            {content.subtitle}
          </p>
          
          <Button 
            size="lg" 
            className="vintage-button text-lg py-6 px-12 animate-fade-in transform hover:scale-105 transition-all duration-300 shadow-neon"
            style={{ animationDelay: "0.4s" }}
          >
            {content.cta}
            <ArrowRight className="ml-3" size={20} />
          </Button>
        </div>
      </div>
      
      {/* Vintage decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Road stripes */}
        <div className="h-3 bg-gradient-to-r from-route66-yellow via-white to-route66-yellow opacity-80"></div>
        <div className="h-2 bg-route66-navy"></div>
      </div>
      
      {/* Floating vintage elements */}
      <div className="absolute top-20 left-10 z-10 animate-slow-pulse">
        <div className="bg-route66-red text-white px-3 py-1 rounded-full text-sm font-bold highway-sign transform rotate-12">
          HISTORIC
        </div>
      </div>
      <div className="absolute top-40 right-10 z-10 animate-slow-pulse" style={{ animationDelay: "1s" }}>
        <div className="bg-route66-yellow text-route66-navy px-3 py-1 rounded-full text-sm font-bold highway-sign transform -rotate-12">
          ADVENTURE
        </div>
      </div>
    </div>
  );
};

export default Hero;
