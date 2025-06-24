
import React from 'react';
import { Check } from 'lucide-react';

interface BenefitsRowProps {
  language: string;
}

const benefitsContent = {
  en: [
    {
      title: "Interactive Route 66 Google Map",
      subtitle: "Explore attractions, destinations, and hidden gems with interactive filtering"
    },
    {
      title: "Shareable Travel Planner",
      subtitle: "Build custom Route 66 trips and share them with friends"
    },
    {
      title: "Social Media & More",
      subtitle: "Instagram integration and community features for travelers"
    }
  ],
  de: [
    {
      title: "Interaktive Route 66 Google Karte",
      subtitle: "Entdecken Sie Attraktionen, Ziele und versteckte Perlen mit interaktiver Filterung"
    },
    {
      title: "Teilbarer Reiseplaner",
      subtitle: "Erstellen Sie individuelle Route 66-Reisen und teilen Sie sie mit Freunden"
    },
    {
      title: "Social Media & Mehr",
      subtitle: "Instagram-Integration und Community-Funktionen für Reisende"
    }
  ],
  fr: [
    {
      title: "Carte Google Interactive Route 66",
      subtitle: "Explorez les attractions, destinations et joyaux cachés avec filtrage interactif"
    },
    {
      title: "Planificateur de Voyage Partageable",
      subtitle: "Créez des voyages Route 66 personnalisés et partagez-les avec des amis"
    },
    {
      title: "Médias Sociaux & Plus",
      subtitle: "Intégration Instagram et fonctionnalités communautaires pour voyageurs"
    }
  ],
  "pt-BR": [
    {
      title: "Mapa Interativo Google da Rota 66",
      subtitle: "Explore atrações, destinos e joias escondidas com filtragem interativa"
    },
    {
      title: "Planejador de Viagem Compartilhável",
      subtitle: "Crie viagens personalizadas da Rota 66 e compartilhe com amigos"
    },
    {
      title: "Mídias Sociais & Mais",
      subtitle: "Integração Instagram e recursos comunitários para viajantes"
    }
  ]
};

const BenefitsRow: React.FC<BenefitsRowProps> = ({ language }) => {
  const benefits = benefitsContent[language as keyof typeof benefitsContent] || benefitsContent.en;

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-t border-route66-border/20 -mt-8">
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 text-center md:text-left group"
            >
              {/* Larger Green Checkmark Icon */}
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-600 transition-colors duration-300">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-highway font-bold text-lg text-route66-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-route66-text-secondary leading-relaxed">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsRow;
