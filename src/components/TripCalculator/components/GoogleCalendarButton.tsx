
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { toast } from '@/hooks/use-toast';

interface GoogleCalendarButtonProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  trackAnalytics?: boolean;
}

const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  variant = 'default',
  size = 'default',
  className,
  trackAnalytics = true
}) => {
  const handleAddToGoogleCalendar = () => {
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to add to Google Calendar.",
        variant: "destructive"
      });
      return;
    }

    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      toast({
        title: "No Trip Data",
        description: "Trip plan is incomplete. Please plan your trip first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Track analytics if enabled
      if (trackAnalytics) {
        GoogleCalendarService.trackCalendarClick(tripPlan);
      }

      // Generate Google Calendar URL
      const calendarUrl = GoogleCalendarService.createTripCalendarUrl(
        tripPlan,
        tripStartDate,
        shareUrl || undefined,
        { useUTC: false, trackAnalytics }
      );

      // Open Google Calendar in new tab
      window.open(calendarUrl, '_blank', 'noopener,noreferrer');

      toast({
        title: "Opening Google Calendar",
        description: "Your Route 66 trip event is being added to Google Calendar.",
        variant: "default"
      });
    } catch (error) {
      console.error('❌ Google Calendar integration error:', error);
      toast({
        title: "Calendar Export Failed",
        description: "Could not add trip to Google Calendar. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleAddToGoogleCalendar}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className || ''}`}
      disabled={!tripStartDate || !tripPlan}
    >
      <Calendar className="w-4 h-4" />
      Add to Google Calendar
    </Button>
  );
};

export default GoogleCalendarButton;
