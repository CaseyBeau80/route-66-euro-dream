
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useShareTripOptions } from '../hooks/useShareTripOptions';
import { useShareTripModal } from './hooks/useShareTripModal';
import ShareTripOptions from './share/ShareTripOptions';
import { Calendar, Share2, Download, ExternalLink } from 'lucide-react';
import CalendarExportModal from './CalendarExportModal';
import { CalendarExportService } from '../services/CalendarExportService';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { toast } from '@/hooks/use-toast';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareUrlGenerated
}) => {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const { shareOptions, updateShareOptions } = useShareTripOptions(tripPlan);

  const {
    isGeneratingLink,
    currentShareUrl,
    handleGenerateAndShare
  } = useShareTripModal({
    tripPlan,
    tripStartDate,
    shareUrl: shareUrl || null,
    shareOptions,
    onShareUrlGenerated,
    onClose
  });

  console.log('🔴 ShareTripModal DEBUG:', {
    isOpen,
    tripStartDate: tripStartDate?.toISOString(),
    tripPlan: tripPlan ? `${tripPlan.startCity} to ${tripPlan.endCity}` : 'null'
  });

  const handleGoogleCalendarExport = () => {
    console.log('🔴 Google Calendar export clicked');
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
    console.log('🔴 iCalendar download clicked');
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

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Share2 className="h-6 w-6" />
              Share Your Route 66 Adventure
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 px-1">
            {/* CALENDAR EXPORT SECTION - FIRST AND MOST VISIBLE */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-500 p-6 rounded-lg">
              <h3 className="font-bold text-red-800 text-xl mb-4 flex items-center gap-2">
                🚨 CALENDAR EXPORT TEST 🚨
                <Calendar className="h-6 w-6" />
              </h3>
              
              <div className="bg-white p-4 rounded border mb-4">
                <p className="text-sm font-mono text-gray-800">
                  DEBUG: tripStartDate = {tripStartDate ? '✅ ' + tripStartDate.toISOString() : '❌ NULL'}
                </p>
                <p className="text-sm font-mono text-gray-800">
                  Modal Open: {isOpen ? '✅ YES' : '❌ NO'}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGoogleCalendarExport}
                  disabled={!tripStartDate}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-auto text-lg font-bold"
                >
                  <ExternalLink className="h-6 w-6 mr-3" />
                  Add to Google Calendar
                </Button>

                <Button
                  onClick={handleICalendarDownload}
                  disabled={!tripStartDate}
                  variant="outline"
                  className="w-full py-4 h-auto border-2 border-blue-300 hover:bg-blue-50 text-lg font-bold"
                >
                  <Download className="h-6 w-6 mr-3 text-blue-600" />
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

            {/* Trip Details Customization */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Title
                </label>
                <Input
                  value={shareOptions.title}
                  onChange={(e) => updateShareOptions({ title: e.target.value })}
                  placeholder={`${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Note (Optional)
                </label>
                <Textarea
                  value={shareOptions.userNote}
                  onChange={(e) => updateShareOptions({ userNote: e.target.value })}
                  placeholder="Add a personal message about your trip..."
                  className="w-full"
                  rows={3}
                />
              </div>
            </div>

            {/* Share Options */}
            <ShareTripOptions
              tripPlan={tripPlan}
              currentShareUrl={currentShareUrl}
              isGeneratingLink={isGeneratingLink}
              onGenerateLink={async () => {
                await handleGenerateAndShare();
                return currentShareUrl;
              }}
              onCopyLink={async () => {
                if (currentShareUrl) {
                  await navigator.clipboard.writeText(currentShareUrl);
                }
              }}
              onShareViaEmail={async () => {
                if (currentShareUrl) {
                  const subject = encodeURIComponent(`Route 66 Trip: ${shareOptions.title}`);
                  const body = encodeURIComponent(
                    `Check out my Route 66 trip plan:\n\n${currentShareUrl}\n\n${shareOptions.userNote || ''}`
                  );
                  window.open(`mailto:?subject=${subject}&body=${body}`);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Export Modal */}
      <CalendarExportModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={currentShareUrl}
      />
    </>
  );
};

export default ShareTripModal;
