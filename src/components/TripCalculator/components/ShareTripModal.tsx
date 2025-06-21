
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useShareTripOptions } from '../hooks/useShareTripOptions';
import { useShareTripModal } from './hooks/useShareTripModal';
import ShareTripOptions from './share/ShareTripOptions';
import { Calendar, Share2, Download, ExternalLink, AlertCircle } from 'lucide-react';
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

  // Enhanced date validation with better UX
  const hasValidStartDate = tripStartDate instanceof Date && !isNaN(tripStartDate.getTime());
  const effectiveStartDate = hasValidStartDate ? tripStartDate : null;

  console.log('🔴 ShareTripModal DEBUG:', {
    isOpen,
    hasValidStartDate,
    tripStartDate: tripStartDate?.toISOString() || 'null',
    tripPlan: tripPlan ? `${tripPlan.startCity} to ${tripPlan.endCity}` : 'null'
  });

  const handleGoogleCalendarExport = () => {
    console.log('🔴 Google Calendar export clicked');
    if (!hasValidStartDate) {
      if (onDateRequired) {
        toast({
          title: "Start Date Required",
          description: "Setting your trip start date will unlock calendar export.",
          variant: "default"
        });
        onClose();
        onDateRequired();
      } else {
        toast({
          title: "Start Date Required",
          description: "Please set a trip start date to add to Google Calendar.",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      GoogleCalendarService.trackCalendarClick(tripPlan);
      
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        effectiveStartDate!,
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
    if (!hasValidStartDate) {
      if (onDateRequired) {
        toast({
          title: "Start Date Required",
          description: "Setting your trip start date will unlock calendar export.",
          variant: "default"
        });
        onClose();
        onDateRequired();
      } else {
        toast({
          title: "Start Date Required",
          description: "Please set a trip start date to download calendar file.",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, effectiveStartDate!);
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
            {/* CALENDAR EXPORT SECTION - Enhanced with better validation UX */}
            <div className={`${hasValidStartDate ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300'} p-6 rounded-lg`}>
              <h3 className={`font-bold text-xl mb-4 flex items-center gap-2 ${hasValidStartDate ? 'text-green-800' : 'text-amber-800'}`}>
                {hasValidStartDate ? '✅ CALENDAR EXPORT READY' : '📅 CALENDAR EXPORT'}
                <Calendar className="h-6 w-6" />
              </h3>
              
              {/* Status Information */}
              <div className="bg-white p-4 rounded border mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {hasValidStartDate ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">Start Date: {effectiveStartDate?.toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-semibold">Start Date: Not Set</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {hasValidStartDate 
                    ? 'Your trip is ready for calendar export!'
                    : 'Set your trip start date to enable calendar features.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGoogleCalendarExport}
                  disabled={!hasValidStartDate}
                  className={`w-full py-4 h-auto text-lg font-bold transition-all ${
                    hasValidStartDate 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ExternalLink className="h-6 w-6 mr-3" />
                  {hasValidStartDate ? 'Add to Google Calendar' : 'Google Calendar (Date Required)'}
                </Button>

                <Button
                  onClick={handleICalendarDownload}
                  disabled={!hasValidStartDate}
                  variant="outline"
                  className={`w-full py-4 h-auto text-lg font-bold transition-all ${
                    hasValidStartDate 
                      ? 'border-2 border-blue-300 hover:bg-blue-50 text-blue-700' 
                      : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Download className="h-6 w-6 mr-3" />
                  {hasValidStartDate ? 'Download iCalendar (.ics)' : 'Download iCalendar (Date Required)'}
                </Button>
              </div>

              {!hasValidStartDate && (
                <div className="mt-4 bg-amber-100 border border-amber-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-semibold mb-2">Start Date Required</p>
                      <p className="text-amber-700 text-sm mb-3">
                        Calendar export needs a trip start date to create accurate events with proper timing.
                      </p>
                      {onDateRequired && (
                        <Button 
                          onClick={() => {
                            onClose();
                            onDateRequired();
                          }}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Set Start Date
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

      {/* Calendar Export Modal - only show if valid date */}
      {hasValidStartDate && (
        <CalendarExportModal
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          tripPlan={tripPlan}
          tripStartDate={effectiveStartDate!}
          shareUrl={currentShareUrl}
        />
      )}
    </>
  );
};

export default ShareTripModal;
