
import { Button } from "@/components/ui/button";
import { CarFront } from "lucide-react";

type MapFiltersProps = {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  content: {
    filters: {
      motorcycle: string;
      english: string;
      local: string;
      family: string;
    };
  };
};

export const MapFilters = ({ activeFilters, toggleFilter, content }: MapFiltersProps) => {
  return (
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
  );
};
