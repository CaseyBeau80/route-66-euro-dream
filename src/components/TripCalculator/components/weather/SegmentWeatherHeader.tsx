
import React from 'react';

interface SegmentWeatherHeaderProps {
  segmentEndCity: string;
  segmentDay: number;
  segmentDate: Date | null;
}

const SegmentWeatherHeader: React.FC<SegmentWeatherHeaderProps> = ({
  segmentEndCity,
  segmentDay,
  segmentDate
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-travel font-bold text-route66-vintage-brown">
        Weather in {segmentEndCity}
      </h4>
      <div className="text-xs text-route66-vintage-brown">
        Day {segmentDay}
        {segmentDate && (
          <div className="text-xs text-gray-600">
            {segmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SegmentWeatherHeader;
