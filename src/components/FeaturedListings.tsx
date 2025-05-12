
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Bed, Utensils, Music, MapPin } from "lucide-react";

type FeaturedListingsProps = {
  language: string;
};

const listingsContent = {
  en: {
    title: "Featured Places Along the Route",
    subtitle: "Handpicked accommodations and attractions European travelers love",
    viewAll: "View All Listings",
    categories: {
      motel: "Classic Motel",
      diner: "Route 66 Diner",
      music: "Live Music",
      museum: "Museum"
    },
    features: {
      motorcycleFriendly: "Motorcycle Friendly",
      englishSpoken: "English Spoken",
      localFavorite: "Local Favorite",
      europeanFavorite: "European Favorite"
    },
    listings: [
      {
        name: "Blue Swallow Motel",
        location: "Tucumcari, NM",
        description: "Iconic neon-lit motel with vintage rooms and classic Americana ambiance",
        category: "motel",
        features: ["motorcycleFriendly", "europeanFavorite"],
        image: "photo-1426604966848-d7adac402bff"
      },
      {
        name: "Delgadillo's Snow Cap Drive-In",
        location: "Seligman, AZ",
        description: "Quirky roadside eatery famous for its humorous atmosphere and great burgers",
        category: "diner",
        features: ["localFavorite", "europeanFavorite"],
        image: "photo-1482881497185-d4a9ddbe4151"
      },
      {
        name: "Route 66 Hall of Fame Museum",
        location: "Pontiac, IL",
        description: "Comprehensive museum dedicated to the history of the Mother Road",
        category: "museum",
        features: ["englishSpoken"],
        image: "photo-1465146344425-f00d5f5c8f07"
      },
      {
        name: "Boots Motel",
        location: "Carthage, MO",
        description: "Restored 1939 motel with streamlined modern amenities and period details",
        category: "motel",
        features: ["motorcycleFriendly", "englishSpoken"],
        image: "photo-1487252665478-49b61b47f302"
      }
    ],
    prev: "Previous",
    next: "Next"
  },
  de: {
    title: "Ausgewählte Orte entlang der Route",
    subtitle: "Handverlesene Unterkünfte und Attraktionen, die europäische Reisende lieben",
    viewAll: "Alle Einträge anzeigen",
    categories: {
      motel: "Klassisches Motel",
      diner: "Route 66 Diner",
      music: "Live-Musik",
      museum: "Museum"
    },
    features: {
      motorcycleFriendly: "Motorradfreundlich",
      englishSpoken: "Englisch wird gesprochen",
      localFavorite: "Lokaler Favorit",
      europeanFavorite: "Europäischer Favorit"
    },
    listings: [
      {
        name: "Blue Swallow Motel",
        location: "Tucumcari, NM",
        description: "Ikonisches Neon-Motel mit Vintage-Zimmern und klassischem Americana-Ambiente",
        category: "motel",
        features: ["motorcycleFriendly", "europeanFavorite"],
        image: "photo-1426604966848-d7adac402bff"
      },
      {
        name: "Delgadillo's Snow Cap Drive-In",
        location: "Seligman, AZ",
        description: "Skurriles Restaurant am Straßenrand, bekannt für seine humorvolle Atmosphäre und großartige Burger",
        category: "diner",
        features: ["localFavorite", "europeanFavorite"],
        image: "photo-1482881497185-d4a9ddbe4151"
      },
      {
        name: "Route 66 Hall of Fame Museum",
        location: "Pontiac, IL",
        description: "Umfassendes Museum, das der Geschichte der Mother Road gewidmet ist",
        category: "museum",
        features: ["englishSpoken"],
        image: "photo-1465146344425-f00d5f5c8f07"
      },
      {
        name: "Boots Motel",
        location: "Carthage, MO",
        description: "Restauriertes Motel von 1939 mit rationellen modernen Annehmlichkeiten und Periodendetails",
        category: "motel",
        features: ["motorcycleFriendly", "englishSpoken"],
        image: "photo-1487252665478-49b61b47f302"
      }
    ],
    prev: "Zurück",
    next: "Weiter"
  },
  fr: {
    title: "Lieux en vedette le long de la route",
    subtitle: "Hébergements et attractions sélectionnés que les voyageurs européens adorent",
    viewAll: "Voir toutes les annonces",
    categories: {
      motel: "Motel classique",
      diner: "Diner Route 66",
      music: "Musique live",
      museum: "Musée"
    },
    features: {
      motorcycleFriendly: "Adapté aux motos",
      englishSpoken: "Anglais parlé",
      localFavorite: "Favori local",
      europeanFavorite: "Favori européen"
    },
    listings: [
      {
        name: "Blue Swallow Motel",
        location: "Tucumcari, NM",
        description: "Motel iconique éclairé au néon avec des chambres vintage et une ambiance Americana classique",
        category: "motel",
        features: ["motorcycleFriendly", "europeanFavorite"],
        image: "photo-1426604966848-d7adac402bff"
      },
      {
        name: "Delgadillo's Snow Cap Drive-In",
        location: "Seligman, AZ",
        description: "Restaurant routier original connu pour son atmosphère humoristique et ses excellents hamburgers",
        category: "diner",
        features: ["localFavorite", "europeanFavorite"],
        image: "photo-1482881497185-d4a9ddbe4151"
      },
      {
        name: "Route 66 Hall of Fame Museum",
        location: "Pontiac, IL",
        description: "Musée complet dédié à l'histoire de la Mother Road",
        category: "museum",
        features: ["englishSpoken"],
        image: "photo-1465146344425-f00d5f5c8f07"
      },
      {
        name: "Boots Motel",
        location: "Carthage, MO",
        description: "Motel restauré de 1939 avec des commodités modernes rationalisées et des détails d'époque",
        category: "motel",
        features: ["motorcycleFriendly", "englishSpoken"],
        image: "photo-1487252665478-49b61b47f302"
      }
    ],
    prev: "Précédent",
    next: "Suivant"
  },
  nl: {
    title: "Uitgelichte plaatsen langs de route",
    subtitle: "Zorgvuldig geselecteerde accommodaties en attracties waar Europese reizigers van houden",
    viewAll: "Bekijk alle vermeldingen",
    categories: {
      motel: "Klassiek motel",
      diner: "Route 66 diner",
      music: "Live muziek",
      museum: "Museum"
    },
    features: {
      motorcycleFriendly: "Motorvriendelijk",
      englishSpoken: "Engels wordt gesproken",
      localFavorite: "Lokale favoriet",
      europeanFavorite: "Europese favoriet"
    },
    listings: [
      {
        name: "Blue Swallow Motel",
        location: "Tucumcari, NM",
        description: "Iconisch neon verlicht motel met vintage kamers en klassieke Americana-sfeer",
        category: "motel",
        features: ["motorcycleFriendly", "europeanFavorite"],
        image: "photo-1426604966848-d7adac402bff"
      },
      {
        name: "Delgadillo's Snow Cap Drive-In",
        location: "Seligman, AZ",
        description: "Eigenzinnig wegrestaurant bekend om zijn humoristische sfeer en geweldige hamburgers",
        category: "diner",
        features: ["localFavorite", "europeanFavorite"],
        image: "photo-1482881497185-d4a9ddbe4151"
      },
      {
        name: "Route 66 Hall of Fame Museum",
        location: "Pontiac, IL",
        description: "Uitgebreid museum gewijd aan de geschiedenis van de Mother Road",
        category: "museum",
        features: ["englishSpoken"],
        image: "photo-1465146344425-f00d5f5c8f07"
      },
      {
        name: "Boots Motel",
        location: "Carthage, MO",
        description: "Gerestaureerd motel uit 1939 met gestroomlijnde moderne voorzieningen en details uit die periode",
        category: "motel",
        features: ["motorcycleFriendly", "englishSpoken"],
        image: "photo-1487252665478-49b61b47f302"
      }
    ],
    prev: "Vorige",
    next: "Volgende"
  }
};

