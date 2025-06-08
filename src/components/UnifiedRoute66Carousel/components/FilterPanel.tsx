
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
    <div className="bg-route66-background-alt rounded-xl p-6 border border-route66-border mb-8 shadow-sm">
      <div className="space-y-6">
        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-route66-text-primary block">
              Category
            </label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFiltersChange({ type: value as FilterState['type'] })}
            >
              <SelectTrigger className="w-full bg-route66-background border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="attractions">Historic Attractions</SelectItem>
                <SelectItem value="drive_ins">Drive-In Theaters</SelectItem>
                <SelectItem value="hidden_gems">Hidden Gems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-route66-text-primary block">
              State
            </label>
            <Select
              value={filters.state || "all-states"}
              onValueChange={(value) => onFiltersChange({ state: value === "all-states" ? "" : value })}
            >
              <SelectTrigger className="w-full bg-route66-background border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200">
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
          <div className="space-y-2">
            <label className="text-sm font-semibold text-route66-text-primary block">
              City
            </label>
            <Select
              value={filters.city || "all-cities"}
              onValueChange={(value) => onFiltersChange({ city: value === "all-cities" ? "" : value })}
            >
              <SelectTrigger className="w-full bg-route66-background border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200">
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

          {/* Results Count */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-route66-text-primary block">
              Results
            </label>
            <div className="flex items-center h-10 px-3 py-2 bg-route66-background-section border border-route66-border rounded-md">
              <span className="text-sm font-medium text-route66-text-primary">
                {filteredCount} of {totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Reset Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {/* Search Field */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-route66-text-primary block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-route66-text-muted h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Route 66 locations..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                className="pl-10 pr-10 bg-route66-background border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200"
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

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-route66-divider">
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
