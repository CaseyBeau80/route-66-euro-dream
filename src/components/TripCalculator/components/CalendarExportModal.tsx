
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ExternalLink, Clock } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CalendarExportService } from '../services/CalendarExportService';
import { GoogleCalendarService } from '../services/GoogleCalendarService';
import { toast } from '@/hooks/use-toast';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
}

const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  isOpen,
  onClose,
  tripPlan,
  tripStartDate,
  shareUrl
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleGoogleCalendarExport = () => {
    if (!tripStartDate) {
      toast({
        title: "Start Date Required",
        description: "Please set a trip start date to export to Google Calendar.",
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
      setIsExporting(true);
      
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
    } finally {
      setIsExporting(false);
    }
  };

  const formatTripDetails = () => {
    if (!tripStartDate) return null;
    
    const endDate = new Date(tripStartDate);
    endDate.setDate(tripStartDate.getDate() + tripPlan.totalDays - 1);
    
    return {
      startDate: tripStartDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      endDate: endDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const tripDetails = formatTripDetails();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Calendar className="h-6 w-6" />
            Export to Calendar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              {tripPlan.startCity} → {tripPlan.endCity}
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{tripPlan.totalDays} days • {Math.round(tripPlan.totalDistance)} miles</span>
              </div>
              {tripDetails && (
                <div className="mt-2 text-xs">
                  <div>{tripDetails.startDate} → {tripDetails.endDate}</div>
                </div>
              )}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            {/* Google Calendar */}
            <Button
              onClick={handleGoogleCalendarExport}
              disabled={!tripStartDate}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-auto"
            >
              <ExternalLink className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Add to Google Calendar</div>
                <div className="text-xs opacity-90">Opens Google Calendar in new tab</div>
              </div>
            </Button>

            {/* iCalendar Download */}
            <Button
              onClick={handleICalendarDownload}
              disabled={!tripStartDate || isExporting}
              variant="outline"
              className="w-full py-3 h-auto border-2 border-blue-200 hover:bg-blue-50"
            >
              <Download className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-blue-700">
                  {isExporting ? 'Generating...' : 'Download iCalendar (.ics)'}
                </div>
                <div className="text-xs text-blue-600">
                  Compatible with Apple Calendar, Outlook, etc.
                </div>
              </div>
            </Button>
          </div>

          {/* Requirements Notice */}
          {!tripStartDate && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">
                ⚠️ Please set a trip start date to enable calendar export.
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">
              Calendar events will include daily driving segments, recommended stops, 
              and attraction information for your Route 66 journey.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarExportModal;
