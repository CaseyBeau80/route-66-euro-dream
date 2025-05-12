
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type ItinerarySectionProps = {
  language: string;
};

const itineraryContent = {
  en: {
    title: "Not sure where to start?",
    subtitle: "Choose from our curated itineraries designed specifically for European travelers",
    itineraries: [
      {
        title: "7-day Express",
        description: "The essential Route 66 experience hitting major landmarks",
        suitable: "Perfect for first-time visitors with limited time",
        cities: "Chicago » St. Louis » Oklahoma City » Amarillo » Albuquerque » Flagstaff » Santa Monica",
        button: "View Itinerary"
      },
      {
        title: "10-day Classic",
        description: "A balanced journey with time to enjoy iconic stops",
        suitable: "Great for those who want to experience both cities and small towns",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Las Vegas » Santa Monica",
        button: "View Itinerary"
      },
      {
        title: "14-day Complete",
        description: "The ultimate Route 66 adventure with maximum exploration",
        suitable: "For those who want to see it all and go off the beaten path",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Flagstaff » Oatman » Las Vegas » Barstow » Santa Monica",
        button: "View Itinerary"
      }
    ]
  },
  de: {
    title: "Nicht sicher wo anfangen?",
    subtitle: "Wählen Sie aus unseren kuratierten Reiserouten, die speziell für europäische Reisende entwickelt wurden",
    itineraries: [
      {
        title: "7-Tage Express",
        description: "Das wesentliche Route 66-Erlebnis mit wichtigen Sehenswürdigkeiten",
        suitable: "Perfekt für Erstbesucher mit begrenzter Zeit",
        cities: "Chicago » St. Louis » Oklahoma City » Amarillo » Albuquerque » Flagstaff » Santa Monica",
        button: "Reiseplan ansehen"
      },
      {
        title: "10-Tage Klassisch",
        description: "Eine ausgewogene Reise mit Zeit, um ikonische Stopps zu genießen",
        suitable: "Ideal für diejenigen, die sowohl Städte als auch Kleinstädte erleben möchten",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Las Vegas » Santa Monica",
        button: "Reiseplan ansehen"
      },
      {
        title: "14-Tage Komplett",
        description: "Das ultimative Route 66-Abenteuer mit maximaler Erkundung",
        suitable: "Für diejenigen, die alles sehen und abseits der ausgetretenen Pfade gehen möchten",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Flagstaff » Oatman » Las Vegas » Barstow » Santa Monica",
        button: "Reiseplan ansehen"
      }
    ]
  },
  fr: {
    title: "Vous ne savez pas par où commencer ?",
    subtitle: "Choisissez parmi nos itinéraires spécialement conçus pour les voyageurs européens",
    itineraries: [
      {
        title: "Express 7 jours",
        description: "L'expérience essentielle de la Route 66 avec les sites majeurs",
        suitable: "Parfait pour les visiteurs première fois avec un temps limité",
        cities: "Chicago » St. Louis » Oklahoma City » Amarillo » Albuquerque » Flagstaff » Santa Monica",
        button: "Voir l'itinéraire"
      },
      {
        title: "Classique 10 jours",
        description: "Un voyage équilibré avec le temps de profiter des arrêts emblématiques",
        suitable: "Idéal pour ceux qui veulent découvrir les grandes villes et les petites localités",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Las Vegas » Santa Monica",
        button: "Voir l'itinéraire"
      },
      {
        title: "Complet 14 jours",
        description: "L'aventure ultime sur la Route 66 avec une exploration maximale",
        suitable: "Pour ceux qui veulent tout voir et sortir des sentiers battus",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Flagstaff » Oatman » Las Vegas » Barstow » Santa Monica",
        button: "Voir l'itinéraire"
      }
    ]
  },
  nl: {
    title: "Weet u niet waar te beginnen?",
    subtitle: "Kies uit onze samengestelde reisroutes speciaal ontworpen voor Europese reizigers",
    itineraries: [
      {
        title: "7-daagse Express",
        description: "De essentiële Route 66-ervaring met belangrijke bezienswaardigheden",
        suitable: "Perfect voor eerste bezoekers met beperkte tijd",
        cities: "Chicago » St. Louis » Oklahoma City » Amarillo » Albuquerque » Flagstaff » Santa Monica",
        button: "Bekijk reisroute"
      },
      {
        title: "10-daagse Klassiek",
        description: "Een evenwichtige reis met tijd om te genieten van iconische stops",
        suitable: "Geweldig voor degenen die zowel steden als kleine dorpen willen ervaren",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Las Vegas » Santa Monica",
        button: "Bekijk reisroute"
      },
      {
        title: "14-daagse Compleet",
        description: "Het ultieme Route 66-avontuur met maximale verkenning",
        suitable: "Voor degenen die alles willen zien en buiten de gebaande paden willen gaan",
        cities: "Chicago » Springfield » St. Louis » Tulsa » Oklahoma City » Amarillo » Santa Fe » Gallup » Flagstaff » Oatman » Las Vegas » Barstow » Santa Monica",
        button: "Bekijk reisroute"
      }
    ]
  }
};

const ItinerarySection = ({ language }: ItinerarySectionProps) => {
  const content = itineraryContent[language as keyof typeof itineraryContent] || itineraryContent.en;
  
  return (
    <section id="itineraries" className="py-16 bg-route66-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-route66 text-route66-red mb-2">{content.title}</h2>
          <p className="text-route66-gray max-w-2xl mx-auto">{content.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.itineraries.map((itinerary, index) => (
            <Card key={index} className="border border-route66-gray/10 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="h-3 bg-route66-red"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-route66-gray mb-3">{itinerary.title}</h3>
                <p className="text-route66-gray mb-4">{itinerary.description}</p>
                
                <div className="bg-route66-lightgray p-3 rounded-md mb-4">
                  <p className="text-sm text-route66-blue font-medium">{itinerary.suitable}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-route66-gray/80 mb-2">Route:</p>
                  <p className="text-sm font-medium text-route66-gray">{itinerary.cities}</p>
                </div>
                
                <Button variant="outline" className="w-full flex items-center justify-center border-route66-red text-route66-red hover:bg-route66-red hover:text-white transition-colors">
                  {itinerary.button}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-route66-blue hover:bg-route66-blue/90 text-white">
            Compare All Itineraries
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;
