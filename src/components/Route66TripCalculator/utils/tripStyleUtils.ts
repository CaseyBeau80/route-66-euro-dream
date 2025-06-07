
export const getTripStyleDisplayName = (style: string): string => {
  switch (style) {
    case 'balanced': return 'Balanced Experience';
    case 'destination-focused': return 'Destination Focused';
    default: return 'Custom Trip';
  }
};

export const getTripStyleDescription = (style: string): string => {
  switch (style) {
    case 'balanced': return 'Perfect mix of driving time and sightseeing at each stop';
    case 'destination-focused': return 'Prioritizes major heritage cities with strategic stops';
    default: return 'Customized to your preferences';
  }
};
