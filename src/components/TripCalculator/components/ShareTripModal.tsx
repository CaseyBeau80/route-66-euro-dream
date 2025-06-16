
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

  const handleGoogleCalendarExport = () => {
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

  const handleOpenCalendarModal = () => {
    console.log('Opening calendar modal with:', {
      hasStartDate: !!tripStartDate,
      startDate: tripStartDate?.toISOString()
    });
    setIsCalendarModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Share2 className="h-6 w-6" />
              Share Your Route 66 Adventure
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
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

            {/* Calendar Export Section with Direct Action Buttons */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200 shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-blue-800 text-lg mb-2">📅 Export to Calendar</h3>
                <p className="text-sm text-blue-600 mb-2">
                  Add your Route 66 trip to Google Calendar or download as .ics file for other calendar apps
                </p>
                {!tripStartDate && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ Please set a trip start date to enable calendar export
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Google Calendar Button */}
                <Button
                  onClick={handleGoogleCalendarExport}
                  disabled={!tripStartDate}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 h-auto"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Add to Google Calendar</div>
                    <div className="text-xs opacity-90">Opens in new tab</div>
                  </div>
                </Button>

                {/* iCalendar Download Button */}
                <Button
                  onClick={handleICalendarDownload}
                  disabled={!tripStartDate}
                  variant="outline"
                  className="flex-1 py-3 h-auto border-2 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="h-5 w-5 mr-2 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-blue-700">Download iCalendar (.ics)</div>
                    <div className="text-xs text-blue-600">For Apple Calendar, Outlook, etc.</div>
                  </div>
                </Button>
              </div>

              {/* Additional Options Link */}
              <div className="mt-3 text-center">
                <Button
                  onClick={handleOpenCalendarModal}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  More calendar options
                </Button>
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
