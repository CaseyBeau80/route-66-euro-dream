
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface TripStyleHelperMessageProps {
  estimatedDays: number;
  actualDays: number;
}

const TripStyleHelperMessage: React.FC<TripStyleHelperMessageProps> = ({
  estimatedDays,
  actualDays
}) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 mt-3">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Notice:</strong> Your {actualDays}-day trip may result in long driving days (estimated {estimatedDays} days needed). 
        Consider using <strong>Balanced</strong> mode for more manageable daily distances, or extend your trip duration.
      </AlertDescription>
    </Alert>
  );
};

export default TripStyleHelperMessage;
