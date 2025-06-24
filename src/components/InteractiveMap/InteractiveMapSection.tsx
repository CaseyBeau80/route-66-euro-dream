
import React, { useState } from 'react';
import { MapPin, Navigation, Camera, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Route66Map from '../Route66Map';

interface InteractiveMapSectionProps {
  language: string;
}

const mapContent = {
  en: {
    title: "Explore the Mother Road",
    subtitle: "Navigate America's most iconic highway with our interactive mapping tools",
    exploreButton: "Start Exploring",
    features: [
      { 
        icon: MapPin, 
        title: "Historic Towns", 
        description: "Visit authentic Route 66 communities",
        bgColor: "bg-blue-100"
      },
      { 
        icon: Navigation, 
        title: "Turn-by-Turn", 
        description: "GPS navigation for the full route",
        bgColor: "bg-green-100"
      },
      { 
        icon: Camera, 
        title: "Photo Spots", 
        description: "Instagram-worthy roadside attractions",
        bgColor: "bg-purple-100"
      },
      { 
        icon: Info, 
        title: "Local Tips", 
        description: "Insider knowledge from locals",
        bgColor: "bg-orange-100"
      }
    ]
  },
  de: {
    title: "Erkunde die Mother Road",
    subtitle: "Navigiere Amerikas ikonischste Straße mit unseren interaktiven Kartenwerkzeugen",
    exploreButton: "Erkunden Beginnen",
    features: [
      { 
        icon: MapPin, 
        title: "Historische Städte", 
        description: "Besuche authentische Route 66 Gemeinden",
        bgColor: "bg-blue-100"
      },
      { 
        icon: Navigation, 
        title: "Abbiegehinweise", 
        description: "GPS-Navigation für die gesamte Route",
        bgColor: "bg-green-100"
      },
      { 
        icon: Camera, 
        title: "Foto-Spots", 
        description: "Instagram-würdige Straßenattraktionen",
        bgColor: "bg-purple-100"
      },
      { 
        icon: Info, 
        title: "Lokale Tipps", 
        description: "Insider-Wissen von Einheimischen",
        bgColor: "bg-orange-100"
      }
    ]
  },
  fr: {
    title: "Explorez la Mother Road",
    subtitle: "Naviguez sur la route la plus emblématique d'Amérique avec nos outils de cartographie interactifs",
    exploreButton: "Commencer l'Exploration",
    features: [
      { 
        icon: MapPin, 
        title: "Villes Historiques", 
        description: "Visitez d'authentiques communautés de la Route 66",
        bgColor: "bg-blue-100"
      },
      { 
        icon: Navigation, 
        title: "Navigation", 
        description: "Navigation GPS pour tout l'itinéraire",
        bgColor: "bg-green-100"
      },
      { 
        icon: Camera, 
        title: "Spots Photo", 
        description: "Attractions routières dignes d'Instagram",
        bgColor: "bg-purple-100"
      },
      { 
        icon: Info, 
        title: "Conseils Locaux", 
        description: "Connaissances d'initiés des locaux",
        bgColor: "bg-orange-100"
      }
    ]
  },
  "pt-BR": {
    title: "Explore a Mother Road",
    subtitle: "Navegue pela rodovia mais icônica da América com nossas ferramentas de mapeamento interativo",
    exploreButton: "Começar a Explorar",
    features: [
      { 
        icon: MapPin, 
        title: "Cidades Históricas", 
        description: "Visite comunidades autênticas da Rota 66",
        bgColor: "bg-blue-100"
      },
      { 
        icon: Navigation, 
        title: "Navegação", 
        description: "Navegação GPS para toda a rota",
        bgColor: "bg-green-100"
      },
      { 
        icon: Camera, 
        title: "Pontos Fotográficos", 
        description: "Atrações rodoviárias dignas do Instagram",
        bgColor: "bg-purple-100"
      },
      { 
        icon: Info, 
        title: "Dicas Locais", 
        description: "Conhecimento interno dos moradores locais",
        bgColor: "bg-orange-100"
      }
    ]
  }
};

const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ language }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const content = mapContent[language as keyof typeof mapContent] || mapContent.en;

  const scrollToInteractiveMap = () => {
    const mapSection = document.getElementById('interactive-map');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4">
        {/* Header Section - Matching Trip Planner Format */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl border-4 border-route66-primary p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-route66 font-bold uppercase text-route66-primary mb-6">
              {content.title}
            </h2>
            <p className="text-lg text-route66-text-secondary max-w-4xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Feature Cards Grid - Matching Trip Planner Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {content.features.map((feature, index) => (
            <div 
              key={index}
              className={`${feature.bgColor} rounded-xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="text-route66-primary mb-4 flex justify-center">
                <feature.icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-highway font-bold text-route66-text-primary mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-route66-text-secondary text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            className={`
              transition-all duration-700 ease-in-out overflow-hidden rounded-2xl
              ${isMapExpanded ? 'h-[700px] opacity-100' : 'h-[500px] opacity-100'}
            `}
          >
            <div className="relative h-full bg-white rounded-2xl border-2 border-route66-border shadow-2xl overflow-hidden">
              <Route66Map />
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className="bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
            >
              {isMapExpanded ? 'Compact View' : 'Expand Map'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;
