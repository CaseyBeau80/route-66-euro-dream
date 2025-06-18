
import type { Meta, StoryObj } from '@storybook/react';
import ItineraryCard from '../ItineraryCard';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

const meta: Meta<typeof ItineraryCard> = {
  title: 'TripCalculator/Components/ItineraryCard',
  component: ItineraryCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Enhanced ItineraryCard component displaying trip summary with accessibility features and blue theme.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', padding: '20px' }}>
        <Story />
      </div>
    )
  ],
  argTypes: {
    tripStyle: {
      control: 'select',
      options: ['balanced', 'destination-focused', 'custom']
    },
    tripStartDate: {
      control: 'date'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ItineraryCard>;

const mockTripPlan: TripPlan = {
  id: 'story-trip-1',
  title: 'Chicago to Los Angeles Route 66 Trip',
  startCity: 'Chicago, IL',
  endCity: 'Los Angeles, CA',
  startLocation: 'Chicago, IL',
  endLocation: 'Los Angeles, CA',
  startDate: new Date('2024-06-01'),
  totalDays: 7,
  totalDistance: 2400,
  totalDrivingTime: 36,
  totalMiles: 2400,
  tripStyle: 'balanced',
  lastUpdated: new Date('2024-06-01'),
  segments: [],
  dailySegments: [],
  stops: []
};

export const Default: Story = {
  args: {
    tripPlan: mockTripPlan
  }
};

export const WithDates: Story = {
  args: {
    tripPlan: mockTripPlan,
    tripStartDate: new Date('2024-06-01')
  }
};

export const BalancedStyle: Story = {
  args: {
    tripPlan: mockTripPlan,
    tripStyle: 'balanced',
    tripStartDate: new Date('2024-06-01')
  }
};

export const DestinationFocusedStyle: Story = {
  args: {
    tripPlan: mockTripPlan,
    tripStyle: 'destination-focused',
    tripStartDate: new Date('2024-06-01')
  }
};

export const WithActionButton: Story = {
  args: {
    tripPlan: mockTripPlan,
    tripStartDate: new Date('2024-06-01'),
    tripStyle: 'destination-focused',
    onViewDetails: () => alert('View details clicked!')
  }
};

export const ShortTrip: Story = {
  args: {
    tripPlan: {
      ...mockTripPlan,
      id: 'story-trip-2',
      totalDays: 3,
      totalDistance: 800,
      totalDrivingTime: 12,
      startCity: 'St. Louis, MO',
      endCity: 'Oklahoma City, OK'
    },
    tripStartDate: new Date('2024-07-15'),
    tripStyle: 'balanced'
  }
};

export const LongTrip: Story = {
  args: {
    tripPlan: {
      ...mockTripPlan,
      id: 'story-trip-3',
      totalDays: 14,
      totalDistance: 2500,
      totalDrivingTime: 45,
      totalMiles: 2500
    },
    tripStartDate: new Date('2024-08-01'),
    tripStyle: 'destination-focused',
    onViewDetails: () => console.log('Viewing long trip details')
  }
};

export const CustomStyle: Story = {
  args: {
    tripPlan: mockTripPlan,
    tripStyle: 'custom',
    className: 'shadow-xl'
  }
};
