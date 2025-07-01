
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Camera } from 'lucide-react';

interface InteractiveMapSectionProps {
  language: string;
}

const mapContent = {
  en: {
    title: "Interactive Route 66 Map",
    subtitle: "Explore America's Main Street",
    description: "Navigate the complete Route 66 journey with our interactive map featuring historic stops, attractions, and hidden gems.",
    features: [
      "Historic landmarks and attractions",
      "Photo challenge locations",
      "Navigation assistance"
    ]
  },
  de: {
    title: "Interaktive Route 66 Karte", 
    subtitle: "Erkunden Sie Amerikas Hauptstraße",
    description: "Navigieren Sie die komplette Route 66 Reise mit unserer interaktiven Karte mit historischen Stops, Attraktionen und versteckten Juwelen.",
    features: [
      "Historische Wahrzeichen und Attraktionen",
      "Foto-Challenge Standorte", 
      "Navigationshilfe"
    ]
  },
  fr: {
    title: "Carte Interactive Route 66",
    subtitle: "Explorez la Route Principale de l'Amérique", 
    description: "Naviguez le voyage complet de la Route 66 avec notre carte interactive présentant des arrêts historiques, attractions et joyaux cachés.",
    features: [
      "Monuments historiques et attractions",
      "Emplacements de défi photo",
      "Assistance de navigation"
    ]
  },
  "pt-BR": {
    title: "Mapa Interativo da Rota 66",
    subtitle: "Explore a Rua Principal da América",
    description: "Navegue pela jornada completa da Rota 66 com nosso mapa interativo apresentando paradas históricas, atrações e joias escondidas.",
    features: [
      "Marcos históricos e atrações", 
      "Locais de desafio de fotos",
      "Assistência de navegação"
    ]
  }
};

const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ language }) => {
  const content = mapContent[language as keyof typeof mapContent] || mapContent.en;

  return (
    <section className="py-16 bg-route66-background-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-route66-text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-route66-text-secondary mb-8">
            {content.subtitle}
          </p>
          <p className="text-route66-text-secondary max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {content.features.map((feature, index) => {
            const icons = [MapPin, Camera, Navigation];
            const Icon = icons[index];
            return (
              <Card key={index} className="bg-route66-background border-route66-border">
                <CardHeader className="text-center">
                  <Icon className="w-12 h-12 mx-auto text-route66-primary mb-4" />
                  <CardTitle className="text-route66-text-primary">{feature}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="bg-route66-background rounded-lg p-8 border border-route66-border">
          <div className="text-center">
            <div className="w-full h-64 bg-gradient-to-br from-route66-primary/10 to-route66-rust/10 rounded-lg flex items-center justify-center">
              <div className="text-route66-text-secondary">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Interactive Map Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;
