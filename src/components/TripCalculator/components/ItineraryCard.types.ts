
import { TripPlan } from '../services/planning/TripPlanBuilder';

export interface ItineraryCardProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  tripStyle?: 'balanced' | 'destination-focused' | 'custom';
  onViewDetails?: () => void;
  className?: string;
}

export interface TripStyleInfo {
  label: string;
  description: string;
  color: string;
}

export interface ItineraryCardTestProps extends ItineraryCardProps {
  'data-testid'?: string;
}
