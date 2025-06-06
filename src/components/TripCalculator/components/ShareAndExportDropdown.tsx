
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Share2, ChevronDown, Copy, Mail, Calendar, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarExportService } from '../services/CalendarExportService';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import EnhancedPDFExport from './pdf/EnhancedPDFExport';

interface ShareAndExportDropdownProps {
  shareUrl?: string | null;
  tripTitle: string;
  tripPlan?: TripPlan;
  tripStartDate?: Date;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const ShareAndExportDropdown: React.FC<ShareAndExportDropdownProps> = ({ 
  shareUrl, 
  tripTitle, 
  tripPlan,
  tripStartDate,
  variant = 'primary',
  size = 'default',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const handleCopyLink = async () => {
    if (!shareUrl) {
      toast({
        title: "No Link Available",
        description: "Trip needs to be saved first to generate a shareable link.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
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

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`Check out my Route 66 trip plan: ${tripTitle}`);
    const body = encodeURIComponent(
      `I've planned an amazing Route 66 road trip and wanted to share it with you!\n\n` +
      `Trip: ${tripTitle}\n` +
      (shareUrl ? `View the full plan here: ${shareUrl}\n\n` : '') +
      `This trip was planned using the Route 66 Trip Planner. Start planning your own adventure at ${window.location.origin}`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const handleAddToCalendar = () => {
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
        title: "Calendar Export Successful!",
        description: "Your Route 66 trip has been downloaded as a calendar file.",
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

  const handleAddToGoogleCalendar = () => {
    if (!tripPlan || !tripStartDate) {
      toast({
        title: "Google Calendar Unavailable",
        description: "Trip plan and start date are required for Google Calendar integration.",
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

  const handlePDFExport = () => {
    setIsOpen(false);
    setShowPDFModal(true);
  };

  // Check if trip is complete
  const isTripComplete = tripPlan && tripPlan.segments && tripPlan.segments.length > 0;

  if (!isTripComplete) {
    return (
      <div className={className}>
        <Button
          disabled
          variant="outline"
          size={size}
          className="opacity-50 cursor-not-allowed"
        >
          📤 Share or Export
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant === 'primary' ? 'default' : 'outline'}
            size={size}
            className="flex items-center gap-2"
          >
            📤 Share or Export
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-56 bg-white border border-gray-300 shadow-lg rounded-lg z-50"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Share Trip Link</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleShareViaEmail}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Share via Email</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={handleAddToGoogleCalendar}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Add to Google Calendar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleAddToCalendar}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Download Calendar File</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={handlePDFExport}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Export Trip as PDF</span>
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
