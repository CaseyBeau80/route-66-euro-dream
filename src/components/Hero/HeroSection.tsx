
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, Check } from "lucide-react";
import cakeImage from "@/assets/cake-single-shield-v2.png";
import cakeImageWebP from "@/assets/cake-single-shield-v2.png"; // Using same file for now
import { useTimer } from "@/components/CentennialCardsSection/hooks/useTimer";
import { PictureOptimized } from "@/components/ui/PictureOptimized";
import { smoothScrollToSection } from "@/utils/smoothScroll";
import { forceIdleLoaderRender } from "@/components/performance/IdleLoader";
import { forceDeferredRender } from "@/components/performance/DeferredComponent";
import { forceTimeSlicedRender } from "@/components/performance/TimeSlicedComponent";
import { navigateToSection } from "@/utils/sectionNavigator";

// Multilingual content - English displayed by default, ready for future language switching
const heroContent = {
  en: {
    brandName: "RAMBLE 66",
    headline: "100 Years of Hidden Gems, Classic Diners & Must-See Stops",
    subtitle: "Along the Mother Road",
    painPoints: [
      "Too much time spent spinning your Route 66 wheels?",
      "Are you bouncing between websites, still unsure where or how to start your Route 66 trip?",
      "Wondering where others go to plan their Route 66 trip — city events, attractions, hidden gems, drive-ins, diners, weather, driving times, and destination stops?",
      "Here. You come right here (and it's all free)."
    ],
    ctaButton: "Start Exploring",
    mascotAlt: "Big Bo Ramble - Route 66 Mascot"
  },
  de: {
    brandName: "RAMBLE 66",
    headline: "100 Jahre Versteckte Perlen, Klassische Diners & Sehenswertes",
    subtitle: "Entlang der Mother Road",
    painPoints: [
      "Zu viel Zeit damit verbracht, die Route 66 Räder zu drehen?",
      "Springst du zwischen Websites hin und her, immer noch unsicher, wo oder wie du deine Route 66-Reise beginnen sollst?",
      "Fragst du dich, wo andere hingehen, um ihre Route 66-Reise zu planen — Stadtveranstaltungen, Attraktionen, versteckte Perlen, Drive-Ins, Diners, Wetter, Fahrzeiten und Zielstopps?",
      "Hier. Du kommst genau hierher — und es ist alles kostenlos."
    ],
    ctaButton: "Erkunden Beginnen",
    mascotAlt: "Big Bo Ramble - Route 66 Maskottchen"
  },
  fr: {
    brandName: "RAMBLE 66",
    headline: "100 Ans de Joyaux Cachés, Diners Classiques & Incontournables",
    subtitle: "Le Long de la Mother Road",
    painPoints: [
      "Trop de temps passé à faire tourner vos roues de Route 66?",
      "Vous sautez entre les sites web, toujours incertain de où ou comment commencer votre voyage Route 66?",
      "Vous vous demandez où les autres vont pour planifier leur voyage Route 66 — événements de ville, attractions, joyaux cachés, drive-ins, restaurants, météo?",
      "Ici. Vous venez exactement ici — et c'est tout gratuit."
    ],
    ctaButton: "Commencer l'Exploration",
    mascotAlt: "Big Bo Ramble - Mascotte Route 66"
  },
  es: {
    brandName: "RAMBLE 66",
    headline: "100 Años de Joyas Ocultas, Diners Clásicos & Paradas Imperdibles",
    subtitle: "A Lo Largo de la Mother Road",
    painPoints: [
      "¿Demasiado tiempo perdido girando las ruedas en la Ruta 66?",
      "¿Saltando entre sitios web, aún sin saber dónde o cómo empezar tu viaje por la Ruta 66?",
      "¿Te preguntas dónde otros planifican su viaje por la Ruta 66 — eventos, atracciones, joyas ocultas, drive-ins, diners, clima y paradas?",
      "Aquí. Vienes exactamente aquí — y todo es gratis."
    ],
    ctaButton: "Empezar a Explorar",
    mascotAlt: "Big Bo Ramble - Mascota Ruta 66"
  },
  "pt-BR": {
    brandName: "RAMBLE 66",
    headline: "100 Anos de Joias Escondidas, Diners Clássicos & Paradas Imperdíveis",
    subtitle: "Ao Longo da Mother Road",
    painPoints: [
      "Muito tempo gasto girando as rodas da Rota 66?",
      "Você está saltando entre sites, ainda incerto sobre onde ou como começar sua viagem na Rota 66?",
      "Imaginando onde outros vão para planejar sua viagem na Rota 66 — eventos da cidade, atrações, joias escondidas, drive-ins, restaurantes, clima?",
      "Aqui. Você vem exatamente aqui — e é tudo gratuito."
    ],
    ctaButton: "Começar a Explorar",
    mascotAlt: "Big Bo Ramble - Mascote Rota 66"
  }
};
const HeroSection: React.FC = () => {
  const content = heroContent.en; // Always use English
  const { timeLeft, mounted } = useTimer();
  
  // Smart contextual text based on whether celebrations have started
  const celebrationsStartDate = new Date('2026-01-03');
  const now = new Date();
  const celebrationsStarted = now >= celebrationsStartDate;
  
  const scrollToInteractiveMap = () => {
    const mapSection = document.getElementById('interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  const forceRenderAllSections = () => {
    forceIdleLoaderRender();
    forceDeferredRender();
    forceTimeSlicedRender();
  };

  const scrollToEventsCalendar = () => {
    forceRenderAllSections();
    navigateToSection('events-calendar');
  };
  
  const scrollToTripPlanner = () => {
    smoothScrollToSection('trip-planner');
  };
  
  const scrollToSocial = () => {
    forceRenderAllSections();
    navigateToSection('social');
  };
  return <>
      <section className="relative min-h-fit bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-16 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Pain Points Content */}
            <div className="space-y-4">
              {/* Clean Header Structure */}
              <div className="text-center lg:text-left mb-4">
                {/* Brand Name */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-route66 font-bold uppercase tracking-wider text-route66-primary mb-3">
                  {content.brandName}
                </h1>
                
                {/* Main Headline */}
                <p className="text-xl lg:text-2xl xl:text-3xl font-highway font-bold text-pink-600">
                  {content.headline}
                </p>
                
                {/* Subtitle */}
                <p className="text-base lg:text-lg text-route66-text-secondary italic mt-1">
                  {content.subtitle}
                </p>
              </div>

              {/* Pain Points - Tightly stacked with blue text */}
              <div className="space-y-3">
                {content.painPoints.map((point, index) => (
                   <div key={index}>
                     {index < 3 ? (
                       <p className="text-base lg:text-lg leading-relaxed text-route66-primary-light lcp-target" 
                          style={{ contentVisibility: 'auto', containIntrinsicSize: '380px 78px' }}>
                         {point}
                       </p>
                     ) : (
                      <div className="py-1">
                        <p className="text-xl lg:text-2xl font-highway font-bold text-pink-600">
                          {point}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Benefits Section - Vertical with Green Checkmarks - Clickable */}
              <div className="space-y-1 py-1">
                <button 
                  onClick={scrollToInteractiveMap}
                  className="flex items-center gap-2 text-left hover:bg-route66-primary/5 rounded-lg p-2 -ml-2 transition-colors group cursor-pointer w-full"
                >
                  <Check className="w-5 h-5 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-lg lg:text-xl group-hover:text-route66-primary-dark group-hover:underline transition-colors">
                      Interactive Route 66 Google Map
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <div className="text-route66-text-secondary text-sm lg:text-base">Explore iconic cities, quirky roadside attractions, and hidden gems</div>
                  </div>
                </button>
                <button 
                  onClick={scrollToTripPlanner}
                  className="flex items-center gap-2 text-left hover:bg-route66-primary/5 rounded-lg p-2 -ml-2 transition-colors group cursor-pointer w-full"
                >
                  <Check className="w-5 h-5 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-lg lg:text-xl group-hover:text-route66-primary-dark group-hover:underline transition-colors">
                      Shareable Travel Planner
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <div className="text-route66-text-secondary text-sm lg:text-base">Build custom Route 66 trips and share them with friends and family</div>
                  </div>
                </button>
                <button 
                  onClick={scrollToSocial}
                  className="flex items-center gap-2 text-left hover:bg-route66-primary/5 rounded-lg p-2 -ml-2 transition-colors group cursor-pointer w-full"
                >
                  <Check className="w-5 h-5 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-lg lg:text-xl group-hover:text-route66-primary-dark group-hover:underline transition-colors">
                      Social Media & More
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <div className="text-route66-text-secondary text-sm lg:text-base">Instagram integration and community features for travelers</div>
                  </div>
                </button>
                <button 
                  onClick={scrollToEventsCalendar}
                  className="flex items-center gap-2 text-left hover:bg-route66-primary/5 rounded-lg p-2 -ml-2 transition-colors group cursor-pointer w-full"
                >
                  <Check className="w-5 h-5 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-lg lg:text-xl group-hover:text-route66-primary-dark group-hover:underline transition-colors">
                      Route 66 Events Calendar
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <div className="text-route66-text-secondary text-sm lg:text-base">Discover centennial celebrations, festivals, and car shows across all 8 states</div>
                  </div>
                </button>
              </div>

              {/* Enhanced CTA Button - Compact spacing */}
              <div className="flex justify-center pt-2">
                <Button onClick={scrollToInteractiveMap} size="lg" className="
                    font-bold py-4 px-10 text-lg rounded-xl shadow-lg
                    hover:shadow-2xl transform hover:scale-105 transition-all duration-300
                    animate-pulse-slow
                    group relative overflow-hidden
                  " style={{
                backgroundColor: '#004FCC',
                color: 'white'
              }} onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#003A99';
                e.currentTarget.style.transform = 'scale(1.05)';
              }} onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#004FCC';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                  {content.ctaButton}
                  <ArrowDown className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:animate-bounce" />
                </Button>
              </div>

              {/* Birthday Cake Countdown - Simple clean layout */}
              <div className="pt-6 flex flex-col items-center text-center gap-3">
                <PictureOptimized 
                  src={cakeImage}
                  webpSrc={cakeImageWebP}
                  alt="Route 66 100th Anniversary Celebration Cake" 
                  className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-cover rounded-2xl shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))',
                    borderRadius: '1.5rem'
                  }}
                  width={192}
                  height={192}
                  sizes="(max-width: 1024px) 128px, (max-width: 1280px) 160px, 192px"
                />
                <div className="flex flex-col items-center">
                  <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-600 leading-none mb-1">
                    {mounted ? timeLeft.days : '---'} Days
                  </div>
                  <div className="text-sm lg:text-base text-route66-primary text-center max-w-sm">
                    Until the 100th birthday of the Mother Road on November 11, 2026
                  </div>
                  <div className="text-xs lg:text-sm text-center mt-2 flex items-center justify-center gap-2 bg-yellow-300 text-blue-700 font-semibold px-4 py-1.5 rounded-full shadow-sm">
                    <span className="inline-block w-2 h-2 bg-[#1B60A3] rounded-full animate-pulse"></span>
                    <span>
                      {celebrationsStarted 
                        ? 'Celebrations now underway!' 
                        : 'Celebrations begin January 2026'}
                    </span>
                    <button 
                      onClick={scrollToEventsCalendar}
                      className="text-blue-800 hover:text-blue-900 hover:underline font-bold transition-colors"
                    >
                      → View Events
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Big Bo Ramble Image */}
            <div className="relative flex flex-col justify-center space-y-8">
              {/* Image Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Decorative Elements */}
                <div className="absolute -inset-8 bg-gradient-to-r from-route66-primary/10 via-route66-accent-red/10 to-route66-orange/10 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Ultra-optimized LCP hero image */}
                <img 
                  src="/lovable-uploads/8f23e082-56b6-4339-abeb-dc34f7a2c0c2.png"
                  alt={content.mascotAlt}
                  className="w-full h-auto object-contain rounded-3xl shadow-2xl lcp-hero-image"
                  width={588}
                  height={803}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  sizes="(max-width: 640px) 400px, (max-width: 1024px) 500px, 588px"
                  style={{ 
                    aspectRatio: '588/803',
                    contentVisibility: 'auto',
                    containIntrinsicSize: '588px 803px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      
    </>;
};
export default HeroSection;
