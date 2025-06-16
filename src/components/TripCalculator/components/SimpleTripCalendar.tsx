
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UnifiedDateService } from '../services/UnifiedDateService';

interface SimpleTripCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  className?: string;
}

const SimpleTripCalendar: React.FC<SimpleTripCalendarProps> = ({
  selected,
  onSelect,
  className
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const today = UnifiedDateService.getToday();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = UnifiedDateService.getToday();

  console.log('📅 ABSOLUTE FIX: SimpleTripCalendar render - PARENT DISABLED REMOVED:', {
    today: today.toLocaleDateString(),
    todayTime: today.getTime(),
    selected: selected?.toLocaleDateString(),
    noParentDisabled: true,
    service: 'UnifiedDateService - ABSOLUTE CONTROL'
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
    console.log('📅 ABSOLUTE FIX: Date clicked in calendar:', {
      clickedDate: date.toLocaleDateString(),
      isToday: UnifiedDateService.isToday(date),
      service: 'UnifiedDateService - ABSOLUTE CONTROL'
    });

    // Use unified service to create clean date
    const cleanDate = UnifiedDateService.normalizeToLocalMidnight(date);
    
    console.log('📅 ABSOLUTE FIX: Sending normalized date to parent:', {
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

  // ABSOLUTE FIX: Completely new disabled logic - TODAY IS NEVER DISABLED
  const isDateDisabled = (date: Date): boolean => {
    const isTodayExact = UnifiedDateService.isToday(date);
    
    // ABSOLUTE RULE: TODAY IS NEVER DISABLED
    if (isTodayExact) {
      console.log('🚨 ABSOLUTE FIX: TODAY DETECTED - GUARANTEED ENABLED:', {
        date: date.toLocaleDateString(),
        today: today.toLocaleDateString(),
        isToday: true,
        disabled: false,
        rule: 'TODAY_ABSOLUTE_OVERRIDE - GUARANTEED',
        absoluteFix: true
      });
      return false; // TODAY IS NEVER DISABLED - GUARANTEED
    }
    
    // For non-today dates, only check if actually in the past
    const isActuallyPast = UnifiedDateService.isPastDate(date);
    
    console.log('📅 ABSOLUTE FIX: Date validation for non-today date:', {
      date: date.toLocaleDateString(),
      isActuallyPast,
      isDisabled: isActuallyPast,
      absoluteFix: true,
      service: 'UnifiedDateService - ABSOLUTE CONTROL'
    });
    
    return isActuallyPast;
  };

  const handleTodayClick = () => {
    console.log('📅 ABSOLUTE FIX: Today button clicked:', {
      today: today.toLocaleDateString(),
      service: 'UnifiedDateService - ABSOLUTE CONTROL'
    });
    
    handleDateClick(today);
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

          console.log('📅 ABSOLUTE FIX: Rendering calendar button:', {
            date: date.toLocaleDateString(),
            isSelected,
            isDisabled,
            isTodayDate,
            guaranteedClickable: isTodayDate ? 'TODAY_ABSOLUTELY_CLICKABLE' : 'NORMAL_LOGIC',
            absoluteFix: true
          });

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
                  // Today but not selected - ABSOLUTELY CLICKABLE
                  "bg-green-100 text-green-800 font-bold border-green-300 hover:bg-green-200 ring-2 ring-green-400 shadow-sm": isTodayDate && !isSelected,
                  // Disabled state - BUT ABSOLUTELY NEVER FOR TODAY
                  "text-gray-300 bg-gray-50 hover:border-transparent cursor-not-allowed": isDisabled && !isTodayDate,
                  // Normal state
                  "text-gray-700 hover:bg-gray-100": !isSelected && !isTodayDate && !isDisabled,
                }
              )}
              style={{
                // ABSOLUTE CSS GUARANTEE: Force today to be clickable
                pointerEvents: isTodayDate ? 'auto' : (isDisabled ? 'none' : 'auto'),
                cursor: isTodayDate ? 'pointer' : (isDisabled ? 'not-allowed' : 'pointer'),
                // Additional guarantee
                opacity: isTodayDate ? 1 : (isDisabled ? 0.5 : 1)
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today Button with absolute guarantee */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          className="w-full text-xs font-bold border-green-500 text-green-800 bg-green-50 hover:bg-green-100 hover:border-green-600 transition-all duration-200 shadow-sm"
          style={{ 
            pointerEvents: 'auto',
            cursor: 'pointer',
            opacity: 1
          }}
        >
          ✨ Select Today ({today.toLocaleDateString()}) - Absolutely Clickable! ✨
        </Button>
      </div>
    </div>
  );
};

export default SimpleTripCalendar;
