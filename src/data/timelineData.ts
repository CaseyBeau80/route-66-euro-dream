
export interface TimelineMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'establishment' | 'cultural' | 'decline' | 'revival';
  icon: string;
  details?: string[];
  imageUrl?: string;
}

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: 'establishment-1926',
    year: 1926,
    title: 'Route 66 Officially Established',
    description: 'The Federal Highway Act creates the U.S. Highway System, and Route 66 is officially designated on November 11, 1926.',
    category: 'establishment',
    icon: '🛣️',
    details: [
      'Connected Chicago to Los Angeles',
      'Originally 2,448 miles long',
      'Crossed 8 states and 3 time zones',
      'Part of the new federal highway numbering system'
    ]
  },
  {
    id: 'establishment-1930s',
    year: 1930,
    title: 'Dust Bowl Migration',
    description: 'Route 66 becomes the primary path for families fleeing the Dust Bowl, earning the nickname "The Mother Road."',
    category: 'establishment',
    icon: '🌪️',
    details: [
      'Over 200,000 people migrated west',
      'Inspired John Steinbeck\'s "The Grapes of Wrath"',
      'Highway became symbol of hope and opportunity',
      'Led to development of motor courts and diners'
    ]
  },
  {
    id: 'establishment-1937',
    year: 1937,
    title: 'Fully Paved',
    description: 'Route 66 becomes the first transcontinental highway to be completely paved from end to end.',
    category: 'establishment',
    icon: '🛤️',
    details: [
      'Last section paved in Oklahoma',
      'Enabled year-round travel',
      'Boosted tourism and commerce',
      'Set standard for other highways'
    ]
  },
  {
    id: 'cultural-1946',
    year: 1946,
    title: '"(Get Your Kicks on) Route 66" Released',
    description: 'Bobby Troup\'s hit song immortalizes Route 66 in popular culture and introduces it to millions.',
    category: 'cultural',
    icon: '🎵',
    details: [
      'Written by Bobby Troup',
      'First recorded by Nat King Cole',
      'Later covered by countless artists',
      'Made Route 66 internationally famous'
    ]
  },
  {
    id: 'cultural-1950s',
    year: 1950,
    title: 'Golden Age of Road Travel',
    description: 'Post-war prosperity leads to the golden age of automobile travel and Route 66 tourism.',
    category: 'cultural',
    icon: '🚗',
    details: [
      'Rise of car culture',
      'Growth of roadside attractions',
      'Development of motel chains',
      'Birth of fast food restaurants'
    ]
  },
  {
    id: 'cultural-1960',
    year: 1960,
    title: 'Route 66 TV Series Debuts',
    description: 'The hit television series "Route 66" brings the highway into living rooms across America.',
    category: 'cultural',
    icon: '📺',
    details: [
      'Ran for 4 seasons (1960-1964)',
      'Starred Martin Milner and George Maharis',
      'Filmed on location along the actual highway',
      'Theme song by Nelson Riddle became iconic'
    ]
  },
  {
    id: 'decline-1956',
    year: 1956,
    title: 'Interstate Highway System Authorized',
    description: 'The Federal-Aid Highway Act authorizes the Interstate Highway System, beginning Route 66\'s decline.',
    category: 'decline',
    icon: '🏗️',
    details: [
      'Eisenhower signed the Federal-Aid Highway Act',
      'Created 41,000-mile Interstate system',
      'Bypassed many Route 66 communities',
      'Marked beginning of the end for Route 66'
    ]
  },
  {
    id: 'decline-1970s',
    year: 1970,
    title: 'Interstate Bypasses Begin',
    description: 'Interstate highways begin bypassing Route 66 towns, leading to economic decline along the route.',
    category: 'decline',
    icon: '🏪',
    details: [
      'Towns like Williams, AZ were bypassed',
      'Many businesses closed',
      'Population declined in Route 66 communities',
      'Highway began falling into disrepair'
    ]
  },
  {
    id: 'decline-1985',
    year: 1985,
    title: 'Route 66 Officially Decommissioned',
    description: 'Route 66 is officially removed from the U.S. Highway System as the last section is bypassed by Interstate 40.',
    category: 'decline',
    icon: '⛔',
    details: [
      'Last section bypassed in Williams, Arizona',
      'Replaced entirely by Interstate highways',
      'End of an era for the Mother Road',
      'Many feared the highway would be forgotten'
    ]
  },
  {
    id: 'revival-1990',
    year: 1990,
    title: 'Route 66 Association Founded',
    description: 'The Route 66 Association is formed to preserve and promote the historic highway.',
    category: 'revival',
    icon: '🤝',
    details: [
      'Grassroots preservation effort',
      'Worked to save historic landmarks',
      'Promoted heritage tourism',
      'Coordinated with state governments'
    ]
  },
  {
    id: 'revival-1999',
    year: 1999,
    title: 'National Historic Route 66 Federation',
    description: 'Formation of the National Historic Route 66 Federation to coordinate preservation efforts.',
    category: 'revival',
    icon: '🏛️',
    details: [
      'United preservation groups',
      'Worked with National Park Service',
      'Promoted Route 66 as tourist destination',
      'Coordinated restoration projects'
    ]
  },
  {
    id: 'revival-2008',
    year: 2008,
    title: 'Route 66 Corridor Preservation Program',
    description: 'Federal funding established for Route 66 preservation and promotion through the National Park Service.',
    category: 'revival',
    icon: '💰',
    details: [
      'Federal preservation funding',
      'Partnership with National Park Service',
      'Support for heritage tourism',
      'Protection of historic sites'
    ]
  },
  {
    id: 'revival-2026',
    year: 2026,
    title: 'Route 66 Centennial Celebration',
    description: 'The 100th anniversary of Route 66 brings worldwide attention to America\'s Mother Road.',
    category: 'revival',
    icon: '🎉',
    details: [
      'Worldwide celebration of Route 66',
      'Renewed interest in heritage tourism',
      'Major restoration projects completed',
      'Legacy secured for future generations'
    ]
  }
];

export const categoryColors = {
  establishment: 'border-l-green-500 bg-green-50',
  cultural: 'border-l-purple-500 bg-purple-50',
  decline: 'border-l-orange-500 bg-orange-50',
  revival: 'border-l-route66-primary bg-blue-50'
};

export const categoryLabels = {
  establishment: 'Highway Establishment',
  cultural: 'Cultural Impact',
  decline: 'Interstate Era',
  revival: 'Modern Revival'
};
