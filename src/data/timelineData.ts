
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

export const categoryLabels = {
  establishment: 'Establishment Era',
  cultural: 'Cultural Golden Age',
  decline: 'Decline Period',
  revival: 'Revival & Preservation'
} as const;

export const categoryColors = {
  establishment: 'bg-green-50',
  cultural: 'bg-purple-50', 
  decline: 'bg-orange-50',
  revival: 'bg-blue-50'
} as const;

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: 'route66-establishment',
    year: 1926,
    title: 'Route 66 Officially Designated',
    description: 'The Federal Highway Act establishes Route 66 as one of the original numbered highways, connecting Chicago to Los Angeles across 2,448 miles of American landscape.',
    category: 'establishment',
    icon: '🛣️',
    details: [
      'Original length: 2,448 miles from Chicago, IL to Santa Monica, CA',
      'Part of the original federal highway numbering system',
      'Connected existing roads and trails into a continuous route',
      'Became known as the "Main Street of America"'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/US_66_shield_1926.svg/240px-US_66_shield_1926.svg.png',
    imageCaption: 'Original Route 66 highway shield design from 1926, marking the beginning of America\'s most famous road.',
    imageSource: 'Wikimedia Commons'
  },
  {
    id: 'dust-bowl-migration',
    year: 1930,
    title: 'The Dust Bowl Migration',
    description: 'During the Great Depression, hundreds of thousands of families traveled Route 66 westward, earning it the nickname "Mother Road" from John Steinbeck\'s novel.',
    category: 'cultural',
    icon: '🌪️',
    details: [
      'Over 200,000 people migrated west on Route 66 during the 1930s',
      'Immortalized in John Steinbeck\'s "The Grapes of Wrath"',
      'Created lasting cultural associations with hope and opportunity',
      'Established roadside businesses and motor courts along the route'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Lange-MigrantMother02.jpg/256px-Lange-MigrantMother02.jpg',
    imageCaption: 'Dorothea Lange\'s "Migrant Mother" (1936) became an iconic image of the Dust Bowl era, when families traveled Route 66 seeking better opportunities.',
    imageSource: 'Library of Congress'
  },
  {
    id: 'bobby-troup-song',
    year: 1946,
    title: 'Get Your Kicks on Route 66',
    description: 'Bobby Troup\'s hit song popularizes Route 66 in American culture, later covered by artists like Nat King Cole and the Rolling Stones.',
    category: 'cultural',
    icon: '🎵',
    details: [
      'Written by Bobby Troup after driving Route 66 from Pennsylvania to California',
      'First recorded by Nat King Cole, becoming a major hit',
      'Later covered by Chuck Berry, Rolling Stones, and many others',
      'Helped cement Route 66\'s place in American popular culture'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Nat_King_Cole_1947.jpg/220px-Nat_King_Cole_1947.jpg',
    imageCaption: 'Nat King Cole in 1947, whose recording of "(Get Your Kicks on) Route 66" helped make the highway a cultural icon.',
    imageSource: 'William P. Gottlieb Collection, Library of Congress'
  },
  {
    id: 'route66-tv-series',
    year: 1960,
    title: 'Route 66 Television Series',
    description: 'The CBS television series "Route 66" brings the highway into American living rooms, following two young men traveling the road in a Corvette.',
    category: 'cultural',
    icon: '📺',
    details: [
      'Ran from 1960-1964 on CBS television',
      'Starred Martin Milner and George Maharis',
      'Featured a 1960 Chevrolet Corvette as the main "character"',
      'Filmed on location across America, showcasing Route 66 landscapes'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Route_66_TV_show_Corvette.jpg/320px-Route_66_TV_show_Corvette.jpg',
    imageCaption: 'The iconic 1960 Chevrolet Corvette from the Route 66 TV series, which helped popularize both the car and the highway.',
    imageSource: 'CBS Television/Public Domain'
  },
  {
    id: 'interstate-bypass',
    year: 1970,
    title: 'Interstate System Bypasses Route 66',
    description: 'The Interstate Highway System begins bypassing Route 66 sections, leading to the decline of many roadside businesses and small towns.',
    category: 'decline',
    icon: '🚧',
    details: [
      'Interstate 40 and other highways provided faster alternatives',
      'Many small towns and businesses along Route 66 were bypassed',
      'Gas stations, motels, and restaurants began closing',
      'Started the economic decline of Route 66 communities'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Interstate_40_Arizona.jpg/320px-Interstate_40_Arizona.jpg',
    imageCaption: 'Interstate 40 in Arizona, one of the modern highways that bypassed historic Route 66, contributing to its decline.',
    imageSource: 'Wikimedia Commons'
  },
  {
    id: 'route66-decommissioned',
    year: 1985,
    title: 'Route 66 Officially Decommissioned',
    description: 'The American Association of State Highway Officials removes Route 66 from the U.S. Highway System, ending its 59-year official existence.',
    category: 'decline',
    icon: '🚫',
    details: [
      'Williams, Arizona was the last town to be bypassed by Interstate 40',
      'Route 66 shields were officially removed from the highway system',
      'Many sections became state roads or were abandoned',
      'Marked the end of Route 66 as an official U.S. Highway'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Williams_Arizona_Route_66.jpg/320px-Williams_Arizona_Route_66.jpg',
    imageCaption: 'Williams, Arizona - the last town on Route 66 to be bypassed by the Interstate system in 1984, marking the highway\'s final chapter.',
    imageSource: 'Wikimedia Commons'
  },
  {
    id: 'preservation-movement',
    year: 1990,
    title: 'Route 66 Preservation Movement Begins',
    description: 'Grassroots organizations and state governments begin efforts to preserve and promote the historic route as a cultural and tourism asset.',
    category: 'revival',
    icon: '🏛️',
    details: [
      'Route 66 associations formed in multiple states',
      'Historic preservation efforts began for roadside architecture',
      'Tourism promotion campaigns launched',
      'National Scenic Byway designation sought'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Route66_Sign_Hackberry_AZ.jpg/320px-Route66_Sign_Hackberry_AZ.jpg',
    imageCaption: 'Restored Route 66 signage in Hackberry, Arizona, representing the preservation efforts that began in the 1990s.',
    imageSource: 'Wikimedia Commons'
  },
  {
    id: 'national-scenic-byway',
    year: 2005,
    title: 'National Scenic Byway Designation',
    description: 'Route 66 receives National Scenic Byway designation, providing federal support for preservation and tourism development efforts.',
    category: 'revival',
    icon: '🏞️',
    details: [
      'Received All-American Road designation in several states',
      'Federal funding became available for preservation projects',
      'Increased tourism promotion and marketing efforts',
      'Enhanced protection for historic sites and landscapes'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/US_Route_66_National_Scenic_Byway.jpg/320px-US_Route_66_National_Scenic_Byway.jpg',
    imageCaption: 'National Scenic Byway marker for Route 66, recognizing its cultural and historical significance.',
    imageSource: 'National Park Service'
  },
  {
    id: 'centennial-celebration',
    year: 2026,
    title: 'Route 66 Centennial Celebration',
    description: 'The 100th anniversary of Route 66 brings renewed attention and celebration of America\'s most famous highway and its enduring cultural legacy.',
    category: 'revival',
    icon: '🎉',
    details: [
      'Nationwide celebrations and festivals planned',
      'Special commemorative events in all Route 66 states',
      'Documentary films and books highlighting the highway\'s history',
      'Renewed interest in Route 66 travel and preservation'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Route_66_Santa_Monica.jpg/320px-Route_66_Santa_Monica.jpg',
    imageCaption: 'The famous "End of the Trail" sign at Santa Monica Pier, marking the western terminus of historic Route 66.',
    imageSource: 'Wikimedia Commons'
  }
];
