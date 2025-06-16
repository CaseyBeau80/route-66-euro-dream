
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UnifiedDateService } from '../services/UnifiedDateService';

interface SimpleTripCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean; // Made optional since we're not using it
  className?: string;
}

const SimpleTripCalendar: React.FC<SimpleTripCalendarProps> = ({
  selected,
  onSelect,
  disabled, // We'll ignore this to avoid conflicts
  className
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const today = UnifiedDateService.getToday();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = UnifiedDateService.getToday();

  console.log('📅 FIXED: SimpleTripCalendar render - SIMPLIFIED APPROACH:', {
    today: today.toLocaleDateString(),
    todayTime: today.getTime(),
    selected: selected?.toLocaleDateString(),
    parentDisabledIgnored: true,
    service: 'UnifiedDateService - SIMPLIFIED'
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
    console.log('📅 FIXED: Date clicked in calendar:', {
      clickedDate: date.toLocaleDateString(),
      isToday: UnifiedDateService.isToday(date),
      service: 'UnifiedDateService - SIMPLIFIED'
    });

    // Use unified service to create clean date
    const cleanDate = UnifiedDateService.normalizeToLocalMidnight(date);
    
    console.log('📅 FIXED: Sending normalized date to parent:', {
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

  // SIMPLIFIED AND FIXED: Only disable dates that are actually in the past (never today)
  const isDateDisabled = (date: Date): boolean => {
    // ABSOLUTE RULE: TODAY IS NEVER DISABLED
    const isTodayExact = UnifiedDateService.isToday(date);
    
    if (isTodayExact) {
      console.log('🚨 FIXED: TODAY DETECTED - FORCING ENABLED:', {
        date: date.toLocaleDateString(),
        today: today.toLocaleDateString(),
        isToday: true,
        disabled: false,
        rule: 'TODAY_ABSOLUTE_OVERRIDE - SIMPLIFIED',
        parentLogicIgnored: true
      });
      return false; // TODAY IS NEVER DISABLED - ABSOLUTE RULE
    }
    
    // For non-today dates, only check if actually in the past
    const isActuallyPast = UnifiedDateService.isPastDate(date);
    
    console.log('📅 FIXED: Date validation for non-today date - SIMPLIFIED:', {
      date: date.toLocaleDateString(),
      isActuallyPast,
      isDisabled: isActuallyPast,
      parentLogicIgnored: true,
      service: 'UnifiedDateService - SIMPLIFIED'
    });
    
    return isActuallyPast;
  };

  const handleTodayClick = () => {
    console.log('📅 FIXED: Today button clicked - SIMPLIFIED:', {
      today: today.toLocaleDateString(),
      service: 'UnifiedDateService'
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

          console.log('📅 FIXED: Rendering calendar button - SIMPLIFIED:', {
            date: date.toLocaleDateString(),
            isSelected,
            isDisabled,
            isTodayDate,
            guaranteedClickable: isTodayDate ? 'TODAY_ALWAYS_CLICKABLE' : 'NORMAL_LOGIC'
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
                  // Today but not selected - Enhanced styling with guaranteed clickability
                  "bg-green-100 text-green-800 font-bold border-green-300 hover:bg-green-200 ring-2 ring-green-400 shadow-sm": isTodayDate && !isSelected,
                  // Disabled state - BUT NEVER FOR TODAY
                  "text-gray-300 bg-gray-50 hover:border-transparent cursor-not-allowed": isDisabled && !isTodayDate,
                  // Normal state
                  "text-gray-700 hover:bg-gray-100": !isSelected && !isTodayDate && !isDisabled,
                }
              )}
              style={{
                // ABSOLUTE CSS SAFETY: Force today to be clickable
                pointerEvents: isTodayDate ? 'auto' : (isDisabled ? 'none' : 'auto'),
                cursor: isTodayDate ? 'pointer' : (isDisabled ? 'not-allowed' : 'pointer')
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today Button with absolute clickability */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          className="w-full text-xs font-bold border-green-500 text-green-800 bg-green-50 hover:bg-green-100 hover:border-green-600 transition-all duration-200 shadow-sm"
          style={{ 
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
        >
          ✨ Select Today ({today.toLocaleDateString()}) - Start Now! ✨
        </Button>
      </div>
    </div>
  );
};

export default SimpleTripCalendar;
