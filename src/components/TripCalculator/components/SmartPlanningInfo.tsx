
import React from 'react';
import { MapPin } from 'lucide-react';

const SmartPlanningInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-blue-800 mb-2">
        <MapPin className="h-5 w-5" />
        <span className="font-semibold">Smart Planning:</span>
      </div>
      <p className="text-sm text-blue-700">
        Our planner uses real Route 66 attractions, hidden gems, and historic stops from our database to create an 
        authentic road trip experience!
      </p>
    </div>
  );
};

export default SmartPlanningInfo;
