
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PreviewDayAttractionsProps {
  segment: DailySegment;
}

const PreviewDayAttractions: React.FC<PreviewDayAttractionsProps> = ({ segment }) => {
  if (!segment.attractions || segment.attractions.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Must-See Attractions
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {segment.attractions.slice(0, 6).map((attraction, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">
                {attraction.name}
              </div>
              {attraction.description && (
                <div className="text-sm text-gray-600 line-clamp-2">
                  {attraction.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {segment.attractions.length > 6 && (
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            +{segment.attractions.length - 6} more attractions
          </span>
        </div>
      )}
    </div>
  );
};

export default PreviewDayAttractions;
