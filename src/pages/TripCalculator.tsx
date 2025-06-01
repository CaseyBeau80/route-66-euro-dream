
import React from 'react';
import Route66TripCalculator from '../components/Route66TripCalculator';

const TripCalculator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige vintage-paper-texture">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="font-route66 text-4xl md:text-5xl text-route66-vintage-red mb-4">
            PLAN YOUR ROUTE 66 ADVENTURE
          </h1>
          <p className="font-travel text-xl text-route66-vintage-brown max-w-2xl mx-auto">
            Calculate distances, drive times, and plan the perfect Mother Road journey 
            from Chicago to Santa Monica
          </p>
        </div>
        
        <Route66TripCalculator />
      </div>
    </div>
  );
};

export default TripCalculator;
