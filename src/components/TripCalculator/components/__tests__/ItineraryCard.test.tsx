
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
    title: 'Chicago to Los Angeles Route 66 Trip',
    startCity: 'Chicago, IL',
    endCity: 'Los Angeles, CA',
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
      expect(screen.getByText('Your Route 66 Adventure')).toBeInTheDocument();
    });

    it('displays route information', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('Chicago, IL → Los Angeles, CA')).toBeInTheDocument();
    });

    it('shows trip statistics', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('7 Days')).toBeInTheDocument();
      expect(screen.getByText('2400 mi')).toBeInTheDocument();
      expect(screen.getByText('36h 0m')).toBeInTheDocument();
    });

    it('displays cost placeholder', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });
  });

  describe('Trip Style Badge', () => {
    it('displays balanced trip style badge', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="balanced" />);
      expect(screen.getByText('Balanced')).toBeInTheDocument();
    });

    it('displays heritage-optimized badge for destination-focused style', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="destination-focused" />);
      expect(screen.getByText('Heritage-Optimized')).toBeInTheDocument();
    });

    it('displays custom badge for unknown style', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStyle="custom" />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    it('shows start and end dates when start date is provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} tripStartDate={mockStartDate} />);
      expect(screen.getByText(/Starts:/)).toBeInTheDocument();
      expect(screen.getByText(/Ends:/)).toBeInTheDocument();
    });

    it('does not show date section when no start date provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.queryByText(/Starts:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Ends:/)).not.toBeInTheDocument();
    });
  });

  describe('Action Button', () => {
    it('renders view details button when callback provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      expect(screen.getByText('View Detailed Itinerary')).toBeInTheDocument();
    });

    it('calls onViewDetails when button is clicked', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      fireEvent.click(screen.getByText('View Detailed Itinerary'));
      expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    });

    it('does not render button when no callback provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.queryByText('View Detailed Itinerary')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for statistics', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByRole('group', { name: 'Trip duration' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Total distance' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Driving time' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Estimated cost' })).toBeInTheDocument();
    });

    it('has screen reader accessible content', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      expect(screen.getByText('Trip Overview')).toHaveClass('sr-only');
    });

    it('has proper button accessibility when action provided', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockOnViewDetails} />);
      const button = screen.getByRole('button', { name: 'View detailed itinerary' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'View detailed itinerary');
    });

    it('has ARIA live region for dynamic updates', () => {
      render(<ItineraryCard tripPlan={mockTripPlan} />);
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ItineraryCard tripPlan={mockTripPlan} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Time Formatting', () => {
    it('formats hours and minutes correctly', () => {
      const tripWithMinutes = { ...mockTripPlan, totalDrivingTime: 25.5 };
      render(<ItineraryCard tripPlan={tripWithMinutes} />);
      expect(screen.getByText('25h 30m')).toBeInTheDocument();
    });

    it('formats whole hours correctly', () => {
      const tripWholeHours = { ...mockTripPlan, totalDrivingTime: 24 };
      render(<ItineraryCard tripPlan={tripWholeHours} />);
      expect(screen.getByText('24h 0m')).toBeInTheDocument();
    });
  });
});
