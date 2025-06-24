
import React, { useState } from 'react';
import { MapPin, Navigation, Camera, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Route66Map from '../Route66Map';

interface InteractiveMapSectionProps {
  language: string;
}

const mapContent = {
  en: {
    badge: "Interactive Experience",
    title: "Explore the Mother Road",
    subtitle: "Navigate America's most iconic highway",
    description: "Discover historic towns, legendary attractions, and hidden gems along Route 66. Click on markers to learn about each destination's unique history and must-see stops.",
    exploreButton: "Start Exploring",
    features: [
      { icon: MapPin, title: "Historic Towns", description: "Visit authentic Route 66 communities" },
      { icon: Navigation, title: "Turn-by-Turn", description: "GPS navigation for the full route" },
      { icon: Camera, title: "Photo Spots", description: "Instagram-worthy roadside attractions" },
      { icon: Info, title: "Local Tips", description: "Insider knowledge from locals" }
    ]
  },
  de: {
    badge: "Interaktive Erfahrung",
    title: "Erkunde die Mother Road",
    subtitle: "Navigiere Amerikas ikonischste Straße",
    description: "Entdecke historische Städte, legendäre Attraktionen und versteckte Perlen entlang der Route 66. Klicke auf Markierungen, um die einzigartige Geschichte und Sehenswürdigkeiten jedes Ziels zu erfahren.",
    exploreButton: "Erkunden Beginnen",
    features: [
      { icon: MapPin, title: "Historische Städte", description: "Besuche authentische Route 66 Gemeinden" },
      { icon: Navigation, title: "Abbiegehinweise", description: "GPS-Navigation für die gesamte Route" },
      { icon: Camera, title: "Foto-Spots", description: "Instagram-würdige Straßenattraktionen" },
      { icon: Info, title: "Lokale Tipps", description: "Insider-Wissen von Einheimischen" }
    ]
  },
  fr: {
    badge: "Expérience Interactive",
    title: "Explorez la Mother Road",
    subtitle: "Naviguez sur la route la plus emblématique d'Amérique",
    description: "Découvrez des villes historiques, des attractions légendaires et des perles cachées le long de la Route 66. Cliquez sur les marqueurs pour découvrir l'histoire unique et les arrêts incontournables de chaque destination.",
    exploreButton: "Commencer l'Exploration",
    features: [
      { icon: MapPin, title: "Villes Historiques", description: "Visitez d'authentiques communautés de la Route 66" },
      { icon: Navigation, title: "Navigation", description: "Navigation GPS pour tout l'itinéraire" },
      { icon: Camera, title: "Spots Photo", description: "Attractions routières dignes d'Instagram" },
      { icon: Info, title: "Conseils Locaux", description: "Connaissances d'initiés des locaux" }
    ]
  },
  "pt-BR": {
    badge: "Experiência Interativa",
    title: "Explore a Mother Road",
    subtitle: "Navegue pela rodovia mais icônica da América",
    description: "Descubra cidades históricas, atrações lendárias e joias escondidas ao longo da Rota 66. Clique nos marcadores para aprender sobre a história única e paradas obrigatórias de cada destino.",
    exploreButton: "Começar a Explorar",
    features: [
      { icon: MapPin, title: "Cidades Históricas", description: "Visite comunidades autênticas da Rota 66" },
      { icon: Navigation, title: "Navegação", description: "Navegação GPS para toda a rota" },
      { icon: Camera, title: "Pontos Fotográficos", description: "Atrações rodoviárias dignas do Instagram" },
      { icon: Info, title: "Dicas Locais", description: "Conhecimento interno dos moradores locais" }
    ]
  }
};

const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ language }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const content = mapContent[language as keyof typeof mapContent] || mapContent.en;

  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-route66-primary/10 text-route66-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <MapPin className="w-4 h-4" />
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-route66 font-bold text-route66-text-primary mb-6">
            {content.title}
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto mb-8">
            {content.subtitle}
          </p>
          <p className="text-lg text-route66-text-muted max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {content.features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-route66-border hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-route66-primary mb-4 flex justify-center">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-route66-text-primary mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-route66-text-secondary text-center text-sm">
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
