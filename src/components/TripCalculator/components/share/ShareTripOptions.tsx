
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Mail, Calendar, Download, ExternalLink } from 'lucide-react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { GoogleCalendarService } from '../../services/GoogleCalendarService';
import { CalendarExportService } from '../../services/CalendarExportService';
import { toast } from '@/hooks/use-toast';

interface ShareTripOptionsProps {
  tripPlan: TripPlan;
  currentShareUrl: string | null;
  isGeneratingLink: boolean;
  onGenerateLink: () => Promise<string | null>;
  onCopyLink: () => Promise<void>;
  onShareViaEmail: () => Promise<void>;
  tripStartDate?: Date;
}

const ShareTripOptions: React.FC<ShareTripOptionsProps> = ({
  tripPlan,
  currentShareUrl,
  isGeneratingLink,
  onGenerateLink,
  onCopyLink,
  onShareViaEmail,
  tripStartDate
}) => {
  const handleGoogleCalendar = () => {
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to add to Google Calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        tripStartDate,
        currentShareUrl || undefined
      );
      
      window.open(calendarUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Opening Google Calendar",
        description: "Your Route 66 trip event is being added to Google Calendar.",
        variant: "default"
      });
    } catch (error) {
      console.error('Google Calendar error:', error);
      toast({
        title: "Calendar Export Failed",
        description: "Could not add trip to Google Calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  return (
    <div className="space-y-4">
      <h3 className="font-travel font-bold text-route66-vintage-brown text-lg">
        Share Your Adventure
      </h3>
      
      {/* Primary Action - Generate Link */}
      <Button
        onClick={onGenerateLink}
        disabled={isGeneratingLink}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
      >
        <Link2 className="mr-2 h-4 w-4" />
        {isGeneratingLink ? 'Generating Link...' : 'Copy Shareable Link'}
      </Button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 gap-3">
        {/* Email Sharing */}
        <Button
          onClick={onShareViaEmail}
          variant="outline"
          className="w-full border-green-500 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg"
          disabled={!currentShareUrl}
        >
          <Mail className="mr-2 h-4 w-4" />
          Share via Email
        </Button>

        {/* Google Calendar */}
        <Button
          onClick={handleGoogleCalendar}
          variant="outline"
          className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg"
          disabled={!tripStartDate}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Add to Google Calendar
        </Button>

        {/* Download .ics Calendar */}
        <Button
          onClick={handleDownloadCalendar}
          variant="outline"
          className="w-full border-purple-500 text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-lg"
          disabled={!tripStartDate}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Calendar (.ics)
        </Button>
      </div>

      {/* Status Messages */}
      {currentShareUrl && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700 text-sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Trip Saved & Ready to Share!
          </div>
          <div className="mt-1 text-xs text-green-600 break-all">
            {currentShareUrl}
          </div>
        </div>
      )}

      {!tripStartDate && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-amber-700 text-sm">
            💡 Set a trip start date to enable calendar features
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareTripOptions;
