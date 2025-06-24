
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Calendar, 
  Download, 
  Mail, 
  Link2, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { CalendarExportService } from '../services/CalendarExportService';
import { TripService } from '../services/TripService';
import { toast } from '@/hooks/use-toast';

interface UnifiedShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const UnifiedShareModal: React.FC<UnifiedShareModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareUrlGenerated
}) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState<string | null>(shareUrl || null);
  const [customTitle, setCustomTitle] = useState(`${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`);
  const [personalNote, setPersonalNote] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleGenerateShareLink = async () => {
    if (isGeneratingLink) return;

    try {
      setIsGeneratingLink(true);
      
      const tripDescription = personalNote || `Route 66 journey from ${tripPlan.startCity} to ${tripPlan.endCity}`;
      const shareCode = await TripService.saveTrip(tripPlan, customTitle, tripDescription);
      const generatedShareUrl = TripService.getShareUrl(shareCode);
      
      setCurrentShareUrl(generatedShareUrl);
      
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, generatedShareUrl);
      }
      
      toast({
        title: "Share Link Generated!",
        description: "Your trip share link has been created successfully.",
        variant: "default"
      });

    } catch (error) {
      console.error('❌ Failed to generate share link:', error);
      toast({
        title: "Share Failed",
        description: "Could not generate share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!currentShareUrl) return;
    
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleEmailShare = () => {
    if (!currentShareUrl) return;
    
    const subject = encodeURIComponent(customTitle);
    const body = encodeURIComponent(
      `Hi!\n\nI've planned an amazing Route 66 trip and wanted to share it with you!\n\n` +
      `${personalNote ? personalNote + '\n\n' : ''}` +
      `Trip: ${customTitle}\n` +
      `${tripPlan.totalDays} days, ${Math.round(tripPlan.totalDistance)} miles\n\n` +
      `View the complete itinerary here: ${currentShareUrl}\n\n` +
      `Plan your own Route 66 adventure at our trip planner!`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleGoogleCalendar = () => {
    const effectiveStartDate = tripStartDate || new Date();
    
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
        description: "Your Route 66 trip is being added to Google Calendar.",
        variant: "default"
      });
    } catch (error) {
      console.error('Google Calendar export error:', error);
      toast({
        title: "Calendar Export Failed",
        description: "Could not export to Google Calendar.",
        variant: "destructive"
      });
    }
  };

  const handleICalendarDownload = async () => {
    const effectiveStartDate = tripStartDate || new Date();
    
    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, effectiveStartDate);
      const filename = `route66-trip-${tripPlan.startCity.replace(/\s+/g, '-').toLowerCase()}-to-${tripPlan.endCity.replace(/\s+/g, '-').toLowerCase()}.ics`;
      
      CalendarExportService.downloadICSFile(events, filename);

      toast({
        title: "Calendar Downloaded",
        description: "Your Route 66 trip calendar file has been downloaded.",
        variant: "default"
      });
    } catch (error) {
      console.error('iCalendar download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download calendar file.",
        variant: "destructive"
      });
    }
  };

  const isComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Share2 className="h-6 w-6" />
            Share Your Route 66 Adventure
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Please create a complete trip plan before sharing.</p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Trip Customization */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Title
                </label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter trip title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Note (Optional)
                </label>
                <Textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Add a personal message about your trip..."
                  className="w-full"
                  rows={3}
                />
              </div>
            </div>

            {/* Generate Share Link */}
            {!currentShareUrl ? (
              <div className="text-center py-4">
                <Button
                  onClick={handleGenerateShareLink}
                  disabled={isGeneratingLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  {isGeneratingLink ? 'Generating...' : 'Generate Share Link'}
                </Button>
              </div>
            ) : (
              <>
                {/* Share Link Display */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={currentShareUrl}
                      readOnly
                      className="flex-1 bg-white"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copiedLink ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Share */}
                  <Button
                    onClick={handleEmailShare}
                    variant="outline"
                    className="flex items-center gap-2 p-4 h-auto border-2 border-orange-200 hover:bg-orange-50"
                  >
                    <Mail className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-semibold text-orange-700">Share via Email</div>
                      <div className="text-xs text-orange-600">Send to friends & family</div>
                    </div>
                  </Button>

                  {/* Copy Link */}
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="flex items-center gap-2 p-4 h-auto border-2 border-green-200 hover:bg-green-50"
                  >
                    <Link2 className="h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-semibold text-green-700">Copy Link</div>
                      <div className="text-xs text-green-600">Share anywhere</div>
                    </div>
                  </Button>
                </div>

                {/* Calendar Export Section */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                    <Calendar className="h-5 w-5" />
                    Add to Calendar
                  </h3>
                  
                  {!tripStartDate && (
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded mb-4">
                      <p className="text-amber-700 text-sm">
                        💡 No start date set. Calendar events will use today as the start date.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={handleGoogleCalendar}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-auto"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Add to Google Calendar</div>
                        <div className="text-xs opacity-90">Opens Google Calendar</div>
                      </div>
                    </Button>

                    <Button
                      onClick={handleICalendarDownload}
                      variant="outline"
                      className="w-full py-3 h-auto border-2 border-blue-200 hover:bg-blue-50"
                    >
                      <Download className="h-5 w-5 mr-3 text-blue-600" />
                      <div className="text-left">
                        <div className="font-semibold text-blue-700">Download iCalendar (.ics)</div>
                        <div className="text-xs text-blue-600">For Apple Calendar, Outlook, etc.</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedShareModal;
