
import React from 'react';

interface TripDetailsLoadingProps {
  shareCode?: string;
}

const TripDetailsLoading: React.FC<TripDetailsLoadingProps> = ({ shareCode }) => {
  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-route66-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-route66-text-primary mb-2">Loading Trip...</h2>
          <p className="text-route66-text-secondary">Please wait while we fetch your Route 66 adventure.</p>
          {shareCode && (
            <p className="text-sm text-route66-text-muted mt-2">Trip ID: {shareCode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsLoading;
