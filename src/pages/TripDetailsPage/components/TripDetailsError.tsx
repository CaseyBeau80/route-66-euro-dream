
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripDetailsErrorProps {
  error: string;
  shareCode?: string;
  onBackToHome: () => void;
  onPlanNewTrip: () => void;
}

const TripDetailsError: React.FC<TripDetailsErrorProps> = ({ 
  error, 
  shareCode, 
  onBackToHome, 
  onPlanNewTrip 
}) => {
  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-route66-background rounded-xl shadow-lg border border-route66-border p-8">
            <h2 className="text-3xl font-bold text-route66-text-primary mb-4">Trip Not Found</h2>
            <p className="text-route66-text-secondary mb-6">
              {error || 'The requested trip could not be found. It may have been removed or the link is invalid.'}
            </p>
            {shareCode && (
              <p className="text-sm text-route66-text-muted mb-4">Requested Trip ID: {shareCode}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onPlanNewTrip}
                className="bg-route66-primary hover:bg-route66-rust text-white font-bold py-3 px-6 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Plan a New Trip
              </Button>
              <Button
                onClick={onBackToHome}
                variant="outline"
                className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold py-3 px-6 rounded-lg"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsError;
