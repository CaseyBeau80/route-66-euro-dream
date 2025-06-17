
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
  if (!analysis.isCompleted && analysis.duplicateSegments.length === 0) {
    return null;
  }

  const getWarningConfig = () => {
    if (analysis.duplicateSegments.length > 0) {
      return {
        bgGradient: 'bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-900',
        accentColor: 'text-amber-700',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-200',
        badge: 'bg-amber-600 text-white',
        type: 'optimization'
      };
    }

    if (analysis.unusedDays > 2) {
      return {
        bgGradient: 'bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-900',
        accentColor: 'text-blue-700',
        icon: Info,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-200',
        badge: 'bg-blue-600 text-white',
        type: 'completed-early'
      };
    }

    return {
      bgGradient: 'bg-gradient-to-r from-green-100 via-green-50 to-emerald-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-900',
      accentColor: 'text-green-700',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-200',
      badge: 'bg-green-600 text-white',
      type: 'optimized'
    };
  };

  const config = getWarningConfig();
  const Icon = config.icon;

  const getHeadline = () => {
    if (analysis.duplicateSegments.length > 0) {
      return '🎯 Your Trip Has Been Optimized for a Better Experience';
    }
    if (analysis.unusedDays > 0) {
      return '✅ Great News! Your Route 66 Journey is Perfectly Planned';
    }
    return '✨ Trip Successfully Optimized';
  };

  const getMainExplanation = () => {
    const daysDifference = originalRequestedDays - analysis.totalUsefulDays;
    
    if (analysis.duplicateSegments.length > 0) {
      return `We've streamlined your ${originalRequestedDays}-day trip to ${analysis.totalUsefulDays} days by removing ${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} that would have included duplicate stops or backtracking. This optimization ensures you experience the authentic Route 66 journey without unnecessary repetition.`;
    }

    return `Your requested ${originalRequestedDays}-day trip has been optimized to ${analysis.totalUsefulDays} days. We've designed the perfect Route 66 experience that covers all the essential stops and attractions without stretching the journey unnecessarily.`;
  };

  const getBenefits = () => {
    const benefits = [];
    
    if (analysis.duplicateSegments.length > 0) {
      benefits.push('• No duplicate or redundant stops');
      benefits.push('• More time at each meaningful destination');
      benefits.push('• Logical progression along Route 66');
    } else {
      benefits.push('• Optimal daily driving distances');
      benefits.push('• Perfect balance of travel and exploration time');
      benefits.push('• Maximum Route 66 authenticity');
    }
    
    benefits.push('• Cost savings from fewer travel days');
    benefits.push('• Less fatigue and more enjoyment');
    
    return benefits;
  };

  return (
    <div className={`${config.bgGradient} border-2 ${config.borderColor} rounded-xl shadow-lg p-8 mb-8 mx-auto max-w-4xl`}>
      {/* Header with Icon and Badge */}
      <div className="flex items-start gap-6 mb-6">
        <div className={`${config.iconBg} rounded-full p-4 flex-shrink-0 shadow-md`}>
          <Icon className={`h-8 w-8 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`${config.badge} px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm`}>
              Trip Optimized
            </span>
          </div>
          
          <h3 className={`text-2xl font-bold ${config.textColor} mb-4 leading-tight`}>
            {getHeadline()}
          </h3>
          
          <p className={`text-lg ${config.accentColor} leading-relaxed mb-6`}>
            {getMainExplanation()}
          </p>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/60 rounded-lg p-5 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className={`h-5 w-5 ${config.accentColor}`} />
            <h4 className={`font-semibold ${config.textColor}`}>Original Request</h4>
          </div>
          <div className={`text-2xl font-bold ${config.textColor} mb-1`}>
            {originalRequestedDays} days
          </div>
          <p className={`text-sm ${config.accentColor}`}>
            Your initial trip duration
          </p>
        </div>
        
        <div className="bg-white/60 rounded-lg p-5 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className={`h-5 w-5 ${config.accentColor}`} />
            <h4 className={`font-semibold ${config.textColor}`}>Optimized Plan</h4>
          </div>
          <div className={`text-2xl font-bold ${config.textColor} mb-1`}>
            {analysis.totalUsefulDays} days
          </div>
          <p className={`text-sm ${config.accentColor}`}>
            Perfect Route 66 experience
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white/40 rounded-lg p-6 border border-white/50">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className={`h-5 w-5 ${config.accentColor}`} />
          <h4 className={`text-lg font-semibold ${config.textColor}`}>
            Why This Optimization Benefits Your Journey
          </h4>
        </div>
        
        <div className="grid md:grid-cols-2 gap-3">
          {getBenefits().map((benefit, index) => (
            <div key={index} className={`${config.accentColor} text-sm font-medium`}>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-6 pt-6 border-t border-white/30">
        <div className="flex items-center gap-2 justify-center">
          <Clock className={`h-4 w-4 ${config.accentColor}`} />
          <span className={`text-sm font-medium ${config.accentColor}`}>
            Your optimized {analysis.totalUsefulDays}-day Route 66 adventure is ready to begin!
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCompletionWarning;
