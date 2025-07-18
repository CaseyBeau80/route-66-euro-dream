
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';
import TripStyleHelperMessage from './TripStyleHelperMessage';

interface TripStyleSelectorProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
  onTripStyleChange?: (style: 'destination-focused') => void;
}

const TripStyleSelector: React.FC<TripStyleSelectorProps> = ({
  formData,
  setFormData,
  onTripStyleChange
}) => {
  const handleTripStyleChange = (value: 'destination-focused') => {
    console.log(`🎨 Trip style changed to: ${value}`);
    
    // Update form data
    setFormData({
      ...formData,
      tripStyle: value
    });
    
    // Trigger callback if provided (for re-planning)
    if (onTripStyleChange) {
      onTripStyleChange(value);
    }
  };

  // Show helper message when we have enough information
  const shouldShowHelperMessage = () => {
    return !!(formData.startLocation && 
             formData.endLocation && 
             formData.travelDays > 0 && 
             formData.tripStyle);
  };

  return (
    <Card className="border-route66-border bg-route66-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-route66-text-primary flex items-center gap-2">
          <MapPin className="h-5 w-5 text-route66-primary" />
          Trip Style
        </CardTitle>
        <p className="text-sm text-route66-text-secondary">
          Heritage Cities experience with optimized drive times
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={formData.tripStyle}
          onValueChange={handleTripStyleChange}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-route66-border hover:bg-route66-background-alt transition-colors">
            <RadioGroupItem value="destination-focused" id="destination-focused" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="destination-focused" className="text-route66-text-primary font-medium cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-route66-primary" />
                  Heritage Cities Experience
                </div>
              </Label>
              <p className="text-sm text-route66-text-secondary">
                Prioritizes major Route 66 heritage cities with optimized drive times (max 10h/day). Focus on iconic destinations with manageable daily drives.
              </p>
            </div>
          </div>
        </RadioGroup>

        {/* Enhanced Helper Message with Validation */}
        {shouldShowHelperMessage() && (
          <TripStyleHelperMessage 
            startLocation={formData.startLocation}
            endLocation={formData.endLocation}
            actualDays={formData.travelDays}
            tripStyle={formData.tripStyle}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TripStyleSelector;
