
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar } from 'lucide-react';
import { ListingItem } from '../../types';

interface CardContentProps {
  item: ListingItem;
}

export const CardContent = ({ item }: CardContentProps) => {
  return (
    <>
      <h3 className="font-bold text-lg text-route66-gray mb-1">{item.name}</h3>
      <p className="text-sm text-route66-gray/70 flex items-center mb-3">
        <MapPin size={14} className="mr-1 flex-shrink-0" /> 
        {item.city_name}{item.state && `, ${item.state}`}
      </p>
      
      {item.description && (
        <p className="text-sm text-route66-gray mb-4 line-clamp-3">
          {item.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-route66-gray/60 mb-3">
        {item.population && (
          <div className="flex items-center gap-1">
            <Users size={12} />
            {item.population.toLocaleString()}
          </div>
        )}
        {(item.founded_year || item.year_opened) && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {item.founded_year || item.year_opened}
          </div>
        )}
      </div>
    </>
  );
};
