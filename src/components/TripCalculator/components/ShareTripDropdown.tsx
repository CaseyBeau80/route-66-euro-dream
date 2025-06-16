
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Calendar, Link2, Mail, Download } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import ShareTripModal from './ShareTripModal';
import CalendarExportModal from './CalendarExportModal';
import { CalendarExportService } from '../services/CalendarExportService';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { toast } from '@/hooks/use-toast';

interface ShareTripDropdownProps {
  shareUrl?: string | null;
  tripTitle: string;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const ShareTripDropdown: React.FC<ShareTripDropdownProps> = ({
  shareUrl,
  tripTitle,
  tripPlan,
  tripStartDate,
  variant = 'default',
  size = 'default',
  className
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const handleQuickGoogleCalendar = () => {
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to export to Google Calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        tripStartDate,
        shareUrl || undefined
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
        description: "Could not export to Google Calendar.",
        variant: "destructive"
      });
    }
  };

  const handleQuickICalendar = async () => {
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
        description: "Your trip calendar file has been downloaded.",
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={`gap-2 ${className || ''}`}>
            <Share2 className="h-4 w-4" />
            Share Trip
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share with Link
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleQuickGoogleCalendar}>
            <Calendar className="mr-2 h-4 w-4" />
            Add to Google Calendar
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleQuickICalendar}>
            <Download className="mr-2 h-4 w-4" />
            Download iCalendar (.ics)
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setIsCalendarModalOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Calendar Export Options
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {shareUrl && (
            <DropdownMenuItem 
              onClick={() => navigator.clipboard.writeText(shareUrl)}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
          )}
          
          {shareUrl && (
            <DropdownMenuItem 
              onClick={() => {
                const subject = encodeURIComponent(`Route 66 Trip: ${tripTitle}`);
                const body = encodeURIComponent(`Check out my Route 66 trip plan:\n\n${shareUrl}`);
                window.open(`mailto:?subject=${subject}&body=${body}`);
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Share via Email
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareTripModal
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={shareUrl}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <CalendarExportModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={shareUrl}
      />
    </>
  );
};

export default ShareTripDropdown;
