
import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterState } from '../types';

interface CarouselFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  states: string[];
  cities: string[];
  filteredCount: number;
  totalCount: number;
}

const CarouselFilters: React.FC<CarouselFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  hasActiveFilters,
  states,
  cities,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Filter Controls Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={(value) => onFiltersChange({ type: value as FilterState['type'] })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="attractions">Historic Attractions</SelectItem>
            <SelectItem value="drive_ins">Drive-In Theaters</SelectItem>
            <SelectItem value="hidden_gems">Hidden Gems</SelectItem>
          </SelectContent>
        </Select>

        {/* State Filter */}
        <Select
          value={filters.state || "all-states"}
          onValueChange={(value) => onFiltersChange({ state: value === "all-states" ? "" : value })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-states">All States</SelectItem>
            {states.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City Filter */}
        <Select
          value={filters.city || "all-cities"}
          onValueChange={(value) => onFiltersChange({ city: value === "all-cities" ? "" : value })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cities">All Cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search attractions, cities, or descriptions..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ search: '' })}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredCount} of {totalCount} results
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type !== 'all' && (
            <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm">
              <span>Type: {filters.type.replace('_', ' ')}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ type: 'all' })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.state && (
            <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm">
              <span>State: {filters.state}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ state: '' })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.city && (
            <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm">
              <span>City: {filters.city}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ city: '' })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.search && (
            <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm">
              <span>Search: "{filters.search}"</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFiltersChange({ search: '' })}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarouselFilters;
