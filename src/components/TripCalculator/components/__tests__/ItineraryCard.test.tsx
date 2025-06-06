
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(getByText('Your Route 66 Adventure')).toBeDefined();
    });

    it('displays route information', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(getByText('Chicago, IL → Los Angeles, CA')).toBeDefined();
    });

    it('shows trip statistics', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(getByText('7 Days')).toBeDefined();
      expect(getByText('2400 mi')).toBeDefined();
      expect(getByText('36h 0m')).toBeDefined();
    });

    it('displays cost placeholder', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(getByText('Coming Soon')).toBeDefined();
    });
  });

  describe('Trip Style Badge', () => {
    it('displays balanced trip style badge', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="balanced" />);
      expect(getByText('Balanced')).toBeDefined();
    });

    it('displays heritage-optimized badge for destination-focused style', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="destination-focused" />);
      expect(getByText('Heritage-Optimized')).toBeDefined();
    });

    it('displays custom badge for unknown style', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="custom" />);
      expect(getByText('Custom')).toBeDefined();
    });
  });

  describe('Date Display', () => {
    it('shows start and end dates when start date is provided', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} tripStartDate={mockStartDate} />);
      expect(getByText(/Starts:/)).toBeDefined();
      expect(getByText(/Ends:/)).toBeDefined();
    });

    it('does not show date section when no start date provided', () => {
      const { queryByText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(queryByText(/Starts:/)).toBeNull();
      expect(queryByText(/Ends:/)).toBeNull();
    });
  });

  describe('Action Button', () => {
    it('renders view details button when callback provided', () => {
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      expect(getByText('View Detailed Itinerary')).toBeDefined();
    });

    it('calls onViewDetails when button is clicked', async () => {
      const user = userEvent.setup();
      const { getByText } = render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      await user.click(getByText('View Detailed Itinerary'));
      expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    });

    it('does not render button when no callback provided', () => {
      const { queryByText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(queryByText('View Detailed Itinerary')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for statistics', () => {
      const { getByLabelText } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(getByLabelText('Trip duration')).toBeDefined();
      expect(getByLabelText('Total distance')).toBeDefined();
      expect(getByLabelText('Driving time')).toBeDefined();
      expect(getByLabelText('Estimated cost')).toBeDefined();
    });

    it('has screen reader accessible content', () => {
      const { container } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      const srElement = container.querySelector('.sr-only');
      expect(srElement?.textContent).toContain('Trip Overview');
    });

    it('has proper button accessibility when action provided', () => {
      const { getByRole } = render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      const button = getByRole('button');
      expect(button).toBeDefined();
      expect(button.getAttribute('aria-label')).toBe('View detailed itinerary');
    });

    it('has ARIA live region for dynamic updates', () => {
      const { getByRole } = render(<ItineraryCard tripPlan={mockTripPlan} />);
      const liveRegion = getByRole('status');
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
      const { getByText } = render(<ItineraryCard tripPlan={tripWithMinutes} />);
      expect(getByText('25h 30m')).toBeDefined();
    });

    it('formats whole hours correctly', () => {
      const tripWholeHours = { ...mockTripPlan, totalDrivingTime: 24 };
      const { getByText } = render(<ItineraryCard tripPlan={tripWholeHours} />);
      expect(getByText('24h 0m')).toBeDefined();
    });
  });
});
