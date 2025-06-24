
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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="bg-white/95 backdrop-blur-sm rounded-xl border border-route66-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              {/* Blue Checkmark Icon matching theme */}
              <div className="flex-shrink-0 w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center shadow-md group-hover:bg-route66-primary-dark transition-colors duration-300">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-highway font-bold text-lg text-route66-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-route66-text-secondary leading-relaxed">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsRow;
