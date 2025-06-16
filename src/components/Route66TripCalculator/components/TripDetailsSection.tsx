
import React from 'react';
import { Calendar, Users } from 'lucide-react';

interface TripDetailsSectionProps {
  tripStartDate?: Date;
  travelDays: number;
  onStartDateChange: (date: Date | undefined) => void;
  onTravelDaysChange: (days: number) => void;
}

const TripDetailsSection: React.FC<TripDetailsSectionProps> = ({
  tripStartDate,
  travelDays,
  onStartDateChange,
  onTravelDaysChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <Calendar className="inline w-4 h-4 mr-1" />
          Trip Start Date
        </label>
        <input
          type="date"
          value={tripStartDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : undefined)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <Users className="inline w-4 h-4 mr-1" />
          Travel Days
        </label>
        <input
          type="number"
          value={travelDays}
          onChange={(e) => onTravelDaysChange(parseInt(e.target.value) || 0)}
          min="1"
          max="14"
          className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default TripDetailsSection;
