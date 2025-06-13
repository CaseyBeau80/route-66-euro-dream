import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
interface WeatherCardHeaderProps {
  segment: DailySegment;
  segmentDate: Date;
}
const WeatherCardHeader: React.FC<WeatherCardHeaderProps> = ({
  segment,
  segmentDate
}) => {
  return;
};
export default WeatherCardHeader;