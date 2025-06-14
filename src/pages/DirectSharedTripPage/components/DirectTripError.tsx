
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DirectTripErrorProps {
  error?: string;
}

const DirectTripError: React.FC<DirectTripErrorProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="text-red-500 text-6xl mb-4">🚗💨</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Trip Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'Invalid trip data'}</p>
        <Button onClick={() => navigate('/trip-calculator')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Plan a New Trip
        </Button>
      </div>
    </div>
  );
};

export default DirectTripError;
