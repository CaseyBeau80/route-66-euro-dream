
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, Download, ExternalLink, Clock } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CalendarExportService, CalendarEvent } from '../services/CalendarExportService';
import { toast } from '@/hooks/use-toast';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripPlan: TripPlan;
}

const CalendarExportModal: React.FC<CalendarExportModalProps> = ({ isOpen, onClose, tripPlan }) => {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to next week
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadICS = async () => {
    setIsExporting(true);
    try {
      const selectedStartDate = new Date(startDate);
      const events = CalendarExportService.generateCalendarEvents(tripPlan, selectedStartDate);
      
      CalendarExportService.downloadICSFile(events, `${tripPlan.title.toLowerCase().replace(/\s+/g, '-')}.ics`);
      
      toast({
        title: "Calendar Export Successful!",
        description: "Your Route 66 trip has been downloaded as a calendar file.",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Calendar export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGoogleCalendar = async () => {
    setIsExporting(true);
    try {
      const selectedStartDate = new Date(startDate);
      const events = CalendarExportService.generateCalendarEvents(tripPlan, selectedStartDate);
      
      CalendarExportService.openGoogleCalendar(events);
      
      toast({
        title: "Opening Google Calendar",
        description: `Opening ${events.length} events in Google Calendar. Allow popups if prompted.`,
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Google Calendar export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not open Google Calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const previewEvents = () => {
    const selectedStartDate = new Date(startDate);
    return CalendarExportService.generateCalendarEvents(tripPlan, selectedStartDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-route66 text-route66-vintage-red">
            <Calendar className="h-5 w-5" />
            Export to Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Start Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="start-date" className="font-travel font-semibold text-route66-vintage-brown">
              Trip Start Date
            </Label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-route66-tan rounded focus:outline-none focus:ring-2 focus:ring-route66-primary"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Trip Preview */}
          <div className="bg-route66-vintage-beige rounded p-3 border border-route66-tan">
            <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Trip Preview
            </h4>
            <div className="text-sm text-route66-vintage-brown space-y-1">
              <div>Duration: {tripPlan.totalDays} days</div>
              <div>Total Distance: {tripPlan.totalMiles} miles</div>
              <div>Events: {previewEvents().length} calendar entries</div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDownloadICS}
              disabled={isExporting}
              className="w-full bg-route66-primary hover:bg-route66-rust text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Calendar File (.ics)
            </Button>
            
            <Button
              onClick={handleGoogleCalendar}
              disabled={isExporting}
              variant="outline"
              className="w-full border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Add to Google Calendar
            </Button>
          </div>

          <div className="text-xs text-route66-vintage-brown text-center space-y-1">
            <p>💡 The .ics file works with most calendar apps (Apple Calendar, Outlook, etc.)</p>
            <p>Google Calendar option will open multiple browser tabs - one for each day</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarExportModal;
