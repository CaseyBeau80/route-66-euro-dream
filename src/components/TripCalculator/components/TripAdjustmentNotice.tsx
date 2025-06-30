
import React from 'react';
import { AlertTriangle, ArrowRight, Clock, Shield } from 'lucide-react';

interface TripAdjustmentNoticeProps {
  originalDays: number;
  actualDays: number;
  adjustmentMessage?: string;
  className?: string;
}

const TripAdjustmentNotice: React.FC<TripAdjustmentNoticeProps> = ({
  originalDays,
  actualDays,
  adjustmentMessage,
  className = ''
}) => {
  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="flex items-start gap-4">
        <div className="bg-amber-500 rounded-full p-3 animate-pulse">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Trip Duration Adjusted for Safety
          </h3>
          
          <div className="bg-white/70 rounded-lg p-4 mb-4 border border-amber-200">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center">
                <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold">{originalDays}</div>
                  <div className="text-sm">days requested</div>
                </div>
              </div>
              <ArrowRight className="h-8 w-8 text-amber-600 animate-bounce" />
              <div className="text-center">
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold">{actualDays}</div>
                  <div className="text-sm">days required</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-amber-800">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Why was this adjusted?</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  {adjustmentMessage || `Your requested ${originalDays} days would require driving more than 10 hours per day, which exceeds our safety limits.`}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2">✅ Your trip now includes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Maximum 10 hours of driving per day</li>
                <li>• Comfortable time at each destination</li>
                <li>• Safe and enjoyable travel experience</li>
                <li>• All major Route 66 heritage cities</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              Trip automatically optimized for safety and enjoyment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripAdjustmentNotice;
