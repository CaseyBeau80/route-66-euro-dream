
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
    <section id="map" className="py-0 min-h-screen flex items-center justify-center bg-white relative">
      {/* Hero-style map background for emphasis */}
      <div className="absolute inset-0 bg-route66-cream/20 z-0"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <MapHeader content={content} />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 space-y-6">
            {/* Category Tabs */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-route66-blue">Categories</h3>
              <MapCategories 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                content={content} 
              />
            </div>
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-route66-blue">Filters</h3>
              <MapFilters 
                activeFilters={activeFilters} 
                toggleFilter={toggleFilter} 
                content={content} 
              />
            </div>
          </div>
          
          {/* Interactive Map Container - Made larger and more prominent */}
          <div className="w-full md:w-3/4">
            <div className="relative border border-route66-gray/10 rounded-xl overflow-hidden bg-white shadow-xl h-[600px]">
              {/* Map overlay patterns */}
              <div className="absolute inset-0 bg-route66-cream/10 mix-blend-overlay z-0"></div>
              
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
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
