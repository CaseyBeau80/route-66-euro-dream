
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Camera, Calendar } from 'lucide-react';

interface TravelResourcesProps {
  language: string;
}

const resourcesContent = {
  en: {
    title: "Travel Resources",
    subtitle: "Everything you need for your Route 66 adventure",
    resources: [
      {
        title: "Route Planning",
        description: "Interactive trip calculator and itinerary planner",
        icon: MapPin,
        link: "/trip-calculator"
      },
      {
        title: "Photo Challenge",
        description: "Capture memories and become a Route 66 Trailblazer",
        icon: Camera,
        link: "/test-upload"
      },
      {
        title: "Events & Timeline",
        description: "Historic events and Route 66 milestones",
        icon: Calendar,
        link: "/timeline"
      }
    ]
  },
  de: {
    title: "Reise-Ressourcen",
    subtitle: "Alles was Sie für Ihr Route 66 Abenteuer brauchen",
    resources: [
      {
        title: "Routenplanung",
        description: "Interaktiver Reiserechner und Reiseplaner",
        icon: MapPin,
        link: "/trip-calculator"
      },
      {
        title: "Foto-Challenge",
        description: "Erfassen Sie Erinnerungen und werden Sie ein Route 66 Pionier",
        icon: Camera,
        link: "/test-upload"
      },
      {
        title: "Ereignisse & Zeitstrahl",
        description: "Historische Ereignisse und Route 66 Meilensteine",
        icon: Calendar,
        link: "/timeline"
      }
    ]
  },
  fr: {
    title: "Ressources de Voyage",
    subtitle: "Tout ce dont vous avez besoin pour votre aventure Route 66",
    resources: [
      {
        title: "Planification d'Itinéraire",
        description: "Calculateur de voyage interactif et planificateur d'itinéraire",
        icon: MapPin,
        link: "/trip-calculator"
      },
      {
        title: "Défi Photo",
        description: "Capturez des souvenirs et devenez un pionnier de la Route 66",
        icon: Camera,
        link: "/test-upload"
      },
      {
        title: "Événements & Chronologie",
        description: "Événements historiques et jalons de la Route 66",
        icon: Calendar,
        link: "/timeline"
      }
    ]
  },
  "pt-BR": {
    title: "Recursos de Viagem",
    subtitle: "Tudo que você precisa para sua aventura na Rota 66",
    resources: [
      {
        title: "Planejamento de Rota",
        description: "Calculadora de viagem interativa e planejador de itinerário",
        icon: MapPin,
        link: "/trip-calculator"
      },
      {
        title: "Desafio de Fotos",
        description: "Capture memórias e torne-se um pioneiro da Rota 66",
        icon: Camera,
        link: "/test-upload"
      },
      {
        title: "Eventos & Linha do Tempo",
        description: "Eventos históricos e marcos da Rota 66",
        icon: Calendar,
        link: "/timeline"
      }
    ]
  }
};

const TravelResources: React.FC<TravelResourcesProps> = ({ language }) => {
  const content = resourcesContent[language as keyof typeof resourcesContent] || resourcesContent.en;

  return (
    <section className="py-16 bg-route66-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-route66-text-primary mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-route66-text-secondary">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Card key={index} className="bg-route66-background-alt border-route66-border hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Icon className="w-12 h-12 mx-auto text-route66-primary mb-4" />
                  <CardTitle className="text-route66-text-primary">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-route66-text-secondary mb-6">
                    {resource.description}
                  </p>
                  <Button 
                    className="bg-route66-primary hover:bg-route66-rust text-white"
                    onClick={() => window.location.href = resource.link}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TravelResources;
