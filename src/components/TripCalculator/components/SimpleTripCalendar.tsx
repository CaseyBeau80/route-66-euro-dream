
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

  const today = new Date();
  const todayDateString = today.toDateString();

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
    console.log('📅 SimpleTripCalendar: Date clicked:', {
      clickedDate: date.toISOString(),
      clickedLocal: date.toLocaleDateString(),
      isToday: date.toDateString() === todayDateString,
      isDisabled: disabled?.(date) || false
    });

    if (disabled?.(date)) {
      console.log('📅 SimpleTripCalendar: Date is disabled, ignoring click');
      return;
    }

    onSelect(date);
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const isDateDisabled = (date: Date): boolean => {
    return disabled?.(date) || false;
  };

  const isToday = (date: Date): boolean => {
    return date.toDateString() === todayDateString;
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={cn("p-4 bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-7 w-7 p-0"
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
          className="h-7 w-7 p-0"
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
            return <div key={index} className="h-8" />;
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
                "h-8 w-8 flex items-center justify-center text-sm rounded-md transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                {
                  "bg-blue-600 text-white hover:bg-blue-700": isSelected,
                  "bg-blue-100 text-blue-800 font-medium": isTodayDate && !isSelected,
                  "text-gray-400 cursor-not-allowed hover:bg-transparent": isDisabled,
                  "text-gray-900": !isSelected && !isTodayDate && !isDisabled,
                }
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today Button */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDateClick(today)}
          disabled={isDateDisabled(today)}
          className="w-full text-xs"
        >
          Today
        </Button>
      </div>
    </div>
  );
};

export default SimpleTripCalendar;
