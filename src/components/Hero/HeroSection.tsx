
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, Check } from "lucide-react";
import cakeImage from "@/assets/route66-100th-cake-transparent.png";
import { useTimer } from "@/components/CentennialCardsSection/hooks/useTimer";


interface HeroSectionProps {
  language: string;
}
const heroContent = {
  en: {
    title: "Plan <span class='underline'>Your</span> Route 66 Vacation 👇",
    painPoints: ["Too much time spent spinning your Route 66 wheels?", "Are you bouncing between websites, still unsure where or how to start your Route 66 trip? Planning shouldn't feel like guesswork.", "Wondering where others go to plan their Route 66 trip — city events, attractions, hidden gems, drive-ins, diners, weather, driving times, and destination stops?", "Here. You come right here (and it's all free)."],
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
  const { timeLeft, mounted } = useTimer();
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
            <div className="space-y-6">
              {/* Title - Bold, uppercase, bright blue */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-route66 font-bold uppercase leading-tight text-route66-primary">
                Route 66 Starts Here — Plan Your Journey Now
              </h1>

              {/* Pain Points - Tightly stacked with blue text */}
              <div className="space-y-4">
                {content.painPoints.map((point, index) => <div key={index}>
                    {index < 3 ? <p className="text-lg lg:text-xl leading-relaxed text-route66-primary-light">
                        {point}
                      </p> : <div className="py-2">
                        <p className="text-2xl lg:text-3xl font-highway font-bold text-pink-600">
                          {point}
                        </p>
                      </div>}
                  </div>)}
              </div>

              {/* Benefits Section - Vertical with Green Checkmarks - Larger font, less padding */}
              <div className="space-y-0 py-2">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-xl lg:text-2xl">Interactive Route 66 Google Map</div>
                    <div className="text-route66-text-secondary text-lg">Explore iconic cities, quirky roadside attractions, and hidden gems</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-xl lg:text-2xl">Shareable Travel Planner</div>
                    <div className="text-route66-text-secondary text-lg">Build custom Route 66 trips and share them with friends and family</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600 font-bold flex-shrink-0" strokeWidth={3} />
                  <div>
                    <div className="text-route66-primary font-semibold text-xl lg:text-2xl">Social Media & More</div>
                    <div className="text-route66-text-secondary text-lg">Instagram integration and community features for travelers</div>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Button - Compact spacing */}
              <div className="flex justify-center">
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
                <div className="relative bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section rounded-2xl p-4 shadow-2xl border-4 border-route66-primary/20 w-full max-w-none">
                  <img src="/lovable-uploads/625379a4-1f3a-4507-b7ae-394af1f403ae.png" alt={content.mascotAlt} className="w-full h-auto object-contain rounded-xl min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Birthday Cake Countdown - Centered under CTA */}
          <div className="pt-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-pink-300/10 via-pink-400/10 to-pink-500/10 rounded-2xl blur-3xl animate-pulse"></div>
              <div className="relative flex flex-col items-center text-center gap-4 p-6">
                <img 
                  src={cakeImage} 
                  alt="Route 66 100th Anniversary Celebration Cake" 
                  className="w-20 h-20 lg:w-24 lg:h-24 object-contain rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-600 leading-none">
                      {mounted ? timeLeft.days : '---'}
                    </div>
                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-600 leading-none">
                      Days
                    </div>
                  </div>
                  <div className="text-sm lg:text-base text-route66-primary mt-1">
                    Until the centennial birthday celebration of the Mother Road on November 11, 2026
                  </div>
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
