
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';
import { format } from 'date-fns';

interface SharedTripContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  isSharedView?: boolean;
}

const SharedTripContentRenderer: React.FC<SharedTripContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isSharedView = true
}) => {
  console.log('🔥 FIXED: SharedTripContentRenderer rendering with live weather priority:', {
    segmentsCount: tripPlan.segments?.length || 0,
    hasStartDate: !!tripStartDate,
    isSharedView,
    forceEnableLiveWeather: true
  });

  // CRITICAL FIX: Force enable live weather for all shared views
  React.useEffect(() => {
    // Override URL parameter to ensure live weather is enabled
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get('useLiveWeather') !== 'true') {
      currentUrl.searchParams.set('useLiveWeather', 'true');
      window.history.replaceState({}, '', currentUrl.toString());
      console.log('🔥 FIXED: SharedTripContentRenderer - Forced live weather in URL:', currentUrl.toString());
    }
  }, []);

  if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Trip Data Available</h2>
        <p className="text-gray-500">This trip plan appears to be empty or invalid.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Trip Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tripPlan.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">📍 Route:</span>
            <span>{tripPlan.startCity} → {tripPlan.endCity}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">📅 Duration:</span>
            <span>{tripPlan.totalDays} days</span>
          </div>
          {tripStartDate && (
            <div className="flex items-center gap-2">
              <span className="font-medium">🗓️ Start Date:</span>
              <span>{format(tripStartDate, 'MMMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <span>🟢 Live Weather Forecasts</span>
          </div>
        </div>
      </div>

      {/* Daily Segments */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Itinerary</h2>
        
        {tripPlan.segments.map((segment, index) => (
          <div key={segment.day} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Day {segment.day}: {segment.startCity} → {segment.endCity}
                </h3>
                <p className="text-gray-600 mt-1">
                  {Math.round(segment.distance)} miles • {segment.driveTimeHours} hours driving
                </p>
              </div>
            </div>

            {/* Attractions */}
            {segment.attractions && segment.attractions.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Key Attractions:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {segment.attractions.map((attraction, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{attraction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CRITICAL FIX: Weather Widget with forced live weather */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Weather Forecast:</h4>
              <SegmentWeatherWidget
                segment={segment}
                tripStartDate={tripStartDate}
                isSharedView={true}
                isPDFExport={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Share Information */}
      {shareUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Share This Trip</h3>
          <p className="text-blue-700 text-sm mb-3">
            Anyone with this link can view your complete Route 66 itinerary with live weather forecasts.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded bg-white"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedTripContentRenderer;
