
export const getTripStyleDisplayName = (style: string): string => {
  switch (style) {
    case 'balanced': return 'Even Pacing';
    case 'destination-focused': return 'Heritage Cities';
    default: return 'Custom Trip';
  }
};

export const getTripStyleDescription = (style: string): string => {
  switch (style) {
    case 'balanced': return 'Consistent drive times with diverse stops and attractions';
    case 'destination-focused': return 'Prioritizes iconic Route 66 heritage cities and landmarks';
    default: return 'Customized to your preferences';
  }
};
