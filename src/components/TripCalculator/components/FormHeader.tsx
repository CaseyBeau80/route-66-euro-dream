
import React from 'react';
import { MapPin, Route, Calendar } from 'lucide-react';

interface FormHeaderProps {
  onCalculate: () => void;
  isFormValid: boolean;
  isCalculating: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  onCalculate,
  isFormValid,
  isCalculating
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Route className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Route 66 Trip Planner</h2>
          <MapPin className="h-8 w-8" />
        </div>
        
        <p className="text-blue-100 text-lg mb-4">
          Plan your perfect Mother Road adventure from Chicago to Santa Monica
        </p>
        
        <div className="flex justify-center items-center gap-6 text-sm text-blue-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Custom dates & duration</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Historic Route 66 stops</span>
          </div>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span>Optimized daily segments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
