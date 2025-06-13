
import React from 'react';
import { MapPin, Route, Calendar, Clock } from 'lucide-react';

interface ItineraryPreLoaderProps {
  progress?: number;
  currentStep?: string;
  totalSegments?: number;
  loadedSegments?: number;
}

const ItineraryPreLoader: React.FC<ItineraryPreLoaderProps> = ({
  progress = 0,
  currentStep = 'Preparing your Route 66 adventure...',
  totalSegments = 0,
  loadedSegments = 0
}) => {
  const roadSteps = [
    'Planning your historic journey...',
    'Loading Route 66 destinations...',
    'Preparing weather forecasts...',
    'Calculating travel segments...',
    'Finalizing your adventure...'
  ];

  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [displayStep, setDisplayStep] = React.useState(roadSteps[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = (prev + 1) % roadSteps.length;
        setDisplayStep(roadSteps[next]);
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg border border-blue-200">
      {/* Route 66 Shield Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-b from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg transform rotate-45 border-4 border-white">
          <div className="transform -rotate-45">
            <Route className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
          66
        </div>
      </div>

      {/* Main Loading Message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Building Your Route 66 Itinerary
      </h2>
      
      {/* Dynamic Step Message */}
      <p className="text-gray-600 mb-6 text-center animate-fade-in transition-all duration-500">
        {currentStep || displayStep}
      </p>

      {/* Route 66 Themed Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden border-2 border-gray-300">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-orange-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
          {/* Road stripes animation */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-full h-full bg-repeat-x animate-pulse opacity-30"
                 style={{
                   backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 45%, white 45%, white 55%, transparent 55%, transparent 100%)',
                   backgroundSize: '20px 100%'
                 }}
            />
          </div>
        </div>
        
        {/* Progress Text */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Getting Started</span>
          <span>{Math.round(progressPercentage)}%</span>
          <span>Ready to Go!</span>
        </div>
      </div>

      {/* Segments Loading Indicator */}
      {totalSegments > 0 && (
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          <span>Loading segments: {loadedSegments} of {totalSegments}</span>
        </div>
      )}

      {/* Loading Animation Icons */}
      <div className="flex items-center gap-6 text-gray-400">
        <div className="animate-pulse">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="animate-pulse animation-delay-200">
          <Route className="w-6 h-6" />
        </div>
        <div className="animate-pulse animation-delay-400">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Mother Road Quote */}
      <div className="mt-8 text-center">
        <p className="text-sm italic text-gray-500 max-w-md">
          "The road is life" - preparing your journey along America's Mother Road
        </p>
      </div>
    </div>
  );
};

export default ItineraryPreLoader;
