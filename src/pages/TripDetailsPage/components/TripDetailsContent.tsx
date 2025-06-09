
import React from 'react';
import { SavedTrip } from '@/components/TripCalculator/services/TripService';
import ShareTripModalContent from '@/components/TripCalculator/components/share/ShareTripModalContent';
import { toast } from '@/hooks/use-toast';

interface TripDetailsContentProps {
  trip: SavedTrip;
  shareUrl: string;
}

const TripDetailsContent: React.FC<TripDetailsContentProps> = ({
  trip,
  shareUrl
}) => {
  // Check if trip is complete
  const isTripComplete = trip.trip_data && trip.trip_data.segments && trip.trip_data.segments.length > 0;

  const handleGenerateLink = async (): Promise<string | null> => {
    // Return existing share URL since this is already a shared trip
    return shareUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to your clipboard.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaEmail = async () => {
    const tripTitle = `${trip.trip_data.startCity} to ${trip.trip_data.endCity} Route 66 Trip`;
    const emailSubject = encodeURIComponent(`Check out this Route 66 trip plan: ${tripTitle}`);
    const emailBody = encodeURIComponent(
      `Hi!\n\nI found this amazing Route 66 trip and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      `${trip.trip_data.totalDays} days, ${Math.round(trip.trip_data.totalDistance)} miles\n\n` +
      `View the complete itinerary here: ${shareUrl}\n\n` +
      `Planned with Ramble 66 - The ultimate Route 66 trip planner\n` +
      `Visit ramble66.com to plan your own adventure!`
    );
    
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Enhanced PDF-Style Content */}
      <div className="p-6">
        <ShareTripModalContent
          tripPlan={trip.trip_data}
          tripStartDate={undefined} // Shared trips don't have a start date set
          currentShareUrl={shareUrl}
          isGeneratingLink={false}
          isTripComplete={isTripComplete}
          onGenerateLink={handleGenerateLink}
          onCopyLink={handleCopyLink}
          onShareViaEmail={handleShareViaEmail}
        />
      </div>
      
      {/* Trip Statistics Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Created {new Date(trip.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {trip.view_count} view{trip.view_count !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            This trip was created using Ramble 66 - Plan your own Route 66 adventure at ramble66.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsContent;
