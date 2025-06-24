
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  language: string;
}

const heroContent = {
  en: {
    badge: "America's Most Historic Highway",
    title: "Discover the Magic of Route 66",
    subtitle: "From Chicago to Santa Monica",
    description: "Experience the ultimate American road trip adventure along the legendary Mother Road. Discover iconic landmarks, hidden gems, and authentic Americana on your journey through the heart of America.",
    primaryCta: "Plan Your Journey",
    secondaryCta: "Watch Video",
    mascotAlt: "Route 66 Adventure Mascot"
  },
  de: {
    badge: "Amerikas Historischste Straße",
    title: "Entdecke die Magie der Route 66",
    subtitle: "Von Chicago nach Santa Monica",
    description: "Erlebe das ultimative amerikanische Roadtrip-Abenteuer entlang der legendären Mother Road. Entdecke ikonische Wahrzeichen, versteckte Perlen und authentisches Americana auf deiner Reise durch das Herz Amerikas.",
    primaryCta: "Reise Planen",
    secondaryCta: "Video Ansehen",
    mascotAlt: "Route 66 Abenteuer-Maskottchen"
  },
  fr: {
    badge: "La Route la Plus Historique d'Amérique",
    title: "Découvrez la Magie de la Route 66",
    subtitle: "De Chicago à Santa Monica",
    description: "Vivez l'ultime aventure de road trip américain le long de la légendaire Mother Road. Découvrez des monuments emblématiques, des joyaux cachés et l'Americana authentique lors de votre voyage à travers le cœur de l'Amérique.",
    primaryCta: "Planifier Votre Voyage",
    secondaryCta: "Regarder la Vidéo",
    mascotAlt: "Mascotte d'Aventure Route 66"
  },
  "pt-BR": {
    badge: "A Rodovia Mais Histórica da América",
    title: "Descubra a Magia da Rota 66",
    subtitle: "De Chicago a Santa Monica",
    description: "Viva a definitiva aventura de viagem americana pela lendária Mother Road. Descubra marcos icônicos, joias escondidas e autêntica Americana em sua jornada pelo coração da América.",
    primaryCta: "Planejar Sua Viagem",
    secondaryCta: "Assistir Vídeo",
    mascotAlt: "Mascote da Aventura Rota 66"
  }
};

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-route66-primary/10 text-route66-primary px-4 py-2 rounded-full text-sm font-semibold border border-route66-primary/20">
              <div className="w-2 h-2 bg-route66-primary rounded-full animate-pulse"></div>
              {content.badge}
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-route66 font-bold text-route66-text-primary leading-tight">
                {content.title}
              </h1>
              <p className="text-2xl lg:text-3xl font-highway text-route66-accent-red font-semibold">
                {content.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-route66-text-secondary leading-relaxed max-w-2xl">
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-4 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {content.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white font-bold py-4 px-8 text-lg rounded-xl transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                {content.secondaryCta}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-route66-border">
              <div className="text-center">
                <div className="text-3xl font-route66 font-bold text-route66-primary">2,448</div>
                <div className="text-sm text-route66-text-muted">Total Miles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-route66 font-bold text-route66-primary">8</div>
                <div className="text-sm text-route66-text-muted">States</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-route66 font-bold text-route66-primary">100+</div>
                <div className="text-sm text-route66-text-muted">Attractions</div>
              </div>
            </div>
          </div>

          {/* Right Column - Mascot */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -inset-8 bg-gradient-to-r from-route66-primary/10 via-route66-accent-red/10 to-route66-orange/10 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Mascot Container */}
              <div className="relative bg-white rounded-full p-8 shadow-2xl border-4 border-route66-primary/20">
                <img 
                  src="/lovable-uploads/0a31764a-ace1-4bcf-973c-cba1bac689fe.png"
                  alt={content.mascotAlt}
                  className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
                />
              </div>

              {/* Floating Route 66 Badges */}
              <div className="absolute -top-4 -right-4 w-16 h-20 bg-route66-primary rounded-lg border-2 border-white shadow-xl flex flex-col items-center justify-center transform rotate-12 animate-bounce">
                <div className="text-white text-xs font-semibold">ROUTE</div>
                <div className="text-white text-xl font-black">66</div>
              </div>
              
              <div className="absolute -bottom-2 -left-6 w-12 h-15 bg-route66-accent-red rounded-lg border-2 border-white shadow-xl flex flex-col items-center justify-center transform -rotate-12 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <div className="text-white text-[10px] font-semibold">HISTORIC</div>
                <div className="text-white text-sm font-black">66</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-route66-text-muted">
          <div className="text-sm font-medium mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-route66-text-muted rounded-full flex justify-center">
            <div className="w-1 h-3 bg-route66-text-muted rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
