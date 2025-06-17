
import React from 'react';
import { AlertTriangle, CheckCircle, Info, MapPin, Calendar, Clock } from 'lucide-react';
import { TripCompletionAnalysis } from '../services/planning/TripCompletionService';

interface TripCompletionWarningProps {
  analysis: TripCompletionAnalysis;
  originalRequestedDays: number;
}

const TripCompletionWarning: React.FC<TripCompletionWarningProps> = ({
  analysis,
  originalRequestedDays
}) => {
  // Always show if there's optimization (completion or duplicates)
  if (!analysis.isCompleted && analysis.duplicateSegments.length === 0) {
    return null;
  }

  const daysDifference = originalRequestedDays - analysis.totalUsefulDays;
  
  // Don't show if no actual optimization occurred
  if (daysDifference <= 0) {
    return null;
  }

  const getWarningConfig = () => {
    if (analysis.duplicateSegments.length > 0) {
      return {
        bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
        borderColor: 'border-amber-400',
        textColor: 'text-amber-900',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100',
        badge: 'bg-amber-600 text-white',
        type: 'optimization'
      };
    }

    if (analysis.unusedDays > 2) {
      return {
        bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        borderColor: 'border-blue-400',
        textColor: 'text-blue-900',
        icon: Info,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        badge: 'bg-blue-600 text-white',
        type: 'completed-early'
      };
    }

    return {
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-900',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      badge: 'bg-green-600 text-white',
      type: 'optimized'
    };
  };

  const config = getWarningConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl shadow-lg p-8 mb-8 mx-auto max-w-5xl`}>
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-6">
        <div className={`${config.iconBg} rounded-full p-4 flex-shrink-0 shadow-md`}>
          <Icon className={`h-10 w-10 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className={`${config.badge} px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm`}>
              Trip Optimized
            </span>
          </div>
          
          <h2 className={`text-3xl font-bold ${config.textColor} mb-4 leading-tight`}>
            🎯 Your Route 66 Trip Has Been Optimized!
          </h2>
          
          <p className={`text-lg ${config.textColor} leading-relaxed mb-6 opacity-90`}>
            We've streamlined your {originalRequestedDays}-day trip to {analysis.totalUsefulDays} days by removing {daysDifference} {daysDifference === 1 ? 'day' : 'days'} that would have included duplicate stops or unnecessary backtracking. This ensures you experience the authentic Route 66 journey without repetition.
          </p>
        </div>
      </div>

      {/* Before/After Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/70 rounded-lg p-6 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className={`h-6 w-6 ${config.textColor} opacity-70`} />
            <h3 className={`font-bold ${config.textColor} text-lg`}>Original Request</h3>
          </div>
          <div className={`text-3xl font-bold ${config.textColor} mb-2`}>
            {originalRequestedDays} days
          </div>
          <p className={`text-sm ${config.textColor} opacity-70`}>
            Your initial trip duration
          </p>
        </div>
        
        <div className="bg-white/70 rounded-lg p-6 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className={`h-6 w-6 ${config.textColor} opacity-70`} />
            <h3 className={`font-bold ${config.textColor} text-lg`}>Optimized Plan</h3>
          </div>
          <div className={`text-3xl font-bold ${config.textColor} mb-2`}>
            {analysis.totalUsefulDays} days
          </div>
          <p className={`text-sm ${config.textColor} opacity-70`}>
            Perfect Route 66 experience
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white/50 rounded-lg p-6 border border-white/40">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className={`h-6 w-6 ${config.textColor} opacity-70`} />
          <h3 className={`text-xl font-bold ${config.textColor}`}>
            Why This Optimization Benefits Your Journey
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`${config.textColor} font-medium opacity-90`}>
            • No duplicate or redundant stops
          </div>
          <div className={`${config.textColor} font-medium opacity-90`}>
            • More time at each meaningful destination
          </div>
          <div className={`${config.textColor} font-medium opacity-90`}>
            • Logical progression along Route 66
          </div>
          <div className={`${config.textColor} font-medium opacity-90`}>
            • Cost savings from fewer travel days
          </div>
          <div className={`${config.textColor} font-medium opacity-90`}>
            • Less fatigue and more enjoyment
          </div>
          <div className={`${config.textColor} font-medium opacity-90`}>
            • Maximum Route 66 authenticity
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-6 pt-6 border-t border-white/30">
        <div className="flex items-center gap-2 justify-center">
          <Clock className={`h-5 w-5 ${config.textColor} opacity-70`} />
          <span className={`text-lg font-semibold ${config.textColor} opacity-90`}>
            Your optimized {analysis.totalUsefulDays}-day Route 66 adventure is ready to begin! 🚗
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCompletionWarning;
