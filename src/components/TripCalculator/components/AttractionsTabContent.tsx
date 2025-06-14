
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AttractionsTabContentProps {
  segments: DailySegment[];
  isVisible: boolean;
}

const AttractionsTabContent: React.FC<AttractionsTabContentProps> = ({
  segments,
  isVisible
}) => {
  if (!isVisible) return null;

  const totalAttractions = segments.reduce((total, segment) => 
    total + (segment.attractions?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="h-12 w-12 text-route66-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-route66-text-primary mb-2">
          Route 66 Attractions
        </h3>
        <p className="text-route66-text-secondary mb-4">
          Discover {totalAttractions} amazing stops along your journey
        </p>
      </div>

      {segments.map((segment, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-medium">
                  Day {segment.day}
                </Badge>
                <div>
                  <h4 className="font-semibold text-route66-text-primary">
                    {segment.startCity} → {segment.endCity}
                  </h4>
                </div>
              </div>
              <div className="text-sm text-route66-text-secondary">
                {segment.attractions?.length || 0} attractions
              </div>
            </div>

            {segment.attractions && segment.attractions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {segment.attractions.map((attraction, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-route66-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-route66-text-primary truncate">
                        {attraction.name}
                      </h5>
                      {attraction.description && (
                        <p className="text-sm text-route66-text-secondary mt-1 line-clamp-2">
                          {attraction.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-route66-text-secondary">
                <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No attractions found for this segment</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AttractionsTabContent;
