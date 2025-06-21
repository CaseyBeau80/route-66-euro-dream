
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, MapPin, Sparkles } from 'lucide-react';
import { OptimizationSuggestion } from '../services/validation/TripValidationService';

interface TripOptimizationSuggestionsProps {
  suggestions: OptimizationSuggestion[];
  onSuggestionClick: (suggestion: OptimizationSuggestion) => void;
  className?: string;
}

const TripOptimizationSuggestions: React.FC<TripOptimizationSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  className = ''
}) => {
  if (suggestions.length === 0) return null;

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'increase_days':
      case 'decrease_days':
        return <Calendar className="h-4 w-4" />;
      case 'change_cities':
        return <MapPin className="h-4 w-4" />;
      case 'optimize_route':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50 hover:bg-red-100';
      case 'medium': return 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100';
      case 'low': return 'border-blue-300 bg-blue-50 hover:bg-blue-100';
      default: return 'border-gray-300 bg-gray-50 hover:bg-gray-100';
    }
  };

  const getButtonColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'medium': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'low': return 'bg-blue-600 hover:bg-blue-700 text-white';
      default: return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  // Sort by priority
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Optimization Suggestions
      </h4>
      
      {sortedSuggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`border rounded-lg p-4 transition-colors ${getSuggestionColor(suggestion.priority)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getSuggestionIcon(suggestion.type)}
                <h5 className="font-semibold text-sm text-gray-800">
                  {suggestion.title}
                </h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  suggestion.priority === 'high' ? 'bg-red-200 text-red-800' :
                  suggestion.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {suggestion.description}
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => onSuggestionClick(suggestion)}
            size="sm"
            className={`${getButtonColor(suggestion.priority)} transition-colors`}
          >
            Apply Suggestion
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TripOptimizationSuggestions;
