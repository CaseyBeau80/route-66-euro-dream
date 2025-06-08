
import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  states: string[];
  cities: string[];
  filteredCount: number;
  totalCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
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
    <div className="bg-route66-background-alt rounded-xl p-4 sm:p-6 border border-route66-border mb-6 sm:mb-8">
      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Primary Filter Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Type Filter */}
          <div className="min-w-0 flex-shrink-0">
            <label className="block text-sm font-medium text-route66-text-primary mb-2">
              Type
            </label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFiltersChange({ type: value as FilterState['type'] })}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-route66-background border-route66-border hover:border-route66-primary transition-colors">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="attractions">Historic Attractions</SelectItem>
                <SelectItem value="drive_ins">Drive-In Theaters</SelectItem>
                <SelectItem value="hidden_gems">Hidden Gems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div className="min-w-0 flex-shrink-0">
            <label className="block text-sm font-medium text-route66-text-primary mb-2">
              State
            </label>
            <Select
              value={filters.state || "all-states"}
              onValueChange={(value) => onFiltersChange({ state: value === "all-states" ? "" : value })}
            >
              <SelectTrigger className="w-full sm:w-[150px] bg-route66-background border-route66-border hover:border-route66-primary transition-colors">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-states">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div className="min-w-0 flex-shrink-0">
            <label className="block text-sm font-medium text-route66-text-primary mb-2">
              City
            </label>
            <Select
              value={filters.city || "all-cities"}
              onValueChange={(value) => onFiltersChange({ city: value === "all-cities" ? "" : value })}
            >
              <SelectTrigger className="w-full sm:w-[150px] bg-route66-background border-route66-border hover:border-route66-primary transition-colors">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-cities">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="mt-6 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Search and Results Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <label className="block text-sm font-medium text-route66-text-primary mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-route66-text-muted h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Route 66 attractions and locations..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                className="pl-10 pr-10 bg-route66-background border-route66-border focus:border-route66-primary transition-colors"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ search: '' })}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-route66-background-section"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="bg-route66-background px-4 py-2 rounded-lg border border-route66-border mt-6">
              <span className="text-sm font-medium text-route66-text-primary">
                {filteredCount} of {totalCount} locations
              </span>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-route66-divider">
            <div className="flex flex-wrap gap-2">
              {filters.type !== 'all' && (
                <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm border border-route66-primary/20">
                  <span>Type: {filters.type.replace('_', ' ')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ type: 'all' })}
                    className="h-4 w-4 p-0 ml-1 hover:bg-route66-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.state && (
                <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm border border-route66-primary/20">
                  <span>State: {filters.state}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ state: '' })}
                    className="h-4 w-4 p-0 ml-1 hover:bg-route66-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.city && (
                <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm border border-route66-primary/20">
                  <span>City: {filters.city}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ city: '' })}
                    className="h-4 w-4 p-0 ml-1 hover:bg-route66-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.search && (
                <div className="flex items-center gap-1 bg-route66-primary/10 text-route66-primary px-3 py-1 rounded-full text-sm border border-route66-primary/20">
                  <span>Search: "{filters.search}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ search: '' })}
                    className="h-4 w-4 p-0 ml-1 hover:bg-route66-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
