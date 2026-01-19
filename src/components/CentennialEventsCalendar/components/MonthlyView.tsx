import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { centennialEvents } from '@/data/centennialEventsData';

interface MonthlyViewProps {
  selectedMonth: number | 'all';
  onMonthChange: (month: number | 'all') => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedMonth, onMonthChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const months = [
    { index: 0, name: 'January', short: 'Jan' },
    { index: 1, name: 'February', short: 'Feb' },
    { index: 2, name: 'March', short: 'Mar' },
    { index: 3, name: 'April', short: 'Apr' },
    { index: 4, name: 'May', short: 'May' },
    { index: 5, name: 'June', short: 'Jun' },
    { index: 6, name: 'July', short: 'Jul' },
    { index: 7, name: 'August', short: 'Aug' },
    { index: 8, name: 'September', short: 'Sep' },
    { index: 9, name: 'October', short: 'Oct' },
    { index: 10, name: 'November', short: 'Nov' },
    { index: 11, name: 'December', short: 'Dec' }
  ];

  // Count events per month
  const getEventCount = (monthIndex: number): number => {
    return centennialEvents.filter(e => {
      const eventMonth = new Date(e.dateStart).getMonth();
      return eventMonth === monthIndex;
    }).length;
  };

  // Check if month has highlight events
  const hasHighlight = (monthIndex: number): boolean => {
    return centennialEvents.some(e => {
      const eventMonth = new Date(e.dateStart).getMonth();
      return eventMonth === monthIndex && e.isHighlight;
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Highlight colors for months with more events (cool blue palette)
  const getMonthStyle = (count: number, isSelected: boolean) => {
    if (isSelected) return 'bg-[#1B60A3] text-white border-[#1B60A3]';
    if (count >= 5) return 'bg-blue-100 border-blue-300 text-blue-700';
    if (count >= 3) return 'bg-sky-50 border-sky-200 text-sky-700';
    if (count > 0) return 'bg-slate-50 border-slate-200 text-slate-700';
    return 'bg-slate-50/50 border-slate-100 text-slate-400';
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">2026 Calendar</h3>
        <button
          onClick={() => onMonthChange('all')}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            selectedMonth === 'all' 
              ? 'bg-slate-700 text-white' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Show All Months
        </button>
      </div>

      {/* Scroll container with navigation */}
      <div className="relative flex items-center gap-2">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="h-8 w-8 flex-shrink-0 hidden sm:flex"
          aria-label="Scroll months left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Months scroll area */}
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {months.map((month) => {
            const count = getEventCount(month.index);
            const isSelected = selectedMonth === month.index;
            const hasHighlightEvent = hasHighlight(month.index);
            
            return (
              <button
                key={month.index}
                onClick={() => onMonthChange(isSelected ? 'all' : month.index)}
                className={`
                  flex-shrink-0 flex flex-col items-center p-2 rounded-lg border-2
                  min-w-[70px] transition-all duration-200 hover:scale-105
                  ${getMonthStyle(count, isSelected)}
                  ${hasHighlightEvent && !isSelected ? 'ring-2 ring-[#1B60A3] ring-offset-1' : ''}
                `}
                aria-pressed={isSelected}
                aria-label={`${month.name} 2026, ${count} events`}
              >
                <span className="text-xs font-bold">{month.short}</span>
                <span className="text-[10px] opacity-70">2026</span>
                
                {/* Event count badge */}
                {count > 0 ? (
                  <Badge 
                    variant="secondary" 
                    className={`
                      mt-1 text-[10px] px-1.5 py-0 min-w-[1.25rem] justify-center
                      ${isSelected ? 'bg-white/30 text-white' : 'bg-white'}
                    `}
                  >
                    {count}
                  </Badge>
                ) : (
                  <span className="mt-1 text-[10px] opacity-50">—</span>
                )}
                
                {/* Highlight indicator */}
                {hasHighlightEvent && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#1B60A3] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="h-8 w-8 flex-shrink-0 hidden sm:flex"
          aria-label="Scroll months right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
          <span>5+ events</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#1B60A3]" />
          <span>Featured events</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
