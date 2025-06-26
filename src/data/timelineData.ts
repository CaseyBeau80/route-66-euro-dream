
export interface TimelineMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'establishment' | 'cultural' | 'decline' | 'revival';
  icon: string;
  details?: string[];
  imageUrl?: string;
  imageCaption?: string;
  imageSource?: string;
}

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: 'establishment-1926',
    year: 1926,
    title: 'Route 66 Officially Established',
    description: 'The Federal Highway Act creates the U.S. Highway System, and Route 66 is officially designated on November 11, 1926.',
    category: 'establishment',
    icon: '🛣️',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/US_66_shield.svg/240px-US_66_shield.svg.png',
    imageCaption: 'The original U.S. Route 66 highway shield, adopted in 1926 as part of the new federal highway numbering system.',
    imageSource: 'Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lange-MigrantMother02.jpg/330px-Lange-MigrantMother02.jpg',
    imageCaption: 'Migrant Mother by Dorothea Lange (1936) - An iconic image representing the Dust Bowl migration when over 200,000 people traveled west on Route 66 seeking better opportunities.',
    imageSource: 'Library of Congress / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Route_66_road_construction_1930s.jpg/400px-Route_66_road_construction_1930s.jpg',
    imageCaption: 'Road construction crews paving a section of Route 66 in the 1930s. The completion of paving in 1937 made Route 66 the first fully paved transcontinental highway.',
    imageSource: 'National Archives / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Nat_King_Cole_1947.jpg/260px-Nat_King_Cole_1947.jpg',
    imageCaption: 'Nat King Cole in 1947, who recorded the first version of "(Get Your Kicks on) Route 66" written by Bobby Troup, bringing the highway into popular culture.',
    imageSource: 'William P. Gottlieb Collection / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Route_66_Motel_Sign_1950s.jpg/400px-Route_66_Motel_Sign_1950s.jpg',
    imageCaption: 'A classic neon motel sign from the 1950s along Route 66, representing the golden age of American road travel when families embraced car culture and road trips.',
    imageSource: 'Route 66 Association Archives / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Route_66_TV_show_Corvette.jpg/400px-Route_66_TV_show_Corvette.jpg',
    imageCaption: 'The iconic Chevrolet Corvette from the Route 66 TV series (1960-1964), driven by characters Tod Stiles and Buz Murdock as they traveled America\'s highways.',
    imageSource: 'CBS Television / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Eisenhower_signing_Federal_Aid_Highway_Act.jpg/400px-Eisenhower_signing_Federal_Aid_Highway_Act.jpg',
    imageCaption: 'President Dwight D. Eisenhower signing the Federal-Aid Highway Act of 1956, which authorized the Interstate Highway System and ultimately led to Route 66\'s decline.',
    imageSource: 'National Archives / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Abandoned_gas_station_Route_66.jpg/400px-Abandoned_gas_station_Route_66.jpg',
    imageCaption: 'An abandoned gas station along Route 66, symbolic of the economic decline that hit many Route 66 communities as Interstate highways bypassed small towns in the 1970s.',
    imageSource: 'Historic Route 66 Archives / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Route_66_End_Sign_Williams_Arizona.jpg/400px-Route_66_End_Sign_Williams_Arizona.jpg',
    imageCaption: 'The ceremonial "End of Route 66" sign in Williams, Arizona, marking where the last section of the historic highway was bypassed by Interstate 40 in 1985.',
    imageSource: 'Arizona Department of Transportation / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Historic_Route_66_Sign.jpg/400px-Historic_Route_66_Sign.jpg',
    imageCaption: 'A Historic Route 66 brown road sign, part of the preservation efforts that began in the 1990s to mark and maintain the historic highway for future generations.',
    imageSource: 'Federal Highway Administration / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Route_66_Museum_Clinton_Oklahoma.jpg/400px-Route_66_Museum_Clinton_Oklahoma.jpg',
    imageCaption: 'The Route 66 Museum in Clinton, Oklahoma, one of several museums established during the revival period to preserve and share the history of America\'s Mother Road.',
    imageSource: 'Oklahoma Historical Society / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Route_66_Chicago_Begin_Sign.jpg/400px-Route_66_Chicago_Begin_Sign.jpg',
    imageCaption: 'The "Begin Route 66" sign at the start of the historic highway in Chicago, Illinois, restored as part of federal preservation efforts beginning in 2008.',
    imageSource: 'National Park Service / Wikimedia Commons',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Route_66_Santa_Monica_End_Sign.jpg/400px-Route_66_Santa_Monica_End_Sign.jpg',
    imageCaption: 'The "End of Trail" Route 66 sign at Santa Monica Pier, California, where the historic highway meets the Pacific Ocean - a symbol of the American dream and the spirit of adventure.',
    imageSource: 'Santa Monica Tourism Board / Wikimedia Commons',
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
