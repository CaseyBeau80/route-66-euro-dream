
import React from 'react';
import Route66TripCalculator from '../../Route66TripCalculator';
import ErrorBoundary from './ErrorBoundary';

const SafeTripCalculator: React.FC = () => {
  return (
    <ErrorBoundary context="Route66TripCalculator" fallback={
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center space-y-4 bg-route66-cream border border-route66-tan rounded-lg p-8">
          <h2 className="text-xl font-route66 text-route66-vintage-brown">
            Trip Calculator Temporarily Unavailable
          </h2>
          <p className="text-route66-vintage-brown">
            We're experiencing technical difficulties with the trip calculator. 
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-route66-primary text-white rounded hover:bg-route66-primary-dark transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    }>
      <Route66TripCalculator />
    </ErrorBoundary>
  );
};

export default SafeTripCalculator;
