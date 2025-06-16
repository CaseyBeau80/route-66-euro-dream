
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UnifiedDateService } from '../services/UnifiedDateService';

interface SimpleTripCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

const SimpleTripCalendar: React.FC<SimpleTripCalendarProps> = ({
  selected,
  onSelect,
  disabled,
  className
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const today = UnifiedDateService.getToday();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = UnifiedDateService.getToday();

  console.log('📅 UNIFIED CALENDAR: Using UnifiedDateService for all operations:', {
    today: today.toLocaleDateString(),
    selected: selected?.toLocaleDateString(),
    service: 'UnifiedDateService - SINGLE SOURCE OF TRUTH'
  });

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Get calendar data
  const monthData = React.useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return {
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days
    };
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    console.log('📅 UNIFIED CALENDAR: Date clicked:', {
      clickedDate: date.toLocaleDateString(),
      isToday: UnifiedDateService.isToday(date),
      isDisabled: disabled?.(date) || false,
      service: 'UnifiedDateService'
    });

    if (disabled?.(date)) {
      console.log('📅 UNIFIED CALENDAR: Click ignored - date is disabled');
      return;
    }

    // Use unified service to create clean date
    const cleanDate = UnifiedDateService.normalizeToLocalMidnight(date);
    
    console.log('📅 UNIFIED CALENDAR: Normalized date for selection:', {
      original: date.toLocaleDateString(),
      normalized: cleanDate.toLocaleDateString(),
      service: 'UnifiedDateService'
    });
    
    onSelect(cleanDate);
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selected) return false;
    return UnifiedDateService.isSameDate(date, selected);
  };

  const isDateDisabled = (date: Date): boolean => {
    if (disabled?.(date)) return true;
    
    // Use unified service for past date check
    const isPast = UnifiedDateService.isPastDate(date);
    
    console.log('📅 UNIFIED CALENDAR: Date validation:', {
      date: date.toLocaleDateString(),
      isPast,
      isToday: UnifiedDateService.isToday(date),
      isDisabled: isPast,
      service: 'UnifiedDateService'
    });
    
    return isPast;
  };

  const handleTodayClick = () => {
    console.log('📅 UNIFIED CALENDAR: Today button clicked - selecting today:', {
      today: today.toLocaleDateString(),
      service: 'UnifiedDateService'
    });
    
    if (!isDateDisabled(today)) {
      handleDateClick(today);
    }
  };

  return (
    <div className={cn("p-4 bg-white border border-gray-200 rounded-lg", className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-sm font-medium text-gray-900">
          {monthData.monthName}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthData.days.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-10" />;
          }

          const isSelected = isDateSelected(date);
          const isDisabled = isDateDisabled(date);
          const isTodayDate = UnifiedDateService.isToday(date);

          return (
            <button
              key={date.getTime()}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                "h-10 w-10 flex items-center justify-center text-sm rounded-md transition-all duration-200",
                "border border-transparent hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                {
                  // Selected state
                  "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm": isSelected,
                  // Today but not selected - Enhanced styling for today
                  "bg-green-100 text-green-800 font-bold border-green-300 hover:bg-green-200 ring-2 ring-green-400 shadow-sm": isTodayDate && !isSelected,
                  // Disabled state
                  "text-gray-300 cursor-not-allowed bg-gray-50 hover:border-transparent": isDisabled,
                  // Normal state
                  "text-gray-700 hover:bg-gray-100": !isSelected && !isTodayDate && !isDisabled,
                }
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Enhanced Today Button */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          disabled={false}
          className="w-full text-xs font-bold border-green-500 text-green-800 bg-green-50 hover:bg-green-100 hover:border-green-600 transition-all duration-200 shadow-sm"
        >
          ✨ Select Today ({today.toLocaleDateString()}) - Start Now! ✨
        </Button>
      </div>
    </div>
  );
};

export default SimpleTripCalendar;
