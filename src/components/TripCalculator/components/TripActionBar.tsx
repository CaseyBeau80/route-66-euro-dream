
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, Download, MapPin, Share2 } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import GoogleCalendarButton from './GoogleCalendarButton';
import ShareAndExportDropdown from './ShareAndExportDropdown';
import { CalendarExportService } from '../services/CalendarExportService';
import { toast } from '@/hooks/use-toast';

interface TripActionBarProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  onShowMap?: () => void;
}

const TripActionBar: React.FC<TripActionBarProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  onShowMap
}) => {
  const handleDownloadCalendar = () => {
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to download calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, tripStartDate);
      const filename = `${tripPlan.startCity}-to-${tripPlan.endCity}-route66.ics`.toLowerCase().replace(/\s+/g, '-');
      CalendarExportService.downloadICSFile(events, filename);
      
      toast({
        title: "Calendar Downloaded!",
        description: "Your Route 66 trip calendar has been downloaded.",
        variant: "default"
      });
    } catch (error) {
      console.error('Calendar download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEmailShare = () => {
    const tripTitle = `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;
    const subject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
    const body = encodeURIComponent(
      `Hi!\n\nI've planned an amazing Route 66 trip and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      `${tripPlan.totalDays} days, ${Math.round(tripPlan.totalDistance)} miles\n\n` +
      (shareUrl ? `View the complete itinerary here: ${shareUrl}\n\n` : '') +
      `Planned with the Route 66 Trip Planner`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg border">
      {/* Google Calendar Integration */}
      <GoogleCalendarButton
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={shareUrl}
        variant="outline"
        size="sm"
      />
      
      {/* .ics Calendar Download */}
      <Button
        onClick={handleDownloadCalendar}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        disabled={!tripStartDate}
      >
        <Download className="w-4 h-4" />
        Download .ics
      </Button>
      
      {/* Email Sharing */}
      <Button
        onClick={handleEmailShare}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Share via Email
      </Button>

      {/* Map View (if available) */}
      {onShowMap && (
        <Button
          onClick={onShowMap}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          View on Map
        </Button>
      )}

      {/* Advanced Share & Export Options */}
      <ShareAndExportDropdown
        tripPlan={tripPlan}
        shareUrl={shareUrl}
        tripTitle={`${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`}
        tripStartDate={tripStartDate}
        variant="default"
        size="sm"
      />
    </div>
  );
};

export default TripActionBar;
