
export const generateTags = (item: any, category: string): string[] => {
  const tags: string[] = [];
  
  if (item.featured) tags.push('Featured');
  if (item.state) tags.push(item.state);
  
  switch (category) {
    case 'destination_cities':
      if (item.population && item.population > 100000) tags.push('Major City');
      if (item.founded_year && item.founded_year < 1900) tags.push('Historic');
      break;
    case 'attractions':
      if (item.category) tags.push(item.category);
      if (item.admission_fee === 'Free') tags.push('Free Entry');
      break;
    case 'drive_ins':
      if (item.status === 'active') tags.push('Operating');
      if (item.year_opened && item.year_opened < 1960) tags.push('Classic');
      break;
    case 'route66_waypoints':
      if (item.is_major_stop) tags.push('Major Stop');
      if (item.highway_designation) tags.push(item.highway_designation);
      break;
    default:
      tags.push('Hidden Gem');
  }
  
  return tags;
};