const FeaturedListings = ({ language }: FeaturedListingsProps) => {
  const content = listingsContent[language as keyof typeof listingsContent] || listingsContent.en;
  const [currentSlide, setCurrentSlide] = useState(0);
  const visibleListingsCount = 3; // Number of cards visible at once
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'motel': return <Bed size={18} />;
      case 'diner': return <Utensils size={18} />;
      case 'music': return <Music size={18} />;
      case 'museum': return <History size={18} />;
      default: return <MapPin size={18} />;
    }
  };
  
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      // Wrap around to the end
      setCurrentSlide(Math.max(0, content.listings.length - visibleListingsCount));
    }
  };
  
  const handleNext = () => {
    if (currentSlide < content.listings.length - visibleListingsCount) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Wrap around to the beginning
      setCurrentSlide(0);
    }
  };

  return (
    <section id="listings" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-route66 text-route66-red mb-2">{content.title}</h2>
            <p className="text-route66-gray">{content.subtitle}</p>
          </div>
          <Button variant="ghost" className="flex items-center text-route66-blue">
            {content.viewAll}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / visibleListingsCount)}%)` }}
            >
              {content.listings.map((listing, index) => (
                <div 
                  key={index} 
                  className="w-full md:w-1/3 flex-shrink-0 p-2"
                  style={{ minWidth: `${100 / visibleListingsCount}%` }}
                >
                  <Card className="border border-route66-gray/10 overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/${listing.image}?auto=format&fit=crop&w=600&q=80`} 
                        alt={listing.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white text-route66-gray flex items-center gap-1 shadow-sm">
                          {getCategoryIcon(listing.category)}
                          {content.categories[listing.category as keyof typeof content.categories]}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-route66-gray">{listing.name}</h3>
                      <p className="text-sm text-route66-gray/70 flex items-center mt-1 mb-3">
                        <MapPin size={14} className="mr-1" /> {listing.location}
                      </p>
                      <p className="text-sm text-route66-gray mb-4">
                        {listing.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {listing.features.map((feature, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs bg-route66-cream border-route66-gray/20"
                          >
                            {content.features[feature as keyof typeof content.features]}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              className="rounded-full border-route66-gray/30 hover:border-route66-blue hover:text-route66-blue"
            >
              <ArrowLeft size={20} />
              <span className="sr-only">{content.prev}</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="rounded-full border-route66-gray/30 hover:border-route66-blue hover:text-route66-blue"
            >
              <ArrowRight size={20} />
              <span className="sr-only">{content.next}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
