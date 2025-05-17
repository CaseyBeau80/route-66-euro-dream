
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Filter, CarFront, Utensils, Music, History as HistoryIcon, Bed } from "lucide-react";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RouteMapProps = {
  language: string;
};

// State information for Route 66
type StateInfo = {
  name: string;
  description: string;
  attractions: string[];
  path: string; // SVG path
  color: string; // Default color
  position: {
    x: number;
    y: number;
  }
};

const route66States: Record<string, StateInfo> = {
  illinois: {
    name: "Illinois",
    description: "The starting point of Route 66 in Chicago",
    attractions: ["Chicago", "Pontiac", "Springfield"],
    path: "M160,130 L180,110 L190,130 L195,145 L185,160 L165,155 L160,130",
    color: "#D1495B",
    position: { x: 175, y: 130 }
  },
  missouri: {
    name: "Missouri",
    description: "Home to the Gateway Arch and iconic Route 66 stops",
    attractions: ["St. Louis", "Springfield", "Cuba"],
    path: "M165,155 L185,160 L200,185 L175,195 L155,180 L165,155",
    color: "#EDAE49",
    position: { x: 175, y: 175 }
  },
  kansas: {
    name: "Kansas",
    description: "Brief but historic segment through the southeast corner",
    attractions: ["Galena", "Baxter Springs"],
    path: "M155,180 L175,195 L170,205 L150,190 L155,180",
    color: "#00798C",
    position: { x: 162, y: 195 }
  },
  oklahoma: {
    name: "Oklahoma",
    description: "Longest stretch of original Route 66 pavement",
    attractions: ["Tulsa", "Oklahoma City", "Clinton"],
    path: "M150,190 L170,205 L200,210 L220,230 L150,235 L140,205 L150,190",
    color: "#30638E",
    position: { x: 170, y: 215 }
  },
  texas: {
    name: "Texas",
    description: "The Panhandle section with Cadillac Ranch",
    attractions: ["Amarillo", "Cadillac Ranch", "Shamrock"],
    path: "M150,235 L220,230 L225,260 L150,265 L145,240 L150,235",
    color: "#D1495B",
    position: { x: 185, y: 245 }
  },
  newMexico: {
    name: "New Mexico",
    description: "Land of Enchantment with rich indigenous culture",
    attractions: ["Albuquerque", "Santa Fe", "Tucumcari"],
    path: "M150,265 L225,260 L220,305 L145,310 L140,275 L150,265",
    color: "#EDAE49",
    position: { x: 180, y: 285 }
  },
  arizona: {
    name: "Arizona",
    description: "Spectacular desert landscapes and the Painted Desert",
    attractions: ["Flagstaff", "Winslow", "Petrified Forest"],
    path: "M145,310 L220,305 L210,360 L120,350 L130,320 L145,310",
    color: "#00798C",
    position: { x: 175, y: 330 }
  },
  california: {
    name: "California",
    description: "The western terminus at Santa Monica Pier",
    attractions: ["Needles", "Barstow", "Santa Monica"],
    path: "M120,350 L210,360 L200,420 L90,410 L100,360 L120,350",
    color: "#30638E",
    position: { x: 150, y: 380 }
  }
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
    },
    stateExplore: "Explore",
    stateAttractions: "Top Attractions:"
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
    },
    stateExplore: "Erkunden",
    stateAttractions: "Top Attraktionen:"
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
    },
    stateExplore: "Explorer",
    stateAttractions: "Attractions Principales:"
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
    },
    stateExplore: "Verkennen",
    stateAttractions: "Topattracties:"
  }
};

const RouteMap = ({ language }: RouteMapProps) => {
  const content = mapContent[language as keyof typeof mapContent] || mapContent.en;
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId === selectedState ? null : stateId);
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
            <HistoryIcon size={16} className="mr-2" />
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
            <CarFront size={15} className="mr-2" />
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
        
        {/* Interactive Map Container */}
        <div className="relative border border-route66-gray/10 rounded-lg overflow-hidden bg-route66-cream/30 h-96 md:h-[500px]">
          {/* Background map image */}
          <img 
            src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&h=600&q=80" 
            alt="Route 66 Map Background"
            className="w-full h-full object-cover opacity-30 absolute inset-0"
          />
          
          {/* Interactive SVG Map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full max-w-3xl" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
              {/* Route 66 line */}
              <path 
                d="M175,130 C180,160 170,190 160,200 C150,210 155,230 175,240 C185,245 180,260 170,270 C160,285 170,310 185,320 C195,330 190,360 175,380 C160,400 140,410 110,410" 
                stroke="#D92121" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="10,10" 
                strokeLinecap="round"
              />
              
              {/* State shapes */}
              <TooltipProvider>
                {Object.entries(route66States).map(([stateId, state]) => (
                  <Tooltip key={stateId}>
                    <TooltipTrigger asChild>
                      <g
                        onClick={() => handleStateClick(stateId)}
                        onMouseEnter={() => setHoveredState(stateId)}
                        onMouseLeave={() => setHoveredState(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <path 
                          d={state.path} 
                          fill={
                            selectedState === stateId
                              ? '#D92121' // Selected state
                              : hoveredState === stateId 
                                ? `${state.color}CC` // Hovered state (with transparency)
                                : `${state.color}88` // Normal state (with more transparency)
                          }
                          stroke="#FFF" 
                          strokeWidth="2"
                        />
                        <text 
                          x={state.position.x} 
                          y={state.position.y} 
                          textAnchor="middle" 
                          fill={selectedState === stateId ? "#FFF" : "#333"} 
                          fontSize="12" 
                          fontWeight={selectedState === stateId ? "bold" : "normal"}
                        >
                          {state.name}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>{state.name}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
              
              {/* Cities markers */}
              <circle cx="175" cy="130" r="4" fill="#D92121" /> {/* Chicago */}
              <circle cx="110" cy="410" r="4" fill="#D92121" /> {/* Santa Monica */}
              
              {/* City labels */}
              <text x="175" y="120" textAnchor="middle" fill="#333" fontSize="10">Chicago</text>
              <text x="110" y="425" textAnchor="middle" fill="#333" fontSize="10">Santa Monica</text>
            </svg>
          </div>
          
          {/* State Information Panel (shows when state is selected) */}
          {selectedState && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 backdrop-blur-sm border-t border-route66-gray/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-route66 text-xl text-route66-red">
                    {route66States[selectedState].name}
                  </h3>
                  <p className="text-route66-gray text-sm mb-2">
                    {route66States[selectedState].description}
                  </p>
                  <div>
                    <span className="text-xs font-medium text-route66-gray/80">{content.stateAttractions}</span>
                    <ul className="text-sm flex flex-wrap gap-2 mt-1">
                      {route66States[selectedState].attractions.map((attraction, idx) => (
                        <li key={idx} className="inline-flex items-center bg-route66-cream/50 px-2 py-1 rounded">
                          <MapPin size={12} className="mr-1 text-route66-red" />
                          {attraction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-route66-red text-white hover:bg-route66-red/90"
                >
                  {content.stateExplore}
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 text-route66-gray/60 hover:text-route66-gray"
                onClick={() => setSelectedState(null)}
              >
                &times;
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
