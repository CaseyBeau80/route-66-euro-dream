
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

interface CostCalculatorBannerProps {
  onScrollToCalculator: () => void;
}

const CostCalculatorBanner: React.FC<CostCalculatorBannerProps> = ({
  onScrollToCalculator
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Get Your Trip Cost Estimate
            </h3>
            <p className="text-blue-700 text-sm">
              Plan your budget with our detailed cost calculator including gas, hotels, meals, and more
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-600">
            <DollarSign className="h-4 w-4" />
            <span>Free estimates</span>
            <TrendingUp className="h-4 w-4 ml-2" />
            <span>Budget planning</span>
          </div>
          
          <Button 
            onClick={onScrollToCalculator}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            Calculate Costs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CostCalculatorBanner;
