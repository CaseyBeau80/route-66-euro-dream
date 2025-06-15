
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, X, DollarSign } from 'lucide-react';

interface FloatingCostPromptProps {
  onScrollToCalculator: () => void;
}

const FloatingCostPrompt: React.FC<FloatingCostPromptProps> = ({
  onScrollToCalculator
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;

      const tripResults = document.getElementById('trip-results');
      const costEstimator = document.getElementById('cost-estimator-section');
      
      if (tripResults && costEstimator) {
        const tripResultsRect = tripResults.getBoundingClientRect();
        const costEstimatorRect = costEstimator.getBoundingClientRect();
        
        // Show prompt when user has scrolled past the cost estimator and is viewing trip results
        const shouldShow = tripResultsRect.top < window.innerHeight * 0.5 && 
                          costEstimatorRect.bottom < 0;
        
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleCalculateClick = () => {
    onScrollToCalculator();
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-white border border-blue-200 rounded-xl shadow-lg p-4 max-w-sm mx-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calculator className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900 text-sm">Budget Planning</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">
          Want to know how much your Route 66 adventure will cost?
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCalculateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 flex-1"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Get Cost Estimate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCostPrompt;
