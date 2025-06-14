
import React, { useState, useEffect } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { MapPin, Clock, Route as RouteIcon } from 'lucide-react';

interface TripLoadingDisplayProps {
  formData: TripFormData;
}

const TripLoadingDisplay: React.FC<TripLoadingDisplayProps> = ({ formData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { 
      icon: RouteIcon, 
      title: 'Analyzing Route', 
      description: 'Calculating the best path along Route 66'
    },
    { 
      icon: MapPin, 
      title: 'Finding Attractions', 
      description: 'Discovering must-see stops and hidden gems'
    },
    { 
      icon: Clock, 
      title: 'Planning Schedule', 
      description: 'Creating your perfect daily itinerary'
    }
  ];

  useEffect(() => {
    console.log('⏳ TripLoadingDisplay: Starting loading sequence');
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = (prev + 1) % steps.length;
        console.log(`⏳ Loading step: ${next + 1}/${steps.length}`);
        return next;
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 95);
        return newProgress;
      });
    }, 300);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="p-8 text-center">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-route66-primary mb-2">
          Planning Your Route 66 Adventure
        </h2>
        <p className="text-route66-text-secondary">
          Creating the perfect itinerary from {formData.startLocation} to {formData.endLocation}
        </p>
      </div>

      {/* Loading Animation */}
      <div className="mb-8">
        <div className="bg-route66-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <IconComponent className="w-10 h-10 text-route66-primary animate-pulse" />
        </div>
        
        <h3 className="text-lg font-semibold text-route66-text-primary mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-route66-text-secondary">
          {currentStepData.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-route66-border rounded-full h-2 overflow-hidden">
          <div 
            className="bg-route66-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-route66-text-secondary mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Trip Details Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="bg-route66-background-alt p-3 rounded-lg">
          <div className="text-lg font-bold text-route66-primary">{formData.travelDays}</div>
          <div className="text-sm text-route66-text-secondary">Days</div>
        </div>
        <div className="bg-route66-background-alt p-3 rounded-lg">
          <div className="text-lg font-bold text-route66-primary">
            {formData.tripStyle === 'balanced' ? 'Balanced' : 'Focused'}
          </div>
          <div className="text-sm text-route66-text-secondary">Style</div>
        </div>
        <div className="bg-route66-background-alt p-3 rounded-lg">
          <div className="text-lg font-bold text-route66-primary">
            {formData.tripStartDate?.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }) || 'TBD'}
          </div>
          <div className="text-sm text-route66-text-secondary">Start</div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Did you know?</h4>
          <p className="text-blue-700 text-sm">
            Route 66 was one of the original highways in the U.S. Highway System, 
            established in 1926 and stretching 2,448 miles from Chicago to Los Angeles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripLoadingDisplay;
