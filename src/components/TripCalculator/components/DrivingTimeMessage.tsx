
import React from 'react';
import { Clock, Car, MapPin } from 'lucide-react';
import { DrivingTimeMessageService } from '../services/utils/DrivingTimeMessageService';

interface DrivingTimeMessageProps {
  driveTimeHours: number;
}

const DrivingTimeMessage: React.FC<DrivingTimeMessageProps> = ({ driveTimeHours }) => {
  const messageData = DrivingTimeMessageService.getDrivingTimeMessage(driveTimeHours);
  const colorScheme = DrivingTimeMessageService.getLevelColorScheme(messageData.level);

  return (
    <div className={`${colorScheme.bgColor} ${colorScheme.borderColor} border-2 rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <div className={`${colorScheme.iconColor} text-2xl`}>
          {messageData.emoji}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${colorScheme.textColor} text-lg mb-2`}>
            {messageData.title}
          </h4>
          <p className={`${colorScheme.textColor} text-sm mb-3 leading-relaxed`}>
            {messageData.message}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${colorScheme.iconColor}`} />
              <span className={`text-xs ${colorScheme.textColor} font-semibold`}>
                {driveTimeHours.toFixed(1)} hours of driving today
              </span>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className={`h-4 w-4 ${colorScheme.iconColor} mt-0.5 flex-shrink-0`} />
              <div>
                <span className={`text-xs ${colorScheme.textColor} font-semibold block mb-1`}>
                  Today's Recommendations:
                </span>
                <ul className="space-y-1">
                  {messageData.recommendations.map((rec, index) => (
                    <li key={index} className={`text-xs ${colorScheme.textColor}`}>
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingTimeMessage;
