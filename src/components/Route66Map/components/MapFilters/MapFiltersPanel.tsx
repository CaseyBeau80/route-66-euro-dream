import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const FILTER_ITEMS: { category: MapLayerCategory; label: string; icon: React.ReactNode }[] = [
  { category: 'cities', label: 'Major Route 66 Cities', icon: <CitiesIcon /> },
  { category: 'attractions', label: 'Attractions', icon: <AttractionsIcon /> },
  { category: 'hiddenGems', label: 'Hidden Gems', icon: <HiddenGemsIcon /> },
  { category: 'driveIns', label: 'Drive-In Theaters', icon: <DriveInsIcon /> },
  { category: 'nativeAmerican', label: 'Native American Heritage', icon: <NativeAmericanIcon /> },
];

const MapFiltersPanel: React.FC<MapFiltersPanelProps> = ({ 
  onClose,
  showCloseButton = false 
}) => {
  const { filters, toggleFilter, showAll, hideAll, activeCount } = useMapFilters();

  return (
    <div className="bg-amber-50/95 backdrop-blur-sm rounded-lg shadow-xl border border-amber-200 p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          🗺️ Map Layers
          <span className="text-xs font-normal text-gray-500">
            ({activeCount}/5)
          </span>
        </h3>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-100 rounded-md transition-colors"
            aria-label="Close filters"
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
          className="flex-1 text-xs h-7 bg-white hover:bg-amber-100 border-amber-300 active:scale-95 transition-transform"
        >
          All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={hideAll}
          className="flex-1 text-xs h-7 bg-white hover:bg-amber-100 border-amber-300 active:scale-95 transition-transform"
        >
          None
        </Button>
      </div>

      {/* Filter Items */}
      <div className="space-y-1">
        {FILTER_ITEMS.map(({ category, label, icon }) => (
          <MapFilterItem
            key={category}
            icon={icon}
            label={label}
            checked={filters[category]}
            onToggle={() => toggleFilter(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default MapFiltersPanel;
