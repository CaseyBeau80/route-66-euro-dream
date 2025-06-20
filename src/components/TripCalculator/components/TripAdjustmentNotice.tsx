
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, MapPin, Clock, Route } from 'lucide-react';
import { TripAdjustmentNotice as TripAdjustmentNoticeType } from '../services/planning/TripAdjustmentService';

interface TripAdjustmentNoticeProps {
  notice: TripAdjustmentNoticeType;
  className?: string;
}

const TripAdjustmentNotice: React.FC<TripAdjustmentNoticeProps> = ({ 
  notice, 
  className = '' 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getIconAndColors = () => {
    switch (notice.type) {
      case 'warning':
        return {
          icon: <Clock className="h-5 w-5" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          textColor: 'text-amber-700'
        };
      case 'error':
        return {
          icon: <Route className="h-5 w-5" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          textColor: 'text-red-700'
        };
      default: // 'info'
        return {
          icon: <MapPin className="h-5 w-5" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        };
    }
  };

  const { icon, bgColor, borderColor, iconColor, titleColor, textColor } = getIconAndColors();

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`${titleColor} font-semibold text-sm mb-1`}>
            {notice.title}
          </h4>
          
          <p className={`${textColor} text-sm leading-relaxed`}>
            {notice.message}
          </p>
          
          {notice.details && notice.details.length > 0 && (
            <>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`${textColor} hover:${titleColor} text-xs font-medium mt-2 flex items-center gap-1 transition-colors`}
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    View details
                  </>
                )}
              </button>
              
              {showDetails && (
                <div className="mt-3 space-y-1">
                  {notice.details.map((detail, index) => (
                    <div key={index} className={`${textColor} text-xs flex items-start gap-2`}>
                      <span className="text-xs mt-0.5">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripAdjustmentNotice;
