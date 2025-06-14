
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantsTabContentProps {
  segments: DailySegment[];
  isVisible: boolean;
}

const RestaurantsTabContent: React.FC<RestaurantsTabContentProps> = ({
  segments,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Utensils className="h-12 w-12 text-route66-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-route66-text-primary mb-2">
          Route 66 Dining
        </h3>
        <p className="text-route66-text-secondary mb-4">
          Classic diners and local favorites along your route
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
            </div>

            <div className="text-center py-8 text-route66-text-secondary">
              <Utensils className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h5 className="font-medium mb-2">Restaurant Recommendations Coming Soon</h5>
              <p className="text-sm">
                We're working on adding dining recommendations for each segment of your journey.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RestaurantsTabContent;
