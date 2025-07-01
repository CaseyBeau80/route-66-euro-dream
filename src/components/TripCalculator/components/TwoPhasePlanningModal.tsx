
import React from 'react';
import { AlertTriangle, Clock, ArrowRight, CheckCircle, MapPin, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormValidation } from '../hooks/useFormValidation';
import { TripFormData } from '../types/tripCalculator';
import { TwoPhasePlanningState } from '../hooks/useTwoPhasePlanning';

interface TwoPhasePlanningModalProps {
  formData: TripFormData;
  planningState: TwoPhasePlanningState;
  onAcknowledge: () => void;
  onProceedWithPlanning: () => void;
  onClose: () => void;
}

const TwoPhasePlanningModal: React.FC<TwoPhasePlanningModalProps> = ({
  formData,
  planningState,
  onAcknowledge,
  onProceedWithPlanning,
  onClose
}) => {
  const { dayAdjustmentInfo } = useFormValidation(formData);

  if (!planningState.showModal || !dayAdjustmentInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-4 border-red-500">
        
        {/* HEADER */}
        <div className="bg-red-600 text-white p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <AlertTriangle className="h-12 w-12" />
            <h1 className="text-4xl font-black">
              {planningState.phase === 'acknowledgment' ? 'TRIP ADJUSTMENT NEEDED' : 
               planningState.phase === 'planning' ? 'PLANNING YOUR TRIP' : 'COMPLETE'}
            </h1>
            <AlertTriangle className="h-12 w-12" />
          </div>
          <p className="text-2xl font-bold">
            {planningState.phase === 'acknowledgment' ? 'We adjusted your trip duration for safety' :
             planningState.phase === 'planning' ? 'Creating your Route 66 adventure...' : 'Trip planning complete!'}
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          
          {/* ACKNOWLEDGMENT PHASE */}
          {planningState.phase === 'acknowledgment' && (
            <>
              {/* BEFORE/AFTER COMPARISON */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                  Here's What We Changed:
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center">
                    <div className="bg-red-100 border-4 border-red-400 rounded-xl p-6 mb-4">
                      <p className="text-lg font-bold text-red-700 mb-2">YOU ENTERED:</p>
                      <div className="text-7xl font-black text-red-600">{dayAdjustmentInfo.requested}</div>
                      <p className="text-2xl font-bold text-red-700">DAYS</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full p-4 inline-block">
                      <ArrowRight className="h-12 w-12 text-yellow-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-700 mt-2">CHANGED TO</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 border-4 border-green-400 rounded-xl p-6 mb-4">
                      <p className="text-lg font-bold text-green-700 mb-2">WE CHANGED TO:</p>
                      <div className="text-7xl font-black text-green-600">{dayAdjustmentInfo.minimum}</div>
                      <p className="text-2xl font-bold text-green-700">DAYS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPLANATION */}
              <div className="bg-blue-50 border-4 border-blue-300 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <Clock className="h-10 w-10 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      Why We Changed Your {dayAdjustmentInfo.requested}-Day Trip:
                    </h3>
                    <div className="text-lg text-blue-800 space-y-4">
                      <p>🗺️ Your route from <strong>{formData.startLocation}</strong> to <strong>{formData.endLocation}</strong> is approximately <strong>{Math.round(dayAdjustmentInfo.minimum * 300)} miles</strong>.</p>
                      <p>⚠️ With only <strong>{dayAdjustmentInfo.requested} days</strong>, you would need to drive <strong className="text-red-700">{Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day</strong>.</p>
                      <p>✅ With <strong>{dayAdjustmentInfo.minimum} days</strong>, you'll drive a comfortable <strong className="text-green-700">300 miles per day</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="text-center space-y-4">
                {!planningState.userAcknowledgedAdjustment && (
                  <Button
                    onClick={onAcknowledge}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <CheckCircle className="h-6 w-6 mr-2" />
                    I Understand - Use {dayAdjustmentInfo.minimum} Days
                  </Button>
                )}
                
                {planningState.userAcknowledgedAdjustment && (
                  <Button
                    onClick={onProceedWithPlanning}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <MapPin className="h-6 w-6 mr-2" />
                    Plan My {dayAdjustmentInfo.minimum}-Day Trip
                  </Button>
                )}
              </div>
            </>
          )}

          {/* PLANNING PHASE */}
          {planningState.phase === 'planning' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-800">Creating Your Route 66 Adventure</h2>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <p className="text-xl text-blue-800 mb-4">
                  Planning your amazing {dayAdjustmentInfo.minimum}-day Route 66 trip...
                </p>
                <div className="w-full bg-blue-200 rounded-full h-4">
                  <div className="bg-blue-600 h-4 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
              
              <p className="text-lg text-gray-600">
                This will take just a moment. Please don't close this window.
              </p>
            </div>
          )}

          {/* COMPLETE PHASE */}
          {planningState.phase === 'complete' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <h2 className="text-3xl font-bold text-green-800">Trip Planning Complete!</h2>
              </div>
              
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
                <p className="text-xl text-green-800">
                  Your {dayAdjustmentInfo.minimum}-day Route 66 adventure is ready!
                </p>
              </div>
              
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl font-bold rounded-lg"
              >
                View My Trip Plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoPhasePlanningModal;
