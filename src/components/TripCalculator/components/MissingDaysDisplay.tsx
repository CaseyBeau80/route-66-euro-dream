import React, { useState } from 'react';
import { AlertTriangle, Plus, Info, X, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MissingDaysDisplayProps {
  missingDays: number[];
  onGenerateMissingDays?: (days: number[]) => void;
  totalDays?: number;
  startCity?: string;
  endCity?: string;
}

const MissingDaysDisplay: React.FC<MissingDaysDisplayProps> = ({
  missingDays,
  onGenerateMissingDays,
  totalDays = 0,
  startCity,
  endCity
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Smart warning logic: For trips over 10 days, only show if more than 1 day is missing
  const shouldShowWarning = totalDays <= 10 ? missingDays.length > 0 : missingDays.length > 1;

  if (!shouldShowWarning || isDismissed) return null;

  const getMissingDayTooltip = () => {
    const missingCount = missingDays.length;
    const routeInfo = startCity && endCity ? ` between ${startCity} and ${endCity}` : '';
    
    if (missingCount === 1) {
      return `Don't worry! Day ${missingDays[0]} is missing because we're still perfecting our Route 66 planning for certain segments${routeInfo}. Your trip will still be amazing, and you can add your own plans for this day.`;
    } else if (missingCount === 2) {
      return `A couple of days (${missingDays.join(', ')}) are missing from your itinerary${routeInfo}. This often happens when destinations are very close together or far apart. Your adventure will still be incredible!`;
    } else if (missingCount <= 3) {
      return `A few days (${missingDays.join(', ')}) are missing from your itinerary${routeInfo}. This often happens when destinations are very close together or far apart. Your adventure will still be incredible!`;
    } else if (missingCount <= 5) {
      return `Some days are missing because there aren't enough major stops${routeInfo} for this trip length. Consider adjusting your trip duration or exploring different Route 66 segments for the best experience.`;
    } else {
      return `Many days are missing, which suggests this might be a longer adventure than our current Route 66 data supports. Try a shorter trip duration or different endpoints for optimal planning.`;
    }
  };

  const getQuickSuggestions = () => {
    const missingCount = missingDays.length;
    const suggestions = [];
    
    if (missingCount > totalDays * 0.3) {
      suggestions.push("Try shortening your trip by 2-3 days");
      suggestions.push("Consider different start/end cities");
    } else {
      suggestions.push("Explore nearby attractions on missing days");
      suggestions.push("Add your own Route 66 discoveries");
    }
    
    return suggestions;
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    toast({
      title: "Got it!",
      description: "You can always adjust your trip details if needed.",
    });
  };

  const handleGenerateDays = () => {
    if (onGenerateMissingDays) {
      onGenerateMissingDays(missingDays);
      toast({
        title: "Generating itinerary...",
        description: "We're working on filling in those missing days for you!",
      });
    }
  };

  const handleQuickFix = (action: string) => {
    toast({
      title: `${action} suggested`,
      description: "Try adjusting your trip settings above to improve the itinerary.",
    });
  };

  return (
    <div 
      className="flex flex-col gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in"
      role="alert"
      aria-live="polite"
      aria-label={`${missingDays.length} day${missingDays.length > 1 ? 's' : ''} missing from itinerary`}
    >
      {/* Main Warning */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertTriangle 
            className="h-4 w-4 animate-pulse" 
            aria-hidden="true"
          />
          <span className="font-medium">
            {missingDays.length === 1 
              ? `Day ${missingDays[0]} needs planning` 
              : `${missingDays.length} days need planning: ${missingDays.join(', ')}`
            }
          </span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="ml-1 p-0.5 rounded hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="More information about missing days"
              >
                <Info className="h-3 w-3 text-amber-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-3">
              <p className="text-sm leading-relaxed">{getMissingDayTooltip()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {/* Action Buttons */}
          {onGenerateMissingDays && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDays}
                  className="h-6 px-3 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 focus:ring-amber-400"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Auto-Fill
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Automatically generate plans for missing days</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowLearnMore(!showLearnMore)}
                className="p-1 rounded hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Learn more about trip planning"
                aria-expanded={showLearnMore}
              >
                <HelpCircle className="h-3 w-3 text-amber-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tips for better trip planning</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleDismiss}
                className="p-1 rounded hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Dismiss this warning"
              >
                <X className="h-3 w-3 text-amber-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dismiss this message</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Expandable Learn More Section */}
      {showLearnMore && (
        <div className="mt-2 p-3 bg-white border border-amber-200 rounded-md animate-accordion-down">
          <h4 className="font-medium text-amber-800 mb-2">Quick Tips:</h4>
          <ul className="space-y-1 text-xs text-amber-700">
            {getQuickSuggestions().map((suggestion, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="w-1 h-1 bg-amber-400 rounded-full" aria-hidden="true" />
                {suggestion}
              </li>
            ))}
            <li className="flex items-center gap-1">
              <span className="w-1 h-1 bg-amber-400 rounded-full" aria-hidden="true" />
              Route 66 has varying destination density along different segments
            </li>
          </ul>
          
          {/* Quick Fix Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFix("Shorten Trip")}
              className="h-6 px-2 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Shorten Trip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFix("Change Route")}
              className="h-6 px-2 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Change Route
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissingDaysDisplay;
