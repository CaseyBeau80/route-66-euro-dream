
import React from 'react';
import { Check } from 'lucide-react';

interface BenefitsRowProps {
  language: string;
}

const benefitsContent = {
  en: [
    {
      title: "Real Route 66 Experience",
      subtitle: "Authentic stops along the Mother Road"
    },
    {
      title: "Perfect Trip Planning",
      subtitle: "Daily itineraries that actually work"
    },
    {
      title: "Hidden Gems Revealed",
      subtitle: "Discover what guidebooks miss"
    }
  ],
  de: [
    {
      title: "Echte Route 66 Erfahrung",
      subtitle: "Authentische Stopps entlang der Mother Road"
    },
    {
      title: "Perfekte Reiseplanung",
      subtitle: "Tägliche Reisepläne die wirklich funktionieren"
    },
    {
      title: "Versteckte Perlen Enthüllt",
      subtitle: "Entdecken Sie was Reiseführer verpassen"
    }
  ],
  fr: [
    {
      title: "Vraie Expérience Route 66",
      subtitle: "Arrêts authentiques le long de la Mother Road"
    },
    {
      title: "Planification de Voyage Parfaite",
      subtitle: "Itinéraires quotidiens qui fonctionnent vraiment"
    },
    {
      title: "Joyaux Cachés Révélés",
      subtitle: "Découvrez ce que les guides manquent"
    }
  ],
  "pt-BR": [
    {
      title: "Experiência Real da Rota 66",
      subtitle: "Paradas autênticas ao longo da Mother Road"
    },
    {
      title: "Planejamento Perfeito de Viagem",
      subtitle: "Itinerários diários que realmente funcionam"
    },
    {
      title: "Joias Escondidas Reveladas",
      subtitle: "Descubra o que os guias perdem"
    }
  ]
};

const BenefitsRow: React.FC<BenefitsRowProps> = ({ language }) => {
  const benefits = benefitsContent[language as keyof typeof benefitsContent] || benefitsContent.en;

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-t border-route66-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 text-center md:text-left group"
            >
              {/* Green Checkmark Icon */}
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md group-hover:bg-green-600 transition-colors duration-300">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-highway font-bold text-base text-route66-text-primary mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-route66-text-secondary leading-relaxed">
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
