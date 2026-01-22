import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useMapFilters, MapLayerCategory } from '@/contexts/MapFiltersContext';
import MapFilterItem from './MapFilterItem';
import { 
  CitiesIcon, 
  AttractionsIcon, 
  HiddenGemsIcon, 
  DriveInsIcon, 
  NativeAmericanIcon 
} from './filterIcons';

interface MapFiltersPanelProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const FILTER_ITEMS: { 
  category: MapLayerCategory; 
  label: string; 
  description: string;
  tooltip: string;
  icon: React.ReactNode;
}[] = [
  { 
    category: 'cities', 
    label: 'Major Route 66 Cities', 
    description: 'Event calendars, weather & fun facts',
    tooltip: 'Major Route 66 cities that include Event Calendars, Weather, Population, and Fun Facts',
    icon: <CitiesIcon /> 
  },
  { 
    category: 'attractions', 
    label: 'Attractions', 
    description: 'Points of interest & roadside stops',
    tooltip: 'Points of interest and roadside attractions along Route 66',
    icon: <AttractionsIcon /> 
  },
  { 
    category: 'hiddenGems', 
    label: 'Hidden Gems', 
    description: 'Lesser-known local treasures',
    tooltip: 'Lesser-known treasures and local secrets worth discovering',
    icon: <HiddenGemsIcon /> 
  },
  { 
    category: 'driveIns', 
    label: 'Drive-In Theaters', 
    description: 'Classic American drive-ins',
    tooltip: 'Classic American drive-in theaters, both active and historic',
    icon: <DriveInsIcon /> 
  },
  { 
    category: 'nativeAmerican', 
    label: 'Native American Heritage', 
    description: 'Indigenous cultural sites & history',
    tooltip: 'Indigenous cultural sites like pueblos, museums, and heritage centers',
    icon: <NativeAmericanIcon /> 
  },
];

const MapFiltersPanel: React.FC<MapFiltersPanelProps> = ({ 
  onClose,
  showCloseButton = false 
}) => {
  const { filters, toggleFilter, showAll, hideAll, resetToDefault, activeCount } = useMapFilters();

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        role="region" 
        aria-labelledby="map-layers-heading"
        className="bg-amber-50/95 backdrop-blur-sm rounded-lg shadow-xl border border-amber-200 p-4 w-80"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
          <h3 
            id="map-layers-heading"
            className="text-sm font-bold text-gray-800 flex items-center gap-2"
          >
            🗺️ Map Layers
            <span className="text-xs font-normal text-gray-500">
              ({activeCount}/5)
            </span>
          </h3>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-amber-100 rounded-md transition-colors"
              aria-label="Close filters panel"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={showAll}
            aria-pressed={activeCount === 5}
            className="flex-1 text-xs h-7 bg-white hover:bg-amber-100 border-amber-300 active:scale-95 transition-transform"
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={hideAll}
            aria-pressed={activeCount === 0}
            className="flex-1 text-xs h-7 bg-white hover:bg-amber-100 border-amber-300 active:scale-95 transition-transform"
          >
            None
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="flex-1 text-xs h-7 bg-white hover:bg-amber-100 border-amber-300 active:scale-95 transition-transform gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>

        {/* Filter Items */}
        <div className="space-y-0.5">
          {FILTER_ITEMS.map(({ category, label, description, tooltip, icon }) => (
            <MapFilterItem
              key={category}
              id={category}
              icon={icon}
              label={label}
              description={description}
              tooltip={tooltip}
              checked={filters[category]}
              onToggle={() => toggleFilter(category)}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MapFiltersPanel;
