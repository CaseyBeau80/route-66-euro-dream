
import React from 'react';

const TravelTipsSection: React.FC = () => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        🛣️ ROUTE 66 TRAVEL TIPS
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-white rounded border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">📱 Planning</h4>
          <ul className="text-gray-600 space-y-1 text-xs">
            <li>• Download offline maps as cell service can be spotty</li>
            <li>• Book accommodations in advance, especially in summer</li>
            <li>• Check attraction hours before visiting</li>
          </ul>
        </div>
        <div className="p-3 bg-white rounded border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">🚗 Driving</h4>
          <ul className="text-gray-600 space-y-1 text-xs">
            <li>• Keep your gas tank at least half full</li>
            <li>• Pack emergency supplies and water</li>
            <li>• Take frequent breaks to avoid fatigue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelTipsSection;
