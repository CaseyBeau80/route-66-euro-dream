
import React from 'react';
import { JourneyStop, JourneyProgress } from '../types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';

interface JourneyMiniMapProps {
  stops: JourneyStop[];
  progress: JourneyProgress;
  onStopClick: (stopIndex: number) => void;
}

export const JourneyMiniMap: React.FC<JourneyMiniMapProps> = ({ 
  stops, 
  progress, 
  onStopClick 
}) => {
  return (
    <div className="fixed top-4 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="w-5 h-5 text-route66-primary" />
        <span className="font-semibold text-route66-text-primary">Route 66 Journey</span>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-route66-primary">
            {Math.round(progress.completedDistance)}
          </div>
          <div className="text-xs text-route66-text-secondary">Miles</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-route66-primary">
            {progress.currentStop + 1}/24
          </div>
          <div className="text-xs text-route66-text-secondary">Stops</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-route66-text-secondary mb-1">
          <span>Chicago</span>
          <span>Santa Monica</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-route66-primary to-route66-accent-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Current Stop Info */}
      <div className="mb-4 p-2 bg-route66-primary/10 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-route66-primary" />
          <span className="font-semibold text-sm text-route66-text-primary">
            Current: {stops[progress.currentStop]?.city || 'Chicago'}
          </span>
        </div>
        <div className="text-xs text-route66-text-secondary">
          {stops[progress.currentStop]?.state || 'Illinois'}
        </div>
      </div>

      {/* Quick Jump States */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-route66-text-secondary mb-2">Quick Jump:</div>
        {['Illinois', 'Missouri', 'Oklahoma', 'Texas', 'New Mexico', 'Arizona', 'California'].map((state, index) => {
          const stateStops = stops.filter(stop => stop.state === state);
          const firstStopIndex = stops.findIndex(stop => stop.state === state);
          const isCurrentState = stops[progress.currentStop]?.state === state;
          
          return (
            <button
              key={state}
              onClick={() => onStopClick(firstStopIndex)}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                isCurrentState 
                  ? 'bg-route66-primary text-white' 
                  : 'hover:bg-gray-100 text-route66-text-secondary'
              }`}
            >
              {state} ({stateStops.length} stops)
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-route66-text-secondary">
          Scroll horizontally or click states to navigate
        </div>
      </div>
    </div>
  );
};
