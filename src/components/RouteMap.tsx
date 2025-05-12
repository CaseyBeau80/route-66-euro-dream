
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Motorcycle, CarFront, Utensils, Music, History, Bed } from "lucide-react";

type RouteMapProps = {
  language: string;
};

const mapContent = {
  en: {
    title: "Explore the Historic Route",
    subtitle: "Navigate the iconic 2,448-mile journey with our interactive map",
    filters: {
      motorcycle: "Motorcycle-friendly",
      english: "English-speaking staff",
      local: "Local favorite",
      family: "Family-friendly"
    },
    categories: {
      lodging: "Lodging",
      food: "Food",
      music: "Music",
      history: "History"
    }
  },
  de: {
    title: "Erkunden Sie die historische Route",
    subtitle: "Navigieren Sie die ikonische 3.940-km-Reise mit unserer interaktiven Karte",
    filters: {
      motorcycle: "Motorradfreundlich",
      english: "Englischsprachiges Personal",
      local: "Lokaler Favorit",
      family: "Familienfreundlich"
    },
    categories: {
      lodging: "Unterkünfte",
      food: "Essen",
      music: "Musik",
      history: "Geschichte"
    }
  },
  fr: {
    title: "Explorez la Route Historique",
    subtitle: "Naviguez sur l'emblématique voyage de 3.940 km avec notre carte interactive",
    filters: {
      motorcycle: "Adapté aux motos",
      english: "Personnel anglophone",
      local: "Favori local",
      family: "Adapté aux familles"
    },
    categories: {
      lodging: "Hébergement",
      food: "Nourriture",
      music: "Musique",
      history: "Histoire"
    }
  },
  nl: {
    title: "Verken de Historische Route",
    subtitle: "Navigeer de iconische reis van 3.940 km met onze interactieve kaart",
    filters: {
      motorcycle: "Motorvriendelijk",
      english: "Engelssprekend personeel",
      local: "Lokale favoriet",
      family: "Gezinsvriendelijk"
    },
    categories: {
      lodging: "Accommodatie",
      food: "Eten",
      music: "Muziek",
      history: "Geschiedenis"
    }
  }
};

const RouteMap = ({ language }: RouteMapProps) => {
  const content = mapContent[language as keyof typeof mapContent] || mapContent.en;
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  return (
    <section id="map" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-route66 text-route66-red mb-2">{content.title}</h2>
            <p className="text-route66-gray">{content.subtitle}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <Button variant="outline" size="sm" className="flex items-center text-route66-gray border-route66-gray/30 hover:bg-route66-gray/5">
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap space-x-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeCategory === 'all' ? "default" : "ghost"}
            className={activeCategory === 'all' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
            onClick={() => setActiveCategory('all')}
          >
            <MapPin size={16} className="mr-2" />
            All
          </Button>
          <Button
            variant={activeCategory === 'lodging' ? "default" : "ghost"}
            className={activeCategory === 'lodging' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
            onClick={() => setActiveCategory('lodging')}
          >
            <Bed size={16} className="mr-2" />
            {content.categories.lodging}
          </Button>
          <Button
            variant={activeCategory === 'food' ? "default" : "ghost"}
            className={activeCategory === 'food' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
            onClick={() => setActiveCategory('food')}
          >
            <Utensils size={16} className="mr-2" />
            {content.categories.food}
          </Button>
          <Button
            variant={activeCategory === 'music' ? "default" : "ghost"}
            className={activeCategory === 'music' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
            onClick={() => setActiveCategory('music')}
          >
            <Music size={16} className="mr-2" />
            {content.categories.music}
          </Button>
          <Button
            variant={activeCategory === 'history' ? "default" : "ghost"}
            className={activeCategory === 'history' ? "bg-route66-red text-white hover:bg-route66-red/90" : "text-route66-gray"}
            onClick={() => setActiveCategory('history')}
          >
            <History size={16} className="mr-2" />
            {content.categories.history}
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${activeFilters.includes('motorcycle') 
              ? 'bg-route66-blue/10 border-route66-blue text-route66-blue' 
              : 'text-route66-gray border-route66-gray/30'}`}
            onClick={() => toggleFilter('motorcycle')}
          >
            <Motorcycle size={15} className="mr-2" />
            {content.filters.motorcycle}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${activeFilters.includes('english') 
              ? 'bg-route66-blue/10 border-route66-blue text-route66-blue' 
              : 'text-route66-gray border-route66-gray/30'}`}
            onClick={() => toggleFilter('english')}
          >
            {content.filters.english}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${activeFilters.includes('local') 
              ? 'bg-route66-blue/10 border-route66-blue text-route66-blue' 
              : 'text-route66-gray border-route66-gray/30'}`}
            onClick={() => toggleFilter('local')}
          >
            {content.filters.local}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center ${activeFilters.includes('family') 
              ? 'bg-route66-blue/10 border-route66-blue text-route66-blue' 
              : 'text-route66-gray border-route66-gray/30'}`}
            onClick={() => toggleFilter('family')}
          >
            {content.filters.family}
          </Button>
        </div>
        
        {/* Map Container */}
        <div className="relative border border-route66-gray/10 rounded-lg overflow-hidden bg-route66-cream/30 h-96 md:h-[500px]">
          {/* Map Placeholder - In a real application, this would be a real interactive map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&h=600&q=80" 
                alt="Route 66 Map"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <MapPin size={48} className="text-route66-red mb-4" />
                <p className="text-lg font-medium text-white">Interactive Map Coming Soon</p>
                <p className="text-white/80 max-w-md text-center mx-auto mt-2">
                  Our map will display all recommended stops along Route 66, with filters for different traveler needs.
                </p>
              </div>
            </div>
          </div>
          
          {/* Route line illustration - simplified */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <path 
              d="M100,350 C200,300 300,400 400,320 C500,250 600,350 700,300 C800,250 900,300 1000,280" 
              stroke="#D92121" 
              strokeWidth="6" 
              fill="none" 
              strokeDasharray="10,10" 
              strokeLinecap="round"
            />
          </svg>
          
          {/* City markers - simplified */}
          <div className="absolute left-[10%] bottom-[30%] z-20">
            <div className="w-3 h-3 bg-route66-red rounded-full"></div>
            <span className="absolute whitespace-nowrap text-xs font-medium -ml-8 mt-2">Chicago</span>
          </div>
          
          <div className="absolute right-[10%] bottom-[28%] z-20">
            <div className="w-3 h-3 bg-route66-red rounded-full"></div>
            <span className="absolute whitespace-nowrap text-xs font-medium -ml-12 mt-2">Santa Monica</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
