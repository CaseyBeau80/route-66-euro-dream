
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import CompactCountdown from "./CompactCountdown";

interface HeroSectionProps {
  language: string;
}
const heroContent = {
  en: {
    title: "Plan Your Route 66 Vacation Without the Headache",
    painPoints: ["Too much time spent spinning your Route 66 wheels?", "Are you bouncing between websites, still unsure where or how to start your Route 66 trip? Planning shouldn't feel like guesswork.", "Wondering where others go to plan their Route 66 trip — city events, attractions, hidden gems, drive-ins, diners, weather, driving times, and destination stops?", "Here. You come right here — and it's all free."],
    ctaButton: "Start Exploring",
    mascotAlt: "Big Bo Ramble - Route 66 Mascot"
  },
  de: {
    title: "Planen Sie Ihren Route 66 Urlaub ohne Kopfschmerzen",
    painPoints: ["Zu viel Zeit damit verbracht, die Route 66 Räder zu drehen?", "Springst du zwischen Websites hin und her, immer noch unsicher, wo oder wie du deine Route 66-Reise beginnen sollst? Planung sollte sich nicht wie Rätselraten anfühlen.", "Fragst du dich, wo andere hingehen, um ihre Route 66-Reise zu planen — Stadtveranstaltungen, Attraktionen, versteckte Perlen, Drive-Ins, Diners, Wetter, Fahrzeiten und Zielstopps?", "Hier. Du kommst genau hierher — und es ist alles kostenlos."],
    ctaButton: "Erkunden Beginnen",
    mascotAlt: "Big Bo Ramble - Route 66 Maskottchen"
  },
  fr: {
    title: "Planifiez Vos Vacances Route 66 sans mal de tête",
    painPoints: ["Trop de temps passé à faire tourner vos roues de Route 66?", "Vous sautez entre les sites web, toujours incertain de où ou comment commencer votre voyage Route 66? La planification ne devrait pas ressembler à de la devinette.", "Vous vous demandez où les autres vont pour planifier leur voyage Route 66 — événements de ville, attractions, joyaux cachés, drive-ins, restaurants, météo, temps de direction et arrêts de destination?", "Ici. Vous venez exactement ici — et c'est tout gratuit."],
    ctaButton: "Commencer l'Exploration",
    mascotAlt: "Big Bo Ramble - Mascotte Route 66"
  },
  "pt-BR": {
    title: "Planeje Suas Férias na Rota 66 sem dor de cabeça",
    painPoints: ["Muito tempo gasto girando as rodas da Rota 66?", "Você está saltando entre sites, ainda incerto sobre onde ou como começar sua viagem na Rota 66? O planejamento não deveria parecer adivinhação.", "Imaginando onde outros vão para planejar sua viagem na Rota 66 — eventos da cidade, atrações, joias escondidas, drive-ins, restaurantes, clima, tempos de direção e paradas de destino?", "Aqui. Você vem exatamente aqui — e é tudo gratuito."],
    ctaButton: "Começar a Explorar",
    mascotAlt: "Big Bo Ramble - Mascote Rota 66"
  }
};
const HeroSection: React.FC<HeroSectionProps> = ({
  language
}) => {
  const content = heroContent[language as keyof typeof heroContent] || heroContent.en;
  const scrollToInteractiveMap = () => {
    const mapSection = document.getElementById('interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <>
      <section className="relative min-h-fit bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Pain Points Content */}
            <div className="space-y-8">
              {/* Title - Bold, uppercase, bright blue */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-route66 font-bold uppercase leading-tight text-route66-primary">
                {content.title}
              </h1>

              {/* Pain Points - Tightly stacked with blue text */}
              <div className="space-y-6">
                {content.painPoints.map((point, index) => <div key={index}>
                    {index < 3 ? <p className="text-lg lg:text-xl leading-relaxed text-route66-primary-light">
                        {point}
                      </p> : <p className="text-2xl lg:text-3xl font-highway font-bold text-route66-accent-red">
                        {point}
                      </p>}
                  </div>)}
              </div>

              {/* Three Benefits - Now positioned before the CTA button */}
              <div className="pt-6">
                <CompactCountdown />
              </div>

              {/* Enhanced CTA Button - Now positioned after the benefits */}
              <div className="pt-6 flex justify-center">
                <Button onClick={scrollToInteractiveMap} size="lg" className="
                    font-bold py-6 px-12 text-xl rounded-xl shadow-lg
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
            </div>

            {/* Right Column - Big Bo Ramble Image */}
            <div className="relative flex flex-col justify-center space-y-8">
              {/* Image Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Decorative Elements */}
                <div className="absolute -inset-8 bg-gradient-to-r from-route66-primary/10 via-route66-accent-red/10 to-route66-orange/10 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Image Container - Now much larger */}
                <div className="relative bg-white rounded-2xl p-4 shadow-2xl border-4 border-route66-primary/20 w-full max-w-none">
                  <img src="/lovable-uploads/625379a4-1f3a-4507-b7ae-394af1f403ae.png" alt={content.mascotAlt} className="w-full h-auto object-contain rounded-xl min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      
    </>;
};
export default HeroSection;
