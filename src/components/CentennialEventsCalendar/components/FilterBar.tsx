import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, X, RotateCcw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventState, EventCategory, stateMetadata, categoryMetadata } from '@/data/centennialEventsData';

interface FilterBarProps {
  selectedState: EventState | 'all';
  selectedMonth: number | 'all';
  selectedCategory: EventCategory | 'all';
  onStateChange: (state: EventState | 'all') => void;
  onMonthChange: (month: number | 'all') => void;
  onCategoryChange: (category: EventCategory | 'all') => void;
  onReset: () => void;
  eventCount: number;
  totalCount: number;
}

const MONTHS_2026 = [
  { index: 0, name: 'Jan', fullName: 'January' },
  { index: 1, name: 'Feb', fullName: 'February' },
  { index: 2, name: 'Mar', fullName: 'March' },
  { index: 3, name: 'Apr', fullName: 'April' },
  { index: 4, name: 'May', fullName: 'May' },
  { index: 5, name: 'Jun', fullName: 'June' },
  { index: 6, name: 'Jul', fullName: 'July' },
  { index: 7, name: 'Aug', fullName: 'August' },
  { index: 8, name: 'Sep', fullName: 'September' },
  { index: 9, name: 'Oct', fullName: 'October' },
  { index: 10, name: 'Nov', fullName: 'November' },
  { index: 11, name: 'Dec', fullName: 'December' },
];

// States in Route 66 order (Chicago to Santa Monica)
const STATE_OPTIONS: { value: EventState | 'all'; label: string }[] = [
  { value: 'all', label: 'All States' },
  { value: 'national', label: '🌎 National' },
  { value: 'IL', label: 'Illinois' },
  { value: 'MO', label: 'Missouri' },
  { value: 'KS', label: 'Kansas' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'TX', label: 'Texas' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'CA', label: 'California' },
];

// Category options with icons - popular types first
const CATEGORY_OPTIONS: { value: EventCategory | 'all'; label: string }[] = [
  { value: 'all', label: '🎯 All Event Types' },
  // Most popular first
  { value: 'car-show', label: `${categoryMetadata['car-show']?.emoji || '🏎️'} Car Show` },
  { value: 'motorcycles', label: `${categoryMetadata['motorcycles']?.emoji || '🏍️'} Motorcycles` },
  { value: 'runs', label: `${categoryMetadata['runs']?.emoji || '🏃'} Runs` },
  { value: 'festival', label: `${categoryMetadata['festival']?.emoji || '🎪'} Festival` },
  { value: 'parade', label: `${categoryMetadata['parade']?.emoji || '🚗'} Parade` },
  // Then the rest
  { value: 'caravan', label: `${categoryMetadata['caravan']?.emoji || '🚐'} Caravan` },
  { value: 'bicycles', label: `${categoryMetadata['bicycles']?.emoji || '🚴'} Bicycles` },
  { value: 'concert', label: `${categoryMetadata['concert']?.emoji || '🎵'} Concert` },
  { value: 'kickoff', label: `${categoryMetadata['kickoff']?.emoji || '🎉'} Kickoff` },
  { value: 'screening', label: `${categoryMetadata['screening']?.emoji || '🎬'} Screening` },
  { value: 'speaker-series', label: `${categoryMetadata['speaker-series']?.emoji || '🎤'} Speaker Series` },
  { value: 'other', label: `${categoryMetadata['other']?.emoji || '📅'} Other` },
];

// Quick-tap popular categories
const QUICK_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'motorcycles', label: '🏍️ Motorcycles' },
  { value: 'car-show', label: '🏎️ Car Show' },
  { value: 'runs', label: '🏃 Runs' },
  { value: 'festival', label: '🎪 Festival' },
];

