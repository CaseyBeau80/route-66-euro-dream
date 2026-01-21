
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { smoothScrollToSection } from '@/utils/smoothScroll';
import { useNavigate } from 'react-router-dom';

interface BenefitsRowProps {
  language: string;
}

interface Benefit {
  title: string;
  subtitle: string;
  targetId: string;
  isExternalLink?: boolean;
}

const benefitsContent: Record<string, Benefit[]> = {
  en: [
    {
      title: "Interactive Route 66 Google Map",
      subtitle: "Explore attractions, destinations, and hidden gems with interactive filtering",
      targetId: "interactive-map"
    },
    {
      title: "Shareable Travel Planner",
      subtitle: "Build custom Route 66 trips and share them with friends",
      targetId: "trip-planner"
    },
    {
      title: "Social Media & More",
      subtitle: "Instagram integration and community features for travelers",
      targetId: "social"
    },
    {
      title: "Route 66 Events Calendar",
      subtitle: "Discover centennial celebrations, festivals, and car shows across all 8 states",
      targetId: "events-calendar"
    },
    {
      title: "Route 66 Blog & News",
      subtitle: "Centennial updates, local stories, and what's happening along the Mother Road",
      targetId: "/blog",
      isExternalLink: true
    }
  ],
  de: [
    {
      title: "Interaktive Route 66 Google Karte",
      subtitle: "Entdecken Sie Attraktionen, Ziele und versteckte Perlen mit interaktiver Filterung",
      targetId: "interactive-map"
    },
    {
      title: "Teilbarer Reiseplaner",
      subtitle: "Erstellen Sie individuelle Route 66-Reisen und teilen Sie sie mit Freunden",
      targetId: "trip-planner"
    },
    {
      title: "Social Media & Mehr",
      subtitle: "Instagram-Integration und Community-Funktionen für Reisende",
      targetId: "social"
    },
    {
      title: "Route 66 Veranstaltungskalender",
      subtitle: "Entdecken Sie Jubiläumsfeiern, Festivals und Autoshows in allen 8 Bundesstaaten",
      targetId: "events-calendar"
    },
    {
      title: "Route 66 Blog & Nachrichten",
      subtitle: "Jubiläums-Updates, lokale Geschichten und was entlang der Mother Road passiert",
      targetId: "/blog",
      isExternalLink: true
    }
  ],
  fr: [
    {
      title: "Carte Google Interactive Route 66",
      subtitle: "Explorez les attractions, destinations et joyaux cachés avec filtrage interactif",
      targetId: "interactive-map"
    },
    {
      title: "Planificateur de Voyage Partageable",
      subtitle: "Créez des voyages Route 66 personnalisés et partagez-les avec des amis",
      targetId: "trip-planner"
    },
    {
      title: "Médias Sociaux & Plus",
      subtitle: "Intégration Instagram et fonctionnalités communautaires pour voyageurs",
      targetId: "social"
    },
    {
      title: "Calendrier des Événements Route 66",
      subtitle: "Découvrez les célébrations du centenaire, festivals et expositions automobiles dans les 8 états",
      targetId: "events-calendar"
    },
    {
      title: "Blog & Actualités Route 66",
      subtitle: "Mises à jour du centenaire, histoires locales et ce qui se passe le long de la Mother Road",
      targetId: "/blog",
      isExternalLink: true
    }
  ],
  "pt-BR": [
    {
      title: "Mapa Interativo Google da Rota 66",
      subtitle: "Explore atrações, destinos e joias escondidas com filtragem interativa",
      targetId: "interactive-map"
    },
    {
      title: "Planejador de Viagem Compartilhável",
      subtitle: "Crie viagens personalizadas da Rota 66 e compartilhe com amigos",
      targetId: "trip-planner"
    },
    {
      title: "Mídias Sociais & Mais",
      subtitle: "Integração Instagram e recursos comunitários para viajantes",
      targetId: "social"
    },
    {
      title: "Calendário de Eventos da Rota 66",
      subtitle: "Descubra celebrações do centenário, festivais e shows de carros em todos os 8 estados",
      targetId: "events-calendar"
    },
    {
      title: "Blog & Notícias da Rota 66",
      subtitle: "Atualizações do centenário, histórias locais e o que está acontecendo ao longo da Mother Road",
      targetId: "/blog",
      isExternalLink: true
    }
  ]
};

const BenefitsRow: React.FC<BenefitsRowProps> = ({ language }) => {
  const benefits = benefitsContent[language] || benefitsContent.en;
  const navigate = useNavigate();

  const handleClick = (benefit: Benefit) => {
    if (benefit.isExternalLink) {
      navigate(benefit.targetId);
    } else {
      smoothScrollToSection(benefit.targetId);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {benefits.map((benefit, index) => (
          <button 
            key={index}
            onClick={() => handleClick(benefit)}
            className="bg-white/95 backdrop-blur-sm rounded-xl border border-route66-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group text-left cursor-pointer hover:border-route66-primary/40"
          >
            <div className="flex items-start gap-4">
              {/* Blue Checkmark Icon matching theme */}
              <div className="flex-shrink-0 w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center shadow-md group-hover:bg-route66-primary-dark transition-colors duration-300">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-highway font-bold text-lg text-route66-primary mb-2 group-hover:text-route66-primary-dark transition-colors flex items-center gap-2">
                  {benefit.title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-route66-text-secondary leading-relaxed">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BenefitsRow;
