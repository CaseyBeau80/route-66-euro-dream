
import { useState } from 'react';
import { mapContent } from '@/data/mapContent';
import { route66States } from '@/types/StateInfo';

import { MapHeader } from './route-map/MapHeader';
import { MapCategories } from './route-map/MapCategories';
import { MapFilters } from './route-map/MapFilters';
import { InteractiveMap } from './route-map/InteractiveMap';
import { StateInfoPanel } from './route-map/StateInfoPanel';

type RouteMapProps = {
  language: string;
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
        <MapHeader content={content} />
        
        {/* Category Tabs */}
        <MapCategories 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          content={content} 
        />
        
        {/* Filters */}
        <MapFilters 
          activeFilters={activeFilters} 
          toggleFilter={toggleFilter} 
          content={content} 
        />
        
        {/* Interactive Map Container */}
        <div className="relative border border-route66-gray/10 rounded-lg overflow-hidden bg-route66-cream/30 h-96 md:h-[500px]">
          {/* Background map image */}
          <img 
            src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&h=600&q=80" 
            alt="Route 66 Map Background"
            className="w-full h-full object-cover opacity-30 absolute inset-0"
          />
          
          {/* Interactive SVG Map */}
          <InteractiveMap
            route66States={route66States}
            selectedState={selectedState}
            hoveredState={hoveredState}
            handleStateClick={handleStateClick}
            setHoveredState={setHoveredState}
          />
          
          {/* State Information Panel (shows when state is selected) */}
          {selectedState && (
            <StateInfoPanel
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              stateInfo={route66States[selectedState]}
              content={content}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
