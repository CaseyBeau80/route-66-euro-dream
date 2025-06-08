
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Share2, ChevronDown, Copy, Mail, Calendar, Download, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarExportService } from '../services/CalendarExportService';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { TripService } from '../services/TripService';
import { useTripAutoSaveBeforeShare } from '../hooks/useTripAutoSaveBeforeShare';
import EnhancedPDFExport from './pdf/EnhancedPDFExport';

interface ShareAndExportDropdownProps {
  shareUrl?: string | null;
  tripTitle: string;
  tripPlan?: TripPlan;
  tripStartDate?: Date;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onShareUrlGenerated?: (shareCode: string, shareUrl: string) => void;
}

const ShareAndExportDropdown: React.FC<ShareAndExportDropdownProps> = ({ 
  shareUrl, 
  tripTitle, 
  tripPlan,
  tripStartDate,
  variant = 'primary',
  size = 'default',
  className,
  onShareUrlGenerated
}) => {
  console.log('🔽 ShareAndExportDropdown rendering with:', {
    shareUrl,
    tripTitle,
    hasTripPlan: !!tripPlan,
    tripStartDate,
    variant,
    size,
    segmentsCount: tripPlan?.segments?.length || 0
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const { saveBeforeShare, isAutoSaving } = useTripAutoSaveBeforeShare();

  const ensureShareUrl = async (): Promise<string | null> => {
    if (shareUrl) {
      return shareUrl;
    }

    if (!tripPlan) {
      toast({
        title: "No Trip to Share",
        description: "Please create a trip plan first.",
        variant: "destructive"
      });
      return null;
    }

    // Auto-save the trip to generate a share URL
    const shareCode = await saveBeforeShare(tripPlan);
    if (shareCode) {
      const newShareUrl = TripService.getShareUrl(shareCode);
      
      // Notify parent component about the new share URL
      if (onShareUrlGenerated) {
        onShareUrlGenerated(shareCode, newShareUrl);
      }
      
      return newShareUrl;
    }

    return null;
  };

  const handleCopyLink = async () => {
    const url = await ensureShareUrl();
    if (!url) return;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to your clipboard.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaEmail = async () => {
    const url = await ensureShareUrl();
    if (!url) return;

    const subject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
    const body = encodeURIComponent(
      `I've planned an amazing Route 66 road trip with Ramble 66 and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      `View the full plan here: ${url}\n\n` +
      `Ramble 66 makes it easy to plan your perfect Route 66 adventure. Start planning your own trip at ${window.location.origin}\n\n` +
      `Happy travels!\n` +
      `Planned with ❤️ using Ramble 66 - Your Route 66 Adventure Starts Here`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const handleAddToGoogleCalendar = () => {
    if (!tripPlan || !tripStartDate) {
      toast({
        title: "Calendar Export Unavailable",
        description: "Trip plan and start date are required for calendar export.",
        variant: "destructive"
      });
      return;
    }

    try {
      GoogleCalendarService.trackCalendarClick(tripPlan);
      
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        tripStartDate,
        shareUrl || undefined,
        { useUTC: false, trackAnalytics: true }
      );

      window.open(calendarUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Opening Google Calendar",
        description: "Your Route 66 trip event is being added to Google Calendar.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Google Calendar integration error:', error);
      toast({
        title: "Google Calendar Failed",
        description: "Could not add trip to Google Calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadICS = () => {
    if (!tripPlan || !tripStartDate) {
      toast({
        title: "Calendar Export Unavailable",
        description: "Trip plan and start date are required for calendar export.",
        variant: "destructive"
      });
      return;
    }

    try {
      const events = CalendarExportService.generateCalendarEvents(tripPlan, tripStartDate);
      CalendarExportService.downloadICSFile(events, `${tripTitle.toLowerCase().replace(/\s+/g, '-')}.ics`);
      
      toast({
        title: "Calendar File Downloaded!",
        description: "Your Route 66 trip has been downloaded as a calendar file compatible with Apple Calendar and Outlook.",
        variant: "default"
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Calendar export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePDFExport = () => {
    setIsOpen(false);
    setShowPDFModal(true);
  };

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  if (!isTripComplete) {
    console.log('⚠️ ShareAndExportDropdown: Trip not complete, showing disabled state');
    return (
      <div className={className}>
        <Button
          disabled
          variant="outline"
          size={size}
          className="opacity-50 cursor-not-allowed"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share & Export
        </Button>
      </div>
    );
  }

  console.log('✅ ShareAndExportDropdown: Rendering full dropdown');

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant === 'primary' ? 'default' : 'outline'}
            size={size}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            disabled={isAutoSaving}
          >
            {isAutoSaving ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share & Export
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-64 bg-white border-2 border-blue-200 shadow-xl rounded-lg z-50"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-800">
              {shareUrl ? 'Copy Shareable Link' : 'Save Trip & Copy Link'}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleShareViaEmail}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-800">Share via Email</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-blue-100" />
          
          <DropdownMenuItem
            onClick={handleAddToGoogleCalendar}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-800">Add to Google Calendar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleDownloadICS}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">Download Calendar File</span>
              <span className="text-xs text-gray-500">Apple Calendar & Outlook</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-blue-100" />
          
          <DropdownMenuItem
            onClick={handlePDFExport}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-800">Export Trip as PDF</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* PDF Export Modal */}
      {showPDFModal && tripPlan && (
        <EnhancedPDFExport
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl || undefined}
          isOpen={showPDFModal}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </div>
  );
};

export default ShareAndExportDropdown;
