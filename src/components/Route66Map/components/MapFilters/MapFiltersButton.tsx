import React from 'react';
import { Layers } from 'lucide-react';
import { useMapFilters } from '@/contexts/MapFiltersContext';

interface MapFiltersButtonProps {
  onClick: () => void;
}

const MapFiltersButton: React.FC<MapFiltersButtonProps> = ({ onClick }) => {
  const { activeCount } = useMapFilters();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2.5 bg-amber-50/95 backdrop-blur-sm rounded-lg shadow-xl border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all"
      aria-label="Toggle map layers"
    >
      <Layers className="w-4 h-4 text-[#1B60A3]" />
      <span className="text-sm font-medium text-gray-800">Layers</span>
      <span className="text-xs bg-[#1B60A3] text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
        {activeCount}
      </span>
    </button>
  );
};

export default MapFiltersButton;
