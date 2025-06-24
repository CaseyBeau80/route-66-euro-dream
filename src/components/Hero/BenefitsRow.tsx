
import React from 'react';
import { Check } from 'lucide-react';

interface BenefitsRowProps {
  language: string;
}

const benefitsContent = {
  en: [
    {
      title: "100% Free Planning",
      subtitle: "No hidden costs or subscriptions"
    },
    {
      title: "Comprehensive Resources",
      subtitle: "Everything you need in one place"
    },
    {
      title: "Expert Route Guidance",
      subtitle: "Curated by Route 66 specialists"
    }
  ],
  de: [
    {
      title: "100% Kostenlose Planung",
      subtitle: "Keine versteckten Kosten oder Abonnements"
    },
    {
      title: "Umfassende Ressourcen",
      subtitle: "Alles was Sie brauchen an einem Ort"
    },
    {
      title: "Experten Route Führung",
      subtitle: "Kuratiert von Route 66 Spezialisten"
    }
  ],
  fr: [
    {
      title: "Planification 100% Gratuite",
      subtitle: "Aucun coût caché ou abonnement"
    },
    {
      title: "Ressources Complètes",
      subtitle: "Tout ce dont vous avez besoin en un seul endroit"
    },
    {
      title: "Guidage d'Itinéraire Expert",
      subtitle: "Organisé par des spécialistes de la Route 66"
    }
  ],
  "pt-BR": [
    {
      title: "Planejamento 100% Gratuito",
      subtitle: "Sem custos ocultos ou assinaturas"
    },
    {
      title: "Recursos Abrangentes",
      subtitle: "Tudo que você precisa em um lugar"
    },
    {
      title: "Orientação de Rota Especializada",
      subtitle: "Organizado por especialistas da Rota 66"
    }
  ]
};

const BenefitsRow: React.FC<BenefitsRowProps> = ({ language }) => {
  const benefits = benefitsContent[language as keyof typeof benefitsContent] || benefitsContent.en;

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-t border-route66-border/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 text-center md:text-left group"
            >
              {/* Green Checkmark Icon */}
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md group-hover:bg-green-600 transition-colors duration-300">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-highway font-bold text-lg text-route66-text-primary mb-1">
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
