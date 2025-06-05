
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface PlanButtonSectionProps {
  onPlanTrip: () => void;
  isFormValid: boolean;
  isPlanning: boolean;
}

const PlanButtonSection: React.FC<PlanButtonSectionProps> = ({
  onPlanTrip,
  isFormValid,
  isPlanning
}) => {
  const hasApiKey = GoogleDistanceMatrixService.isAvailable();

  return (
    <>
      {/* Plan Button */}
      <Button
        onClick={onPlanTrip}
        disabled={!isFormValid || isPlanning}
        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3"
      >
        {isPlanning ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Planning Your Route 66 Adventure...
          </>
        ) : (
          'Start Planning Your Trip'
        )}
      </Button>

      {/* Info */}
      <div className="bg-[#f1f5f9] p-4 rounded-lg border border-[#e2e8f0]">
        <p className="text-sm text-[#1e293b] text-center">
          🚗 <strong>Smart Planning:</strong> Our planner uses {hasApiKey ? 'Google Maps API for precise' : 'geographic calculations for estimated'} distances 
          and Route 66 destination cities to create an authentic road trip experience!
        </p>
      </div>
    </>
  );
};

export default PlanButtonSection;
