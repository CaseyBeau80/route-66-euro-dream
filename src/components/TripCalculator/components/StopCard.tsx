
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Camera, Star } from 'lucide-react';
import { TripStop } from '../types/TripStop';

interface StopCardProps {
  stop: TripStop;
}

const StopCard: React.FC<StopCardProps> = ({ stop }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'route66_waypoint': return 'bg-route66-red text-white';
      case 'destination_city': return 'bg-route66-orange text-white';
      case 'attraction': return 'bg-route66-vintage-blue text-white';
      case 'hidden_gem': return 'bg-route66-vintage-green text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'route66_waypoint': return <MapPin className="h-3 w-3" />;
      case 'destination_city': return <Star className="h-3 w-3" />;
      case 'attraction': return <Camera className="h-3 w-3" />;
      case 'hidden_gem': return <Star className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-route66-cream rounded-lg border border-route66-tan">
      {stop.image_url && (
        <img 
          src={stop.image_url} 
          alt={stop.name}
          className="w-16 h-12 object-cover rounded border border-route66-vintage-brown"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-travel font-bold text-route66-vintage-brown text-sm leading-tight">
            {stop.name}
          </h4>
          <Badge className={`${getCategoryColor(stop.category)} text-xs flex items-center gap-1 flex-shrink-0`}>
            {getCategoryIcon(stop.category)}
            {stop.category.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-route66-vintage-brown mt-1 leading-relaxed">
          {stop.description}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3 text-route66-vintage-brown" />
          <span className="text-xs text-route66-vintage-brown">
            {stop.city_name}, {stop.state}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StopCard;
