import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Download, 
  Share2,
  Clock
} from 'lucide-react';
import { CentennialEvent, stateMetadata, categoryMetadata } from '@/data/centennialEventsData';
import { 
  createGoogleCalendarUrl, 
  downloadICSFile, 
  getCountdownText,
  formatDateRange 
} from '../utils/eventCalendarHelpers';
import GuinnessBadge from './GuinnessBadge';
import { toast } from 'sonner';
import { openMobileAwareLink } from '@/utils/mobileAwareLinkUtils';

interface EventModalProps {
  event: CentennialEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const stateInfo = stateMetadata[event.state];
  const categoryInfo = categoryMetadata[event.category];
  const countdown = getCountdownText(event.dateStart);

  const handleGoogleCalendar = () => {
    const url = createGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadICS = () => {
    downloadICSFile(event);
    toast.success('Calendar file downloaded!');
  };

  const handleShare = async () => {
    const shareData = {
      title: `Route 66 Centennial: ${event.title}`,
      text: `${event.title} - ${event.dateDisplay} in ${event.location}. Part of Route 66's 100th anniversary celebrations!`,
      url: event.officialUrl || window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success('Event details copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // State color mapping for accent (cool blue/gray palette)
  const stateColorMap: Record<string, string> = {
    'IL': 'bg-blue-500',
    'MO': 'bg-slate-500',
    'KS': 'bg-sky-500',
    'OK': 'bg-[#1B60A3]',
    'TX': 'bg-slate-600',
    'NM': 'bg-cyan-500',
    'AZ': 'bg-indigo-500',
    'CA': 'bg-sky-400',
    'national': 'bg-indigo-600'
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Category & State badges */}
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant="secondary" 
              className={`${stateColorMap[event.state]} text-white`}
            >
              {event.state === 'national' ? '🌎 NATIONAL' : stateInfo.name}
            </Badge>
            <Badge variant="outline">
              {categoryInfo.emoji} {categoryInfo.label}
            </Badge>
          </div>
          
          <DialogTitle className="text-xl font-bold text-slate-800 pr-8">
            {event.title}
          </DialogTitle>
          
          <DialogDescription className="sr-only">
            Event details for {event.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Guinness Badge */}
          {event.guinnessAttempt && (
            <GuinnessBadge size="lg" showNote note={event.guinnessNote} />
          )}

          {/* Date & Countdown */}
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#1B60A3]" />
              <span className="font-semibold text-slate-800">
                {formatDateRange(event.dateStart, event.dateEnd)}
              </span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-[#155187]">
              <Clock className="h-3 w-3 mr-1" />
              {countdown}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-[#1B60A3] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-800">{event.location}</p>
              {event.venue && (
                <p className="text-sm text-slate-600">{event.venue}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Add to Calendar buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Add to Calendar:</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGoogleCalendar}
                className="flex items-center gap-1.5"
              >
                <Calendar className="h-4 w-4" />
                Google Calendar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadICS}
                className="flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download .ics
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1.5"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Official Link */}
          {event.officialUrl && (
            <button 
              onClick={() => openMobileAwareLink(event.officialUrl!, event.title, { forceNewTab: true })}
              className="flex items-center gap-2 text-[#1B60A3] hover:text-[#155187] font-medium transition-colors cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Official Event Page
            </button>
          )}

          {/* Data source note */}
          <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
            Event data from route66centennial.org • Last updated Jan 18, 2026
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
