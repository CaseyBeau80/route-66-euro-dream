
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ItineraryCard from '../ItineraryCard';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

// Mock the UnitContext
const mockFormatDistance = vi.fn((distance: number) => `${distance} mi`);
vi.mock('@/contexts/UnitContext', () => ({
  useUnits: () => ({
    formatDistance: mockFormatDistance
  })
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  addDays: vi.fn((date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)),
  format: vi.fn((date: Date, formatStr: string) => {
    if (formatStr === 'MMM d, yyyy') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return date.toISOString();
  })
}));

describe('ItineraryCard', () => {
  const mockTripPlan: TripPlan = {
    id: 'test-trip-1',
    title: 'Chicago to Los Angeles Route 66 Trip',
    startCity: 'Chicago, IL',
    endCity: 'Los Angeles, CA',
    startDate: new Date('2024-06-01'),
    totalDays: 7,
    totalDistance: 2400,
    totalDrivingTime: 36,
    totalMiles: 2400,
    segments: [],
    dailySegments: []
  };

  const mockStartDate = new Date('2024-06-01');
  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the trip title correctly', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('Your Route 66 Adventure')).toBeDefined();
    });

    it('displays route information', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('Chicago, IL → Los Angeles, CA')).toBeDefined();
    });

    it('shows trip statistics', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('7 Days')).toBeDefined();
      expect(screen.getByText('2400 mi')).toBeDefined();
      expect(screen.getByText('36h 0m')).toBeDefined();
    });

    it('displays cost placeholder', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('Coming Soon')).toBeDefined();
    });
  });

  describe('Trip Style Badge', () => {
    it('displays balanced trip style badge', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="balanced" />);
      expect(screen.getByText('Balanced')).toBeDefined();
    });

    it('displays heritage-optimized badge for destination-focused style', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="destination-focused" />);
      expect(screen.getByText('Heritage-Optimized')).toBeDefined();
    });

    it('displays custom badge for unknown style', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="custom" />);
      expect(screen.getByText('Custom')).toBeDefined();
    });
  });

  describe('Date Display', () => {
    it('shows start and end dates when start date is provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStartDate={mockStartDate} />);
      expect(screen.getByText(/Starts:/)).toBeDefined();
      expect(screen.getByText(/Ends:/)).toBeDefined();
    });

    it('does not show date section when no start date provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.queryByText(/Starts:/)).toBeNull();
      expect(screen.queryByText(/Ends:/)).toBeNull();
    });
  });

  describe('Action Button', () => {
    it('renders view details button when callback provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      expect(screen.getByText('View Detailed Itinerary')).toBeDefined();
    });

    it('calls onViewDetails when button is clicked', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      fireEvent.click(screen.getByText('View Detailed Itinerary'));
      expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    });

    it('does not render button when no callback provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.queryByText('View Detailed Itinerary')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for statistics', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByLabelText('Trip duration')).toBeDefined();
      expect(screen.getByLabelText('Total distance')).toBeDefined();
      expect(screen.getByLabelText('Driving time')).toBeDefined();
      expect(screen.getByLabelText('Estimated cost')).toBeDefined();
    });

    it('has screen reader accessible content', () => {
      const { container } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      const srElement = container.querySelector('.sr-only');
      expect(srElement?.textContent).toContain('Trip Overview');
    });

    it('has proper button accessibility when action provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      const button = screen.getByRole('button');
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toBe('View detailed itinerary');
    });

    it('has ARIA live region for dynamic updates', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      const liveRegion = screen.getByRole('status');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ItineraryCard tripPlan={mockTripPlan} className="custom-class" />
      );
      expect(container.firstChild?.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Time Formatting', () => {
    it('formats hours and minutes correctly', () => {
      const tripWithMinutes = { ...mockTripPlan, totalDrivingTime: 25.5 };
      render(<ItineraryCard tripPlan={tripWithMinutes} />);
      expect(screen.getByText('25h 30m')).toBeDefined();
    });

    it('formats whole hours correctly', () => {
      const tripWholeHours = { ...mockTripPlan, totalDrivingTime: 24 };
      render(<ItineraryCard tripPlan={tripWholeHours} />);
      expect(screen.getByText('24h 0m')).toBeDefined();
    });
  });
});
