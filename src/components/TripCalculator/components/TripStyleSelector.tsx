
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';
import { DistanceEstimationService } from '../services/utils/DistanceEstimationService';
import TripStyleHelperMessage from './TripStyleHelperMessage';

interface TripStyleSelectorProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripStyleSelector: React.FC<TripStyleSelectorProps> = ({
  formData,
  setFormData
}) => {
  const handleTripStyleChange = (value: 'balanced' | 'destination-focused') => {
    setFormData({
      ...formData,
      tripStyle: value
    });
  };

  // Calculate estimated days for helper message
  const shouldShowHelperMessage = () => {
    // Only show for destination-focused trips
    if (formData.tripStyle !== 'destination-focused') return false;
    
    // Need both start and end locations
    if (!formData.startLocation || !formData.endLocation) return false;
    
    // Need valid travel days
    if (!formData.travelDays || formData.travelDays <= 0) return false;
    
    const estimatedDays = DistanceEstimationService.estimateTripDays(
      formData.startLocation,
      formData.endLocation
    );
    
    // Show message if actual days is less than estimated days
    return estimatedDays !== null && formData.travelDays < estimatedDays;
  };

  const getEstimatedDays = () => {
    if (!formData.startLocation || !formData.endLocation) return null;
    
    return DistanceEstimationService.estimateTripDays(
      formData.startLocation,
      formData.endLocation
    );
  };

  const showHelper = shouldShowHelperMessage();
  const estimatedDays = getEstimatedDays();

  return (
    <Card className="border-route66-border bg-route66-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-route66-text-primary flex items-center gap-2">
          <MapPin className="h-5 w-5 text-route66-primary" />
          Trip Style
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={formData.tripStyle}
          onValueChange={handleTripStyleChange}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-route66-border hover:bg-route66-background-alt transition-colors">
            <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="balanced" className="text-route66-text-primary font-medium cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-route66-primary" />
                  Balanced
                </div>
              </Label>
              <p className="text-sm text-route66-text-secondary">
                Evenly distributes driving time across all days for consistent daily travel
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-route66-border hover:bg-route66-background-alt transition-colors">
            <RadioGroupItem value="destination-focused" id="destination-focused" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="destination-focused" className="text-route66-text-primary font-medium cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-route66-primary" />
                  Destination-Focused
                </div>
              </Label>
              <p className="text-sm text-route66-text-secondary">
                Prioritizes major Route 66 destination cities as stopping points, drive times may vary
              </p>
            </div>
          </div>
        </RadioGroup>

        {/* Helper Message */}
        {showHelper && estimatedDays && (
          <TripStyleHelperMessage 
            estimatedDays={estimatedDays}
            actualDays={formData.travelDays}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TripStyleSelector;
