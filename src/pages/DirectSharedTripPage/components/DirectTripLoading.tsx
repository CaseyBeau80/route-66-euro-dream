
import React from 'react';

const DirectTripLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Your Route 66 Trip</h2>
        <p className="text-gray-500">Preparing live weather forecasts...</p>
      </div>
    </div>
  );
};

export default DirectTripLoading;
