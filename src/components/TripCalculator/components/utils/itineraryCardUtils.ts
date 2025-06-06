
export const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getTripStyleInfo = (tripStyle?: string) => {
  switch (tripStyle) {
    case 'destination-focused':
      return {
        label: 'Heritage-Optimized',
        description: 'Prioritizes consecutive major Route 66 heritage cities for an authentic Mother Road experience',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      };
    case 'balanced':
      return {
        label: 'Balanced',
        description: 'Evenly distributes driving time across all days for consistent daily travel',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    default:
      return {
        label: 'Custom',
        description: 'Custom trip planning approach',
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
  }
};
