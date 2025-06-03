import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TollRoads from "./TollRoads";

type TravelResourcesProps = {
  language: string;
};

const resourcesContent = {
  en: {
    title: "What Europeans Should Know",
    subtitle: "Essential information for international travelers on Route 66",
    categories: [
      {
        title: "Visa & Documentation",
        description: "What Europeans need to know about ESTA, visas, and required travel documentation",
        link: "Learn more about entry requirements"
      },
      {
        title: "Driving in America",
        description: "Rules of the road, renting a car, international driving permits and insurance advice",
        link: "Get US driving tips"
      },
      {
        title: "Cultural Differences",
        description: "Tipping culture, motel etiquette, measurement systems, and American customs",
        link: "Understand cultural norms"
      },
      {
        title: "Motorcycle Rentals",
        description: "How to rent a motorcycle, required licenses, and Route 66 on two wheels",
        link: "Motorcycle rental guide"
      }
    ],
    popularArticles: "Popular Articles",
    articles: [
      "What to Expect at a U.S. Motel",
      "Renting a Car in the U.S.",
      "Understanding American Food Portion Sizes",
      "Cell Phone Coverage on Route 66",
      "Credit Cards & Payment Methods"
    ]
  },
  de: {
    title: "Was Europäer wissen sollten",
    subtitle: "Wesentliche Informationen für internationale Reisende auf der Route 66",
    categories: [
      {
        title: "Visa & Dokumentation",
        description: "Was Europäer über ESTA, Visa und erforderliche Reisedokumente wissen müssen",
        link: "Mehr über Einreisebestimmungen erfahren"
      },
      {
        title: "Autofahren in Amerika",
        description: "Straßenverkehrsordnung, Autovermietung, internationale Führerscheine und Versicherungsratschläge",
        link: "US-Fahrtipps erhalten"
      },
      {
        title: "Kulturelle Unterschiede",
        description: "Trinkgeldkultur, Motel-Etikette, Maßsysteme und amerikanische Bräuche",
        link: "Kulturelle Normen verstehen"
      },
      {
        title: "Motorradverleih",
        description: "Wie man ein Motorrad mietet, erforderliche Führerscheine und Route 66 auf zwei Rädern",
        link: "Motorradverleih-Leitfaden"
      }
    ],
    popularArticles: "Beliebte Artikel",
    articles: [
      "Was Sie in einem US-Motel erwartet",
      "Ein Auto in den USA mieten",
      "Amerikanische Essensportionen verstehen",
      "Handyempfang auf der Route 66",
      "Kreditkarten und Zahlungsmethoden"
    ]
  },
  fr: {
    title: "Ce que les Européens devraient savoir",
    subtitle: "Informations essentielles pour les voyageurs internationaux sur la Route 66",
    categories: [
      {
        title: "Visa et documentation",
        description: "Ce que les Européens doivent savoir sur ESTA, les visas et les documents de voyage requis",
        link: "En savoir plus sur les conditions d'entrée"
      },
      {
        title: "Conduire en Amérique",
        description: "Code de la route, location de voiture, permis de conduire internationaux et conseils d'assurance",
        link: "Obtenir des conseils de conduite aux États-Unis"
      },
      {
        title: "Différences culturelles",
        description: "Culture du pourboire, étiquette de motel, systèmes de mesure et coutumes américaines",
        link: "Comprendre les normes culturelles"
      },
      {
        title: "Location de motos",
        description: "Comment louer une moto, les permis requis et la Route 66 sur deux roues",
        link: "Guide de location de moto"
      }
    ],
    popularArticles: "Articles populaires",
    articles: [
      "À quoi s'attendre dans un motel américain",
      "Louer une voiture aux États-Unis",
      "Comprendre les portions alimentaires américaines",
      "Couverture téléphonique sur la Route 66",
      "Cartes de crédit et modes de paiement"
    ]
  },
  nl: {
    title: "Wat Europeanen moeten weten",
    subtitle: "Essentiële informatie voor internationale reizigers op Route 66",
    categories: [
      {
        title: "Visum & Documentatie",
        description: "Wat Europeanen moeten weten over ESTA, visa en vereiste reisdocumenten",
        link: "Meer informatie over toegangseisen"
      },
      {
        title: "Rijden in Amerika",
        description: "Verkeersregels, een auto huren, internationale rijbewijzen en verzekeringsadviezen",
        link: "Krijg Amerikaanse rijtips"
      },
      {
        title: "Culturele verschillen",
        description: "Fooiencultuur, motel-etiquette, maatsystemen en Amerikaanse gebruiken",
        link: "Begrijp culturele normen"
      },
      {
        title: "Motorverhuur",
        description: "Hoe een motor te huren, vereiste rijbewijzen en Route 66 op twee wielen",
        link: "Motorverhuur gids"
      }
    ],
    popularArticles: "Populaire artikelen",
    articles: [
      "Wat te verwachten in een Amerikaans motel",
      "Een auto huren in de VS",
      "Amerikaanse voedselporties begrijpen",
      "Mobiele telefoonbereik op Route 66",
      "Creditcards & betaalmethoden"
    ]
  }
};

const TravelResources = ({ language }: TravelResourcesProps) => {
  console.log("🚗 TravelResources: Rendering with language:", language);
  
  const content = resourcesContent[language as keyof typeof resourcesContent] || resourcesContent.en;
  
  console.log("🚗 TravelResources: Content loaded:", content.title);
  
  return (
    <>
      <section id="resources" className="py-16 bg-route66-cream/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-route66 text-route66-red mb-2">{content.title}</h2>
            <p className="text-route66-gray max-w-2xl mx-auto">{content.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {content.categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-sm h-full bg-white hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-bold text-route66-blue mb-3">{category.title}</h3>
                  <p className="text-route66-gray mb-6 flex-grow">{category.description}</p>
                  <Button 
                    variant="link" 
                    className="p-0 text-route66-red hover:text-route66-red/80 flex items-center justify-start"
                  >
                    {category.link}
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-route66-blue mb-4">{content.popularArticles}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
              {content.articles.map((article, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-route66-gray hover:text-route66-red transition-colors flex items-center group"
                >
                  <ArrowRight 
                    size={14} 
                    className="mr-2 text-route66-red opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                  {article}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Add Toll Roads section */}
      <TollRoads language={language} />
    </>
  );
};

export default TravelResources;
