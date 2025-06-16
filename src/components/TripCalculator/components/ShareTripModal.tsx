
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useShareTripOptions } from '../hooks/useShareTripOptions';
import { useShareTripModal } from './hooks/useShareTripModal';
import ShareTripOptions from './share/ShareTripOptions';
import { Calendar, Share2 } from 'lucide-react';
import CalendarExportModal from './CalendarExportModal';

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

            {/* Calendar Export Section - Make sure this is always visible */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-800">Export to Calendar</h3>
                  <p className="text-sm text-blue-600">
                    Add your trip to Google Calendar or download as .ics file
                  </p>
                  {!tripStartDate && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Set a trip start date to enable calendar export
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleOpenCalendarModal}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  disabled={!tripStartDate}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Export
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
