
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsSectionProps {
  isFormValid: boolean;
  isPlanning: boolean;
  onPlanTrip: () => void;
  onResetTrip: () => void;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  isFormValid,
  isPlanning,
  onPlanTrip,
  onResetTrip
}) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onPlanTrip}
        disabled={!isFormValid || isPlanning}
        className="flex-1 bg-route66-primary hover:bg-route66-primary/90 text-white py-3"
      >
        {isPlanning ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Planning Your Adventure...
          </>
        ) : (
          'Plan My Route 66 Trip'
        )}
      </Button>
      
      <Button
        onClick={onResetTrip}
        variant="outline"
        className="px-6"
      >
        Reset
      </Button>
    </div>
  );
};

export default ActionButtonsSection;
