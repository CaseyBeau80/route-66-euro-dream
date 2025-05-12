
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type HeroProps = {
  language: string;
};

const heroContent = {
  en: {
    title: "Plan Your Dream Route 66 Road Trip",
    subtitle: "Curated stops, local tips, and European-friendly advice from Chicago to Santa Monica.",
    cta: "Start Planning"
  },
  de: {
    title: "Planen Sie Ihre Traumreise auf der Route 66",
    subtitle: "Ausgewählte Stopps, lokale Tipps und europafreundliche Ratschläge von Chicago bis Santa Monica.",
    cta: "Jetzt Planen"
  },
  fr: {
    title: "Planifiez votre Route 66 de rêve",
    subtitle: "Arrêts sélectionnés, conseils locaux et recommandations adaptées aux Européens de Chicago à Santa Monica.",
    cta: "Commencer"
  },
  nl: {
    title: "Plan uw droomreis op Route 66",
    subtitle: "Geselecteerde stops, lokale tips en Europees-vriendelijk advies van Chicago tot Santa Monica.",
    cta: "Begin met plannen"
  }
};

const Hero = ({ language }: HeroProps) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  return (
    <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80" 
          alt="Route 66 landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-route66-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white relative">
        <div className="max-w-2xl">
          <h1 className="font-route66 text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 animate-fade-in">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {content.subtitle}
          </p>
          <Button 
            size="lg" 
            className="bg-route66-red hover:bg-route66-red/90 text-white font-medium py-6 px-8 rounded-md animate-fade-in flex items-center"
            style={{ animationDelay: "0.4s" }}
          >
            {content.cta}
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </div>
      
      {/* Route 66 Shield Logo */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 opacity-90">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-slow-pulse">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-route66-red rounded-full flex items-center justify-center">
            <span className="font-route66 text-white text-xl md:text-2xl font-bold">66</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
