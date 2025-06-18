
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Route, Sparkles } from 'lucide-react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';

interface TripLoadingDisplayProps {
  formData: TripFormData;
}

const TripLoadingDisplay: React.FC<TripLoadingDisplayProps> = ({ formData }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { 
      icon: MapPin, 
      title: "Finding Route 66 Heritage Cities", 
      description: "Locating iconic destinations between your start and end points...",
      duration: 2000
    },
    { 
      icon: Route, 
      title: "Optimizing Drive Times", 
      description: "Creating balanced daily segments with maximum 10-hour drives...",
      duration: 2500
    },
    { 
      icon: Clock, 
      title: "Calculating Heritage Priorities", 
      description: "Prioritizing must-see Route 66 landmarks and attractions...",
      duration: 2000
    },
    { 
      icon: Sparkles, 
      title: "Finalizing Your Adventure", 
      description: "Putting together your perfect Route 66 heritage experience...",
      duration: 1500
    }
  ];

  useEffect(() => {
    const totalSteps = steps.length;
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const overallProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(overallProgress);

      // Update current step based on elapsed time
      let currentStepIndex = 0;
      let stepStart = 0;
      for (let i = 0; i < steps.length; i++) {
        const stepEnd = stepStart + steps[i].duration;
        if (elapsed >= stepStart && elapsed < stepEnd) {
          currentStepIndex = i;
          break;
        }
        stepStart = stepEnd;
        if (i === steps.length - 1) {
          currentStepIndex = i;
        }
      }
      setCurrentStep(currentStepIndex);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const currentStepData = steps[currentStep];
  const CurrentIcon = currentStepData.icon;

  // Display trip style information
  const tripStyleInfo = formData.tripStyle === 'destination-focused' 
    ? {
        title: 'Heritage Cities Experience',
        description: 'Focusing on iconic Route 66 destinations with optimized drive times',
        features: ['Heritage cities priority', 'Max 10h daily drives', 'Iconic landmarks']
      }
    : {
        title: 'Heritage Cities Experience',
        description: 'Focusing on iconic Route 66 destinations with optimized drive times',
        features: ['Heritage cities priority', 'Max 10h daily drives', 'Iconic landmarks']
      };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="max-w-2xl mx-auto border-blue-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center justify-center gap-2">
            <Route className="h-6 w-6 animate-pulse" />
            Planning Your Route 66 Adventure
          </CardTitle>
          <p className="text-blue-600 mt-2">
            {formData.startLocation} → {formData.endLocation} • {formData.travelDays} days
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Trip Style Info */}
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">{tripStyleInfo.title}</h3>
            <p className="text-sm text-blue-600 mb-3">{tripStyleInfo.description}</p>
            <div className="flex flex-wrap gap-2">
              {tripStyleInfo.features.map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-blue-600">
              <span>Planning Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-blue-100" />
          </div>

          {/* Current Step */}
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CurrentIcon className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-1">
                  {currentStepData.title}
                </h4>
                <p className="text-sm text-blue-600">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div 
                  key={index} 
                  className={`flex flex-col items-center space-y-1 ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive ? 'bg-blue-100 animate-pulse' : 
                    isCompleted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-center font-medium">
                    Step {index + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Fun Facts */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <p className="text-sm text-orange-800 font-medium mb-1">
              💡 Did you know?
            </p>
            <p className="text-xs text-orange-700">
              Route 66 spans 2,448 miles across 8 states and features over 200 heritage sites. 
              We're finding the perfect ones for your {formData.travelDays}-day adventure!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripLoadingDisplay;
