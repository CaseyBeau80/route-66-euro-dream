
export const getTripStyleDisplayName = (style: string): string => {
  // FIXED: Only support destination-focused style
  return 'Heritage Cities Focus';
};

export const getTripStyleDescription = (style: string): string => {
  // FIXED: Updated description with drive time limits
  return 'Prioritizes iconic Route 66 heritage cities with realistic drive times (max 8 hours/day)';
};
