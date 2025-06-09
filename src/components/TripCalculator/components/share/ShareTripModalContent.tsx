
import React from 'react';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import ShareTripOptions from './ShareTripOptions';
import ShareTripItineraryView from './ShareTripItineraryView';
import RambleBranding from '@/components/shared/RambleBranding';

interface ShareTripModalContentProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  currentShareUrl: string | null;
  isGeneratingLink: boolean;
  isTripComplete: boolean;
  onGenerateLink: () => Promise<string | null>;
  onCopyLink: () => Promise<void>;
  onShareViaEmail: () => Promise<void>;
  isSharedView?: boolean; // New prop to indicate if this is a shared view
}

const ShareTripModalContent: React.FC<ShareTripModalContentProps> = ({
  tripPlan,
  tripStartDate,
  currentShareUrl,
  isGeneratingLink,
  isTripComplete,
  onGenerateLink,
  onCopyLink,
  onShareViaEmail,
  isSharedView = false
}) => {
  if (!isTripComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium">Trip Not Complete</p>
          <p className="text-sm mt-2">Please create a trip plan first before sharing.</p>
        </div>
        <Button disabled className="opacity-50 cursor-not-allowed">
          Share Trip
        </Button>
      </div>
    );
  }

  const tripTitle = `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
  const totalDistance = tripPlan.segments?.reduce((sum, segment) => sum + (segment.distance || 0), 0) || 0;
  const totalDuration = tripPlan.segments?.reduce((sum, segment) => {
    const driveTime = segment.driveTimeHours || 0;
    return sum + driveTime;
  }, 0) || 0;

  return (
    <div className="bg-white text-black font-sans">
      {/* Header Section - Using RambleBranding component */}
      <div className="text-center mb-8 pb-6 border-b-2 border-blue-500">
        <div className="flex justify-center mb-4">
          <RambleBranding size="md" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{tripTitle}</h1>
        <p className="text-lg text-gray-600">{tripPlan.startCity} → {tripPlan.endCity}</p>
        <p className="text-sm text-gray-500 mt-2">
          Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          Planned with Ramble 66 - Your Route 66 Adventure Starts Here
        </p>
      </div>

      {/* Trip Overview Section - Matching PDF Style */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{tripPlan.totalDays}</div>
            <div className="text-sm text-gray-600">Days</div>
            <div className="text-xs text-gray-500 mt-1">
              {tripStartDate ? `Starting ${tripStartDate.toLocaleDateString()}` : 'Date not set'}
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(totalDistance)}</div>
            <div className="text-sm text-gray-600">Miles</div>
            <div className="text-xs text-gray-500 mt-1">Total Distance</div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{Math.round(totalDuration)}h</div>
            <div className="text-sm text-gray-600">Drive Time</div>
            <div className="text-xs text-gray-500 mt-1">Estimated</div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">☀️</div>
            <div className="text-sm text-gray-600">Weather</div>
            <div className="text-xs text-gray-500 mt-1">
              {tripStartDate ? 'Seasonal Estimates' : 'Set Date for Forecast'}
            </div>
          </div>
        </div>
      </div>

      {/* Legend Section - Matching PDF Style */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Legend & Icons:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Destination City</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🗺️</span>
            <span>Route Distance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600">⏱️</span>
            <span>Drive Time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">🏛️</span>
            <span>Historic Sites</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-600">☁️</span>
            <span>Weather Info</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">📅</span>
            <span>Date</span>
          </div>
        </div>
      </div>

      {/* Complete Daily Itinerary - Now intelligently handles weather display */}
      <div className="mb-8">
        <ShareTripItineraryView
          segments={tripPlan.segments || []}
          tripStartDate={tripStartDate}
          totalDays={tripPlan.totalDays}
          isSharedView={isSharedView}
        />
      </div>

      {/* Sharing Options - Only show in modal, not in shared view */}
      {!isSharedView && (
        <ShareTripOptions
          tripPlan={tripPlan}
          currentShareUrl={currentShareUrl}
          isGeneratingLink={isGeneratingLink}
          onGenerateLink={onGenerateLink}
          onCopyLink={onCopyLink}
          onShareViaEmail={onShareViaEmail}
        />
      )}

      {/* Footer - Matching PDF Style */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          Generated from Route 66 Trip Planner • 
          Visit <span className="text-blue-600">ramble66.com</span> to plan your own adventure
        </p>
        {currentShareUrl && !isSharedView && (
          <p className="mt-2 font-mono text-xs break-all text-blue-600">
            {currentShareUrl}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareTripModalContent;
