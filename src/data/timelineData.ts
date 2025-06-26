
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
    imageUrl: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Early Route 66 highway construction in the 1920s, showing the primitive road conditions that would soon connect America coast to coast.',
    imageSource: 'Historical Archives'
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
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Dust Bowl era travelers on Route 66, packed cars heading west in search of better opportunities during the Great Depression.',
    imageSource: 'Library of Congress Collection'
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
    imageUrl: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Post-war Route 66 roadside scene from the 1940s, when the highway became a symbol of American freedom and mobility.',
    imageSource: 'National Archives'
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
    imageUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Classic Route 66 architecture from the 1960s golden age, featuring the distinctive roadside motels and diners that defined the era.',
    imageSource: 'CBS Television Archives'
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
    imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Abandoned Route 66 businesses in the 1970s, showing the impact of Interstate highway construction on small communities.',
    imageSource: 'Department of Transportation Archives'
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
    imageUrl: '/lovable-uploads/d2b2f3b5-9867-467f-a160-bd1a3160dd09.png',
    imageCaption: 'The evolution of Route 66 - from historic gas stations to the famous Cadillac Ranch, showing the highway\'s transformation over the decades.',
    imageSource: 'Route 66 Association Archives'
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
    imageUrl: '/lovable-uploads/5a894926-b234-4e70-8d35-a78558fcffee.png',
    imageCaption: 'Angel Delgadillo, the "Guardian Angel of Route 66," whose preservation efforts helped save the historic highway and inspire a new generation of travelers.',
    imageSource: 'Route 66 Hall of Fame'
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
    imageUrl: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Restored Route 66 landmarks and scenic byway markers, representing the successful preservation efforts of the 2000s.',
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
    imageUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Modern Route 66 travelers celebrating the centennial, continuing the tradition of discovery and adventure on America\'s Mother Road.',
    imageSource: 'Route 66 Centennial Commission'
  }
];
