
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
  onDateRequired?: () => void;
}

const ShareTripModal: React.FC<ShareTripModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareUrlGenerated,
  onDateRequired
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

  // IMPROVED: Smart date handling with auto-fallback
  const getEffectiveStartDate = () => {
    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      return tripStartDate;
    }
    // Auto-assign today as fallback
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  };

  const effectiveStartDate = getEffectiveStartDate();
  const hasExplicitStartDate = tripStartDate instanceof Date && !isNaN(tripStartDate.getTime());

  console.log('🔴 ShareTripModal: Smart date handling:', {
    hasExplicitStartDate,
    effectiveStartDate: effectiveStartDate.toISOString(),
    willUseAutoDate: !hasExplicitStartDate
  });

  const handleGoogleCalendarExport = () => {
    console.log('🔴 Google Calendar export with smart date handling');
    
    try {
      GoogleCalendarService.trackCalendarClick(tripPlan);
      
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        effectiveStartDate,
        currentShareUrl || undefined,
        { useUTC: false }
      );

      window.open(calendarUrl, '_blank', 'noopener,noreferrer');

      toast({
        title: "Opening Google Calendar",
        description: hasExplicitStartDate 
          ? "Your Route 66 trip is being added to Google Calendar with your chosen start date."
          : "Your Route 66 trip is being added to Google Calendar starting today. You can edit the date in Google Calendar.",
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
    console.log('🔴 iCalendar download with smart date handling');
    
    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, effectiveStartDate);
      const filename = `route66-trip-${tripPlan.startCity.replace(/\s+/g, '-').toLowerCase()}-to-${tripPlan.endCity.replace(/\s+/g, '-').toLowerCase()}.ics`;
      
      CalendarExportService.downloadICSFile(events, filename);

      toast({
        title: "Calendar Downloaded",
        description: hasExplicitStartDate
          ? "Your Route 66 trip calendar file has been downloaded with your chosen start date."
          : "Your Route 66 trip calendar file has been downloaded starting today. You can edit dates after importing.",
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
            {/* IMPROVED CALENDAR EXPORT SECTION - Always functional */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-800">
                ✅ CALENDAR EXPORT READY
                <Calendar className="h-6 w-6" />
              </h3>
              
              {/* Smart Date Status */}
              <div className="bg-white p-4 rounded border mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-700" />
                  <span className="font-semibold text-green-700">
                    Start Date: {effectiveStartDate.toLocaleDateString()}
                    {!hasExplicitStartDate && " (Auto-assigned)"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {hasExplicitStartDate 
                    ? 'Using your chosen trip start date for calendar events.'
                    : 'Using today as start date. You can customize dates after importing to your calendar.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGoogleCalendarExport}
                  className="w-full py-4 h-auto text-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-all"
                >
                  <ExternalLink className="h-6 w-6 mr-3" />
                  Add to Google Calendar
                </Button>

                <Button
                  onClick={handleICalendarDownload}
                  variant="outline"
                  className="w-full py-4 h-auto text-lg font-bold border-2 border-blue-300 hover:bg-blue-50 text-blue-700 transition-all"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download iCalendar (.ics)
                </Button>
              </div>

              {!hasExplicitStartDate && (
                <div className="mt-4 bg-blue-100 border border-blue-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 font-semibold mb-2">Want to customize your start date?</p>
                      <p className="text-blue-700 text-sm mb-3">
                        Choose a specific start date for more accurate planning and weather forecasts.
                      </p>
                      {onDateRequired && (
                        <Button 
                          onClick={() => {
                            onClose();
                            onDateRequired();
                          }}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Choose Start Date
                        </Button>
                      )}
                    </div>
                  </div>
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
        tripStartDate={effectiveStartDate}
        shareUrl={currentShareUrl}
      />
    </>
  );
};

export default ShareTripModal;
