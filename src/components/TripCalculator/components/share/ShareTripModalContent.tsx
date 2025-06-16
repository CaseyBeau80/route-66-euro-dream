
import React from 'react';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { GoogleCalendarService } from '../../services/GoogleCalendarService';
import { CalendarExportService } from '../../services/CalendarExportService';
import { toast } from '@/hooks/use-toast';
import ShareTripOptions from './ShareTripOptions';
import SharedTripContentRenderer from './SharedTripContentRenderer';
import { Calendar, Download, ExternalLink } from 'lucide-react';

interface ShareTripModalContentProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  currentShareUrl: string | null;
  isGeneratingLink: boolean;
  isTripComplete: boolean;
  onGenerateLink: () => Promise<string | null>;
  onCopyLink: () => Promise<void>;
  onShareViaEmail: () => Promise<void>;
  isSharedView?: boolean;
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
  console.log('📤 ShareTripModalContent: Rendering with UPDATED SharedTripContentRenderer with RAMBLE 66 branding');
  console.log('📤 ShareTripModalContent: Trip data:', {
    startCity: tripPlan?.startCity,
    endCity: tripPlan?.endCity,
    totalDays: tripPlan?.totalDays,
    segmentsCount: tripPlan?.segments?.length
  });

  const handleGoogleCalendarExport = () => {
    console.log('🔴 Google Calendar export clicked in ShareTripModalContent');
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to add to Google Calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      GoogleCalendarService.trackCalendarClick(tripPlan);
      
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        tripStartDate,
        currentShareUrl || undefined,
        { useUTC: false }
      );

      window.open(calendarUrl, '_blank', 'noopener,noreferrer');

      toast({
        title: "Opening Google Calendar",
        description: "Your Route 66 trip is being added to Google Calendar.",
        variant: "default"
      });
    } catch (error) {
      console.error('Google Calendar export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export to Google Calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleICalendarDownload = async () => {
    console.log('🔴 iCalendar download clicked in ShareTripModalContent');
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to download calendar file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, tripStartDate);
      const filename = `route66-trip-${tripPlan.startCity.replace(/\s+/g, '-').toLowerCase()}-to-${tripPlan.endCity.replace(/\s+/g, '-').toLowerCase()}.ics`;
      
      CalendarExportService.downloadICSFile(events, filename);

      toast({
        title: "Calendar Downloaded",
        description: "Your Route 66 trip calendar file has been downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('iCalendar download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download calendar file. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isTripComplete) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <p className="text-lg font-medium">Trip Not Complete</p>
          <p className="text-sm mt-2">Please create a trip plan first before sharing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black font-sans">
      {/* Calendar Export Section - Only show in modal, not shared view */}
      {!isSharedView && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500 p-6 rounded-lg mb-6">
          <h3 className="font-bold text-blue-800 text-xl mb-4 flex items-center gap-2">
            📅 Calendar Export
            <Calendar className="h-6 w-6" />
          </h3>

          <div className="space-y-3">
            <Button
              onClick={handleGoogleCalendarExport}
              disabled={!tripStartDate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto text-lg font-bold"
            >
              <ExternalLink className="h-5 w-5 mr-3" />
              Add to Google Calendar
            </Button>

            <Button
              onClick={handleICalendarDownload}
              disabled={!tripStartDate}
              variant="outline"
              className="w-full py-3 h-auto border-2 border-green-300 hover:bg-green-50 text-lg font-bold"
            >
              <Download className="h-5 w-5 mr-3 text-green-600" />
              Download iCalendar (.ics)
            </Button>
          </div>

          {!tripStartDate && (
            <div className="mt-4 bg-amber-100 border border-amber-400 p-3 rounded">
              <p className="text-amber-800 font-semibold">
                ⚠️ Please set a trip start date to enable calendar export
              </p>
            </div>
          )}
        </div>
      )}

      {/* UPDATED Rich Content using SharedTripContentRenderer with RAMBLE 66 branding */}
      <SharedTripContentRenderer
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={currentShareUrl || undefined}
        isSharedView={isSharedView}
      />

      {/* Sharing Options - Only show in modal, not in shared view */}
      {!isSharedView && (
        <div className="mt-8 pt-6 border-t-2 border-route66-primary bg-white">
          <ShareTripOptions
            tripPlan={tripPlan}
            currentShareUrl={currentShareUrl}
            isGeneratingLink={isGeneratingLink}
            onGenerateLink={onGenerateLink}
            onCopyLink={onCopyLink}
            onShareViaEmail={onShareViaEmail}
          />
        </div>
      )}
    </div>
  );
};

export default ShareTripModalContent;
