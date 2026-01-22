
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
        {/* Enhanced Filter Controls with Visual Hierarchy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Type Filter */}
          <div className="space-y-3">
            <label htmlFor="category-select" className="text-sm font-bold text-route66-primary block tracking-wide uppercase">
              Category
            </label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFiltersChange({ type: value as FilterState['type'] })}
            >
              <SelectTrigger id="category-select" className="w-full h-12 bg-route66-background border-2 border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200 font-medium">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="attractions">Historic Attractions</SelectItem>
                <SelectItem value="drive_ins">Drive-In Theaters</SelectItem>
                <SelectItem value="hidden_gems">Hidden Gems</SelectItem>
                <SelectItem value="native_american">Native American Heritage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div className="space-y-3">
            <label htmlFor="state-select" className="text-sm font-bold text-route66-primary block tracking-wide uppercase">
              State
            </label>
            <Select
              value={filters.state || "all-states"}
              onValueChange={(value) => onFiltersChange({ state: value === "all-states" ? "" : value })}
            >
              <SelectTrigger id="state-select" className="w-full h-12 bg-route66-background border-2 border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200 font-medium">
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
          <div className="space-y-3">
            <label htmlFor="city-select" className="text-sm font-bold text-route66-primary block tracking-wide uppercase">
              City
            </label>
            <Select
              value={filters.city || "all-cities"}
              onValueChange={(value) => onFiltersChange({ city: value === "all-cities" ? "" : value })}
            >
              <SelectTrigger id="city-select" className="w-full h-12 bg-route66-background border-2 border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200 font-medium">
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
        </div>

        {/* Enhanced Search and Reset Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {/* Search Field with Better Visual Hierarchy */}
          <div className="flex-1 space-y-3">
            <label htmlFor="search-input" className="text-sm font-bold text-route66-primary block tracking-wide uppercase">
              Search Locations
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-route66-text-muted h-5 w-5" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search Route 66 locations..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                className="pl-12 pr-12 h-12 bg-route66-background border-2 border-route66-border hover:border-route66-primary/50 focus:border-route66-primary transition-all duration-200 font-medium text-base"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ search: '' })}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-route66-background-section"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {/* Results Count - Prominently Displayed */}
            <div className="text-right">
              <span className="text-sm font-semibold text-route66-primary bg-route66-primary/10 px-3 py-1 rounded-full border border-route66-primary/20">
                {filteredCount} of {totalCount} results
              </span>
            </div>
          </div>

          {/* Enhanced Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="h-12 px-6 border-2 border-route66-accent-red/30 text-route66-accent-red hover:bg-route66-accent-red hover:text-white hover:border-route66-accent-red transition-all duration-200 font-semibold"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Enhanced Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t-2 border-route66-divider">
            <div className="flex flex-wrap gap-3">
              {filters.type !== 'all' && (
                <div className="flex items-center gap-2 bg-route66-primary/15 text-route66-primary px-4 py-2 rounded-full text-sm font-medium border-2 border-route66-primary/20">
                  <span>Type: {filters.type.replace('_', ' ')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ type: 'all' })}
                    className="h-5 w-5 p-0 ml-1 hover:bg-route66-primary/30 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.state && (
                <div className="flex items-center gap-2 bg-route66-primary/15 text-route66-primary px-4 py-2 rounded-full text-sm font-medium border-2 border-route66-primary/20">
                  <span>State: {filters.state}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ state: '' })}
                    className="h-5 w-5 p-0 ml-1 hover:bg-route66-primary/30 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.city && (
                <div className="flex items-center gap-2 bg-route66-primary/15 text-route66-primary px-4 py-2 rounded-full text-sm font-medium border-2 border-route66-primary/20">
                  <span>City: {filters.city}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ city: '' })}
                    className="h-5 w-5 p-0 ml-1 hover:bg-route66-primary/30 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.search && (
                <div className="flex items-center gap-2 bg-route66-primary/15 text-route66-primary px-4 py-2 rounded-full text-sm font-medium border-2 border-route66-primary/20">
                  <span>Search: "{filters.search}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ search: '' })}
                    className="h-5 w-5 p-0 ml-1 hover:bg-route66-primary/30 rounded-full"
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