const FilterBar: React.FC<FilterBarProps> = ({
  selectedState,
  selectedMonth,
  selectedCategory,
  onStateChange,
  onMonthChange,
  onCategoryChange,
  onReset,
  eventCount,
  totalCount,
}) => {
  const monthScrollRef = useRef<HTMLDivElement>(null);
  
  const hasActiveFilters = selectedState !== 'all' || selectedMonth !== 'all' || selectedCategory !== 'all';
  
  const scrollMonths = (direction: 'left' | 'right') => {
    if (monthScrollRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      monthScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getStateDisplayName = (state: EventState | 'all'): string => {
    if (state === 'all') return 'All States';
    if (state === 'national') return '🌎 National';
    return stateMetadata[state].name;
  };

  const getCategoryDisplayName = (category: EventCategory | 'all'): string => {
    if (category === 'all') return '🎯 Choose Event Type';
    const meta = categoryMetadata[category];
    return meta ? `${meta.emoji} ${meta.label}` : category;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      {/* State & Category Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
          Filter by:
        </label>
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <Select
            value={selectedState}
            onValueChange={(value) => onStateChange(value as EventState | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <SelectValue placeholder="Select state">
                {getStateDisplayName(selectedState)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {STATE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCategory}
            onValueChange={(value) => onCategoryChange(value as EventCategory | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-white border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 focus:ring-amber-400 transition-all duration-200">
              <SelectValue placeholder="Select category">
                {getCategoryDisplayName(selectedCategory)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs text-slate-500 mr-1">Quick:</span>
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`text-xs px-3 py-1 rounded-full transition-all duration-200 font-medium
                ${selectedCategory === cat.value
                  ? 'bg-amber-400 text-amber-900 shadow-sm'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1 hidden sm:block">
          Car Shows, Motorcycles, Runs, Parades & more...
        </p>
      </div>

      {/* Month Filter Row */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Filter by Month (2026):
        </label>
        
        <div className="flex items-center gap-2">
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollMonths('left')}
            className="h-8 w-8 shrink-0 hidden sm:flex"
            aria-label="Scroll months left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Horizontal scrollable month pills */}
          <div
            ref={monthScrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All option */}
            <button
              onClick={() => onMonthChange('all')}
              className={`
                shrink-0 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 border-2
                ${selectedMonth === 'all'
                  ? 'bg-[#1B60A3] text-white border-transparent shadow-md'
                  : 'bg-slate-100 text-slate-700 border-transparent hover:border-slate-300'
                }
              `}
              aria-pressed={selectedMonth === 'all'}
            >
              All
            </button>

            {/* Month pills */}
            {MONTHS_2026.map((month) => (
              <button
                key={month.index}
                onClick={() => onMonthChange(month.index)}
                className={`
                  shrink-0 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 border-2
                  ${selectedMonth === month.index
                    ? 'bg-[#1B60A3] text-white border-transparent shadow-md'
                    : 'bg-slate-100 text-slate-700 border-transparent hover:border-slate-300'
                  }
                `}
                aria-pressed={selectedMonth === month.index}
                aria-label={`Filter by ${month.fullName} 2026`}
              >
                {month.name}
              </button>
            ))}
          </div>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollMonths('right')}
            className="h-8 w-8 shrink-0 hidden sm:flex"
            aria-label="Scroll months right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="text-slate-600 hover:text-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset to All
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Submit Event CTA */}
          <a
            href="mailto:hello@ramble66.com?subject=Event Submission for Route 66 Centennial&body=Event Title:%0A%0AEvent Date(s):%0A%0ALocation/State:%0A%0ADescription:%0A%0ALink (if any):%0A%0AYour Name / Contact Info:%0A%0AThanks for helping make the 2026 Route 66 calendar complete!"
            className="text-sm bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Submit an Event
          </a>

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-slate-300" />

          <div className="text-sm text-slate-600">
            Showing{' '}
            <Badge variant="secondary" className="bg-blue-100 text-[#1B60A3] mx-1">
              {eventCount}
            </Badge>
            {eventCount !== totalCount && (
              <span className="text-slate-400">of {totalCount}</span>
            )}{' '}
            events
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
