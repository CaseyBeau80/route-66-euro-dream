
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ItineraryCard from '../ItineraryCard';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

// Mock dependencies
vi.mock('@/contexts/UnitContext', () => ({
  useUnits: () => ({
    formatDistance: (distance: number) => `${distance} mi`
  })
}));

vi.mock('date-fns', () => ({
  addDays: vi.fn((date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)),
  format: vi.fn((date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
}));

describe('ItineraryCard Snapshots', () => {
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

  it('renders basic itinerary card correctly', () => {
    const { container } = render(<ItineraryCard tripPlan={mockTripPlan} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with trip dates', () => {
    const startDate = new Date('2024-06-01');
    const { container } = render(
      <ItineraryCard tripPlan={mockTripPlan} tripStartDate={startDate} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with balanced trip style', () => {
    const { container } = render(
      <ItineraryCard tripPlan={mockTripPlan} tripStyle="balanced" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with destination-focused trip style', () => {
    const { container } = render(
      <ItineraryCard tripPlan={mockTripPlan} tripStyle="destination-focused" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with action button', () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <ItineraryCard tripPlan={mockTripPlan} onViewDetails={mockCallback} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders full featured card', () => {
    const mockCallback = vi.fn();
    const startDate = new Date('2024-06-01');
    const { container } = render(
      <ItineraryCard 
        tripPlan={mockTripPlan} 
        tripStartDate={startDate}
        tripStyle="destination-focused"
        onViewDetails={mockCallback}
        className="custom-test-class"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
