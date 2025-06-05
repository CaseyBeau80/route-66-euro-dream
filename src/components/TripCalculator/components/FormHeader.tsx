
import React from 'react';
import { MapPin } from 'lucide-react';

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
    <div className="text-center mb-6">
      <div className="flex justify-center items-center gap-2 mb-2">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Route 66 Trip Planner</h2>
      </div>
      <p className="text-gray-600">Plan your Mother Road adventure</p>
    </div>
  );
};

export default FormHeader;
