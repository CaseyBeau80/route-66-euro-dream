
import React from 'react';
import { Button } from '@/components/ui/button';
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
      <Button 
        onClick={onCalculate}
        disabled={!isFormValid || isCalculating}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg"
      >
        {isCalculating ? 'Planning...' : 'Start Planning Your Trip'}
      </Button>
    </div>
  );
};

export default FormHeader;
