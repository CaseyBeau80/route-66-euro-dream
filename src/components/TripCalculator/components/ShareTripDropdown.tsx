
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, ChevronDown, Copy, Mail, Calendar, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CalendarExportService } from '../services/CalendarExportService';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import EnhancedPDFExport from './pdf/EnhancedPDFExport';

interface ShareTripDropdownProps {
  shareUrl?: string | null;
  tripTitle: string;
  tripPlan?: TripPlan;
  tripStartDate?: Date;
}

const ShareTripDropdown: React.FC<ShareTripDropdownProps> = ({ 
  shareUrl, 
  tripTitle, 
  tripPlan,
  tripStartDate 
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleBasicPDFExport = () => {
    window.print();
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Enhanced PDF Export Button */}
      {tripPlan && (
        <EnhancedPDFExport
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl || undefined}
        />
      )}

      {/* Share Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-route66-primary hover:bg-route66-rust text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            aria-label="Share trip options"
          >
            <Share2 className="w-4 h-4" />
            Share Trip
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-56 bg-white border border-route66-tan shadow-lg rounded-lg z-50"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="flex items-center gap-3 px-4 py-3 hover:bg-route66-vintage-beige cursor-pointer transition-colors"
          >
            <Copy className="w-4 h-4 text-route66-vintage-brown" />
            <span className="text-route66-vintage-brown font-medium">Copy Trip Link</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleShareViaEmail}
            className="flex items-center gap-3 px-4 py-3 hover:bg-route66-vintage-beige cursor-pointer transition-colors"
          >
            <Mail className="w-4 h-4 text-route66-vintage-brown" />
            <span className="text-route66-vintage-brown font-medium">Share via Email</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleAddToCalendar}
            className="flex items-center gap-3 px-4 py-3 hover:bg-route66-vintage-beige cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-route66-vintage-brown" />
            <span className="text-route66-vintage-brown font-medium">Add to Calendar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleBasicPDFExport}
            className="flex items-center gap-3 px-4 py-3 hover:bg-route66-vintage-beige cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-route66-vintage-brown" />
            <span className="text-route66-vintage-brown font-medium">Basic PDF Export</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ShareTripDropdown;
