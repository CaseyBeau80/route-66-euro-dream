
import React from 'react';
import { Button } from '@/components/ui/button';
import { TripPlan } from '../../services/planning/TripPlanTypes';
import { GoogleCalendarService } from '../../services/GoogleCalendarService';
import { CalendarExportService } from '../../services/CalendarExportService';
import { toast } from '@/hooks/use-toast';
import ShareTripOptions from './ShareTripOptions';
import SharedTripContentRenderer from './SharedTripContentRenderer';
import { Calendar, Download, ExternalLink, Share2, Link, Mail, Loader2 } from 'lucide-react';

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
      {/* UPDATED Rich Content using SharedTripContentRenderer with RAMBLE 66 branding */}
      <SharedTripContentRenderer
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={currentShareUrl || undefined}
        isSharedView={isSharedView}
      />

      {/* Sharing Options - Only show in modal, not in shared view */}
      {!isSharedView && (
        <div className="mt-8 pt-6 border-t border-gray-200 bg-white">
        {/* Calendar Export Section - Improved styling */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-xl mt-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-blue-800 text-lg">
                📅 Calendar Export
              </h3>
            </div>

            <p className="text-blue-700 text-sm mb-4">
              Add your Route 66 adventure to your calendar so you never miss a moment
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleGoogleCalendarExport}
                disabled={!tripStartDate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ExternalLink className="h-5 w-5 mr-3" />
                Add to Google Calendar
              </Button>

              <Button
                onClick={handleICalendarDownload}
                disabled={!tripStartDate}
                variant="outline"
                className="w-full py-3 h-auto border border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-blue-700 hover:text-blue-800 text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Download className="h-5 w-5 mr-3" />
                Download iCalendar (.ics)
              </Button>
            </div>

            {!tripStartDate && (
              <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-amber-500 text-lg">⚠️</div>
                  <p className="text-amber-800 font-medium text-sm">
                    Please set a trip start date to enable calendar export
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Share URL Section - Streamlined for dropdown functionality */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 p-6 rounded-xl mt-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <Share2 className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-green-800 text-lg">
                🔗 Share Your Trip
              </h3>
            </div>

            <p className="text-green-700 text-sm mb-4">
              Generate a shareable link to share your Route 66 adventure with friends and family
            </p>

            {!currentShareUrl ? (
              <Button
                onClick={onGenerateLink}
                disabled={isGeneratingLink}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isGeneratingLink ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Generating Share Link...
                  </>
                ) : (
                  <>
                    <Link className="h-5 w-5 mr-3" />
                    Generate Share Link
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-white border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-medium text-sm mb-2">Your shareable link is ready!</p>
                  <p className="text-green-600 text-xs break-all font-mono bg-green-50 p-2 rounded">
                    {currentShareUrl}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={onCopyLink}
                    variant="outline"
                    className="py-3 h-auto border border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700 hover:text-green-800 text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Link className="h-5 w-5 mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button
                    onClick={onShareViaEmail}
                    variant="outline"
                    className="py-3 h-auto border border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700 hover:text-green-800 text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Share via Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareTripModalContent;
