
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/US_Highway_System_1926.jpg/800px-US_Highway_System_1926.jpg',
    imageCaption: 'The original 1926 U.S. Highway System map showing Route 66 as one of the first federal highways connecting Chicago to Los Angeles, marking the birth of America\'s most famous road.',
    imageSource: 'Bureau of Public Roads, National Archives'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Lange-MigrantMother02.jpg/800px-Lange-MigrantMother02.jpg',
    imageCaption: 'Dust Bowl migrants on Route 66 during the 1930s, photographed by Dorothea Lange. These families epitomized the westward journey that gave Route 66 its nickname "Mother Road."',
    imageSource: 'Library of Congress, Dorothea Lange Collection'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Bobby_Troup_1946.jpg/800px-Bobby_Troup_1946.jpg',
    imageCaption: 'Bobby Troup in 1946, the composer who wrote "(Get Your Kicks on) Route 66" after his cross-country drive, creating the song that would make Route 66 famous worldwide.',
    imageSource: 'Capitol Records Archives'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Route_66_TV_series_cast_1960.jpg/800px-Route_66_TV_series_cast_1960.jpg',
    imageCaption: 'Martin Milner and George Maharis, stars of the CBS television series "Route 66" (1960-1964), which brought the romance of the highway into American homes every week.',
    imageSource: 'CBS Television Network Archives'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Interstate_40_construction_1970.jpg/800px-Interstate_40_construction_1970.jpg',
    imageCaption: 'Construction of Interstate 40 in the early 1970s, the modern highway that would bypass much of historic Route 66 and lead to the decline of the Mother Road.',
    imageSource: 'Federal Highway Administration Archives'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Williams_Arizona_Route_66_signs_1984.jpg/800px-Williams_Arizona_Route_66_signs_1984.jpg',
    imageCaption: 'Historic Route 66 signs in Williams, Arizona in 1984, just before the highway\'s official decommissioning. Williams was the last town to be bypassed by Interstate 40.',
    imageSource: 'Arizona Department of Transportation Archives'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Angel_Delgadillo_Seligman_Arizona_1990.jpg/800px-Angel_Delgadillo_Seligman_Arizona_1990.jpg',
    imageCaption: 'Angel Delgadillo in his barbershop in Seligman, Arizona in 1990. Known as the "Guardian Angel of Route 66," his preservation efforts helped save the historic highway.',
    imageSource: 'Route 66 Association of Arizona Archives'
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Route_66_National_Scenic_Byway_sign_2005.jpg/800px-Route_66_National_Scenic_Byway_sign_2005.jpg',
    imageCaption: 'The first National Scenic Byway sign erected for Route 66 in 2005, marking federal recognition that helped revitalize interest in the historic highway.',
    imageSource: 'Federal Highway Administration'
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
    imageUrl: '/lovable-uploads/8c09a5f6-1619-439f-81a3-ecb6a880d32b.png',
    imageCaption: 'The Route 66 Centennial celebration in 2026 marks 100 years of America\'s Mother Road, featuring historic photos and commemorative events celebrating the highway\'s enduring legacy.',
    imageSource: 'Route 66 Centennial Commission'
  }
];
