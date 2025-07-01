
import React from 'react';
import { AlertTriangle, Clock, ArrowRight, X, CheckCircle, Loader2 } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';

interface DayAdjustmentInfo {
  requested: number;
  minimum: number;
  reason: string;
}

interface TwoPhasePlanningModalProps {
  isOpen: boolean;
  dayAdjustmentInfo: DayAdjustmentInfo;
  formData: TripFormData;
  onAcknowledge: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const TwoPhasePlanningModal: React.FC<TwoPhasePlanningModalProps> = ({
  isOpen,
  dayAdjustmentInfo,
  formData,
  onAcknowledge,
  onCancel,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  console.log('🎭 TwoPhasePlanningModal: Rendering with processing state:', isProcessing);

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-4 border-amber-500">
        {/* Header */}
        <div className={`${isProcessing ? 'bg-green-600' : 'bg-amber-600'} text-white p-6 text-center`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
              <AlertTriangle className="h-12 w-12" />
            )}
            <h1 className="text-4xl font-black">
              {isProcessing ? 'PLANNING YOUR TRIP' : 'TRIP ADJUSTMENT NEEDED'}
            </h1>
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
              <AlertTriangle className="h-12 w-12" />
            )}
          </div>
          <p className="text-2xl font-bold">
            {isProcessing 
              ? `Planning your ${dayAdjustmentInfo.minimum}-day Route 66 adventure...` 
              : 'We need to adjust your trip duration for safety'
            }
          </p>
        </div>

        {/* Show planning content when processing */}
        {isProcessing && (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Loader2 className="h-16 w-16 animate-spin text-green-600" />
              <div className="text-3xl font-bold text-gray-800">
                Creating your {dayAdjustmentInfo.minimum}-day Route 66 itinerary...
              </div>
            </div>
            
            <div className="bg-green-50 border-4 border-green-300 rounded-xl p-8 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <p className="text-2xl font-bold text-green-800">
                  Trip Successfully Adjusted!
                </p>
              </div>
              <p className="text-xl text-green-700 mb-4">
                ✅ Your trip has been optimized to <strong>{dayAdjustmentInfo.minimum} days</strong> for the perfect Route 66 experience!
              </p>
              <p className="text-lg text-green-600">
                🗺️ Now calculating your route with comfortable driving distances...
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">What We're Planning:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-3 text-blue-700">
                  <span className="text-2xl">🛣️</span>
                  <span><strong>Safe 300-mile daily drives</strong></span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <span className="text-2xl">🏛️</span>
                  <span><strong>Heritage city stops</strong></span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <span className="text-2xl">⛽</span>
                  <span><strong>Strategic gas & rest stops</strong></span>
                </div>
                <div className="flex items-center gap-3 text-blue-700">
                  <span className="text-2xl">📸</span>
                  <span><strong>Photo-worthy attractions</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show adjustment content when not processing */}
        {!isProcessing && (
          <div className="p-8">
            {/* Before/After Comparison */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Here's What Needs to Change:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* What you entered */}
                <div className="text-center">
                  <div className="bg-red-100 border-4 border-red-400 rounded-xl p-6 mb-4">
                    <p className="text-lg font-bold text-red-700 mb-2">YOU ENTERED:</p>
                    <div className="text-7xl font-black text-red-600">{dayAdjustmentInfo.requested}</div>
                    <p className="text-2xl font-bold text-red-700">DAYS</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full p-4 inline-block">
                    <ArrowRight className="h-12 w-12 text-yellow-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-700 mt-2">NEEDS TO BE</p>
                </div>
                
                {/* What we need to change it to */}
                <div className="text-center">
                  <div className="bg-green-100 border-4 border-green-400 rounded-xl p-6 mb-4">
                    <p className="text-lg font-bold text-green-700 mb-2">RECOMMENDED:</p>
                    <div className="text-7xl font-black text-green-600">{dayAdjustmentInfo.minimum}</div>
                    <p className="text-2xl font-bold text-green-700">DAYS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 border-4 border-blue-300 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Clock className="h-10 w-10 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    Why We Need to Adjust Your {dayAdjustmentInfo.requested}-Day Trip:
                  </h3>
                  <div className="text-lg text-blue-800 space-y-4">
                    <p className="leading-relaxed">
                      🗺️ <strong>Your route from {formData.startLocation} to {formData.endLocation}</strong> is approximately <strong>{Math.round(dayAdjustmentInfo.minimum * 300)} miles</strong>.
                    </p>
                    <p className="leading-relaxed">
                      ⚠️ With only <strong>{dayAdjustmentInfo.requested} days</strong>, you would need to drive <strong className="text-red-700">{Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day</strong>.
                    </p>
                    <p className="leading-relaxed">
                      🚗 That's over <strong className="text-red-700">{Math.round(((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested) / 50)} hours of driving per day</strong> - which exceeds our safety limits!
                    </p>
                    <p className="leading-relaxed font-bold text-green-800">
                      ✅ With <strong>{dayAdjustmentInfo.minimum} days</strong>, you'll drive a comfortable <strong>300 miles (6 hours) per day</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 border-4 border-green-300 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-8 w-8" />
                Your {dayAdjustmentInfo.minimum}-Day Trip Will Be MUCH Better:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">🛡️</span>
                  <span><strong>Safe driving times</strong> (6 hours/day max)</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">🎯</span>
                  <span><strong>More time at attractions</strong> and stops</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">😌</span>
                  <span><strong>Relaxed pace</strong> - no rushing</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">📸</span>
                  <span><strong>Better photo opportunities</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onAcknowledge}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <CheckCircle className="h-6 w-6" />
                Yes, Plan My {dayAdjustmentInfo.minimum}-Day Trip!
              </button>
              
              <button 
                onClick={onCancel}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <X className="h-6 w-6" />
                Let Me Change My Plans
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoPhasePlanningModal;
