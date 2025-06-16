
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // CRITICAL FIX: Create today using local date components only
  const today = React.useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  console.log('📅 FIXED CALENDAR: Component state:', {
    selectedDate: selected?.toISOString(),
    selectedDateLocal: selected?.toLocaleDateString(),
    todayLocal: today.toLocaleDateString(),
    todayComponents: {
      year: today.getFullYear(),
      month: today.getMonth(),
      date: today.getDate()
    }
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
    
    // First day of month and how many days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // What day of week does month start (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();
    
    // Generate calendar grid
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month - CRITICAL FIX: Use local date construction
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return {
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days
    };
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    console.log('📅 FIXED CALENDAR: Date clicked:', {
      clickedDate: date.toISOString(),
      clickedDateLocal: date.toLocaleDateString(),
      clickedComponents: {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate()
      },
      todayComponents: {
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate()
      },
      isToday: isToday(date),
      isDisabled: disabled?.(date) || false
    });

    // Check if disabled
    if (disabled?.(date)) {
      console.log('📅 FIXED CALENDAR: Click ignored - date is disabled');
      return;
    }

    // CRITICAL FIX: Create clean local date for consistency
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('📅 FIXED CALENDAR: Calling onSelect with clean local date:', {
      originalDate: date.toISOString(),
      cleanLocalDate: localDate.toISOString(),
      cleanLocalComponents: {
        year: localDate.getFullYear(),
        month: localDate.getMonth(),
        date: localDate.getDate()
      }
    });

    onSelect(localDate);
  };

  // CRITICAL FIX: Compare dates using local date components only
  const isDateSelected = (date: Date): boolean => {
    if (!selected) return false;
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  };

  // CRITICAL FIX: Compare with today using local date components
  const isToday = (date: Date): boolean => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // CRITICAL FIX: Improved date disability check
  const isDateDisabled = (date: Date): boolean => {
    if (disabled?.(date)) return true;
    
    // CRITICAL FIX: Only disable dates that are clearly before today
    const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const todayTime = today.getTime();
    
    const shouldDisable = dateTime < todayTime;
    
    console.log('📅 FIXED CALENDAR: Date disability check:', {
      date: date.toLocaleDateString(),
      today: today.toLocaleDateString(),
      dateTime,
      todayTime,
      shouldDisable,
      comparison: dateTime < todayTime ? 'BEFORE_TODAY' : 'TODAY_OR_FUTURE'
    });
    
    return shouldDisable;
  };

  const handleTodayClick = () => {
    console.log('📅 FIXED CALENDAR: Today button clicked:', {
      todayDate: today.toISOString(),
      todayDateLocal: today.toLocaleDateString(),
      isDisabled: isDateDisabled(today)
    });
    
    if (!isDateDisabled(today)) {
      handleDateClick(today);
    }
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
        {weekDays.map((day) => (
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
          const isTodayDate = isToday(date);

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
                  // Today but not selected - CRITICAL FIX: Enhanced styling for today
                  "bg-blue-100 text-blue-800 font-semibold border-blue-200 hover:bg-blue-200 ring-2 ring-blue-300": isTodayDate && !isSelected,
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

      {/* Today Button */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          disabled={isDateDisabled(today)}
          className={cn(
            "w-full text-xs font-medium",
            !isDateDisabled(today) && "border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100"
          )}
        >
          Select Today ({today.toLocaleDateString()})
        </Button>
      </div>
    </div>
  );
};

export default SimpleTripCalendar;
