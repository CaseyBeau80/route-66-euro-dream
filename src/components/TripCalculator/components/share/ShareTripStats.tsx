import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { Car, Clock, MapPin, Star } from 'lucide-react';

interface ShareTripStatsProps {
  tripPlan: TripPlan;
}

const ShareTripStats: React.FC<ShareTripStatsProps> = ({ tripPlan }) => {
  const totalSegments = tripPlan.segments?.length || 0;
  const totalDistance = tripPlan.segments?.reduce((sum, segment) => sum + (segment.distance || 0), 0) || 0;
  // Use driveTimeHours instead of duration, and convert to minutes for consistency
  const totalDuration = tripPlan.segments?.reduce((sum, segment) => {
    const driveTime = segment.driveTimeHours || segment.drivingTime || 0;
    // Convert hours to minutes if using driveTimeHours, or use drivingTime directly if it's in minutes
    const durationInMinutes = segment.driveTimeHours ? segment.driveTimeHours * 60 : (segment.drivingTime || 0);
    return sum + durationInMinutes;
  }, 0) || 0;
  
  // Convert duration from minutes to hours
  const durationHours = Math.round(totalDuration / 60 * 10) / 10;

  const stats = [
    {
      icon: MapPin,
      label: 'Total Segments',
      value: totalSegments.toString(),
      color: 'blue'
    },
    {
      icon: Car,
      label: 'Total Distance',
      value: `${totalDistance.toFixed(0)} miles`,
      color: 'green'
    },
    {
      icon: Clock,
      label: 'Driving Time',
      value: `${durationHours}h`,
      color: 'orange'
    },
    {
      icon: Star,
      label: 'Route Quality',
      value: 'Premium',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-purple-100 text-purple-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${getColorClasses(stat.color)}`}>
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShareTripStats;
