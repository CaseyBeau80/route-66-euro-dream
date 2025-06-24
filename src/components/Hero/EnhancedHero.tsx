
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import ScrollIndicator from "../ScrollIndicator";

type EnhancedHeroProps = {
  language: string;
};

const heroContent = {
  en: {
    title: "Welcome to the Mother Road",
    subtitle: "Experience America's legendary highway from Chicago to Santa Monica",
    description: "Discover 100 years of Route 66 heritage with our comprehensive travel guide, interactive maps, and personalized trip planning tools.",
    ctaPrimary: "Plan Your Journey",
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
    features: [
      "🗺️ Carte Interactive Route 66",
      "📅 Planification de Voyage Personnalisée",
      "📸 Défis Photo & Fonctionnalités Sociales",
      "🏛️ Répertoire des Villes Patrimoniales"
    ]
  }
};

const EnhancedHero = ({ language }: EnhancedHeroProps) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  
  const scrollToTripPlanner = () => {
    const element = document.getElementById('trip-planner');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      <div className="relative w-full min-h-screen bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-route66-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                <Calendar className="w-4 h-4" />
                CENTENNIAL CELEBRATION 2026
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-route66-primary font-route66">
                  {content.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-route66-text-secondary leading-relaxed font-semibold">
                  {content.subtitle}
                </p>

                <p className="text-lg text-route66-text-secondary leading-relaxed">
                  {content.description}
                </p>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-route66-background-section border border-route66-border rounded-lg p-3 text-route66-text-secondary text-sm font-medium"
                  >
                    {feature}
                  </div>
                ))}
              </div>
              
              {/* Call to action button */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Button 
                  onClick={scrollToTripPlanner}
                  size="lg" 
                  className="bg-route66-primary hover:bg-route66-primary-dark text-white border-0 text-xl py-7 px-12 transform hover:scale-105 transition-all duration-300 shadow-lg font-bold rounded-xl"
                >
                  <MapPin className="mr-3" size={24} />
                  {content.ctaPrimary}
                  <ArrowRight className="ml-3" size={24} />
                </Button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-route66-primary mb-1">2,448</div>
                  <div className="text-sm text-route66-text-secondary">Miles of Adventure</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-route66-primary mb-1">100</div>
                  <div className="text-sm text-route66-text-secondary">Years of History</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-route66-primary mb-1">8</div>
                  <div className="text-sm text-route66-text-secondary">States to Explore</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:block">
              <div className="relative">
                <img 
                  src="https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/website_header_Route66.png"
                  alt="Route 66 Heritage"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-route66-accent-red rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-route66-primary rounded-full opacity-40"></div>
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-route66-accent-gold rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <ScrollIndicator targetId="map" />
    </>
  );
};

export default EnhancedHero;
