
export interface TimelineMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'establishment' | 'cultural' | 'decline' | 'preservation';
  icon: string;
  details?: string[];
  imageUrl?: string;
  imageCaption?: string;
  imageSource?: string;
}

export const categoryColors = {
  establishment: 'bg-green-50',
  cultural: 'bg-purple-50',
  decline: 'bg-orange-50',
  preservation: 'bg-blue-50'
};

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: 'founding',
    year: 1926,
    title: 'The Birth of Route 66',
    description: 'Federal Highway Act creates the U.S. Highway System, officially establishing Route 66 as one of the original federal highways.',
    category: 'establishment',
    icon: '🛣️',
    details: [
      'Route 66 officially designated on November 11, 1926',
      'Stretched 2,448 miles from Chicago to Santa Monica',
      'Originally mostly unpaved dirt roads',
      'Connected small farming communities to major cities'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/US_66_shield_1926.svg/200px-US_66_shield_1926.svg.png',
    imageCaption: 'The original Route 66 highway shield design from 1926, marking the beginning of America\'s most famous road.',
    imageSource: 'U.S. Federal Highway Administration / Wikimedia Commons'
  },
  {
    id: 'dust-bowl',
    year: 1930,
    title: 'Dust Bowl Migration',
    description: 'Route 66 becomes the primary escape route for families fleeing the Dust Bowl, earning the nickname "Mother Road."',
    category: 'cultural',
    icon: '🌪️',
    details: [
      'Over 200,000 people migrated west on Route 66',
      'John Steinbeck immortalized the road in "The Grapes of Wrath"',
      'Route became symbol of hope and opportunity',
      'Many gas stations and diners established to serve migrants'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Lange-MigrantMother02.jpg/256px-Lange-MigrantMother02.jpg',
    imageCaption: 'Dorothea Lange\'s iconic "Migrant Mother" photograph from 1936, representing the families who traveled Route 66 during the Dust Bowl era seeking better opportunities in California.',
    imageSource: 'Dorothea Lange / Library of Congress'
  },
  {
    id: 'paving-complete',
    year: 1937,
    title: 'First Fully Paved Section',
    description: 'The first continuous paved section of Route 66 is completed, making cross-country travel more reliable.',
    category: 'establishment',
    icon: '🚧',
    details: [
      'Paving project cost over $70 million',
      'Reduced travel time from weeks to days',
      'Boosted tourism and commerce along the route',
      'Set standard for modern highway construction'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Route_66_pavement_1930s.jpg/512px-Route_66_pavement_1930s.jpg',
    imageCaption: 'Workers paving a section of Route 66 in the 1930s. The completion of paved sections transformed the highway from a dusty trail into a modern roadway.',
    imageSource: 'National Archives / Route 66 Association'
  },
  {
    id: 'wartime-route',
    year: 1940,
    title: 'World War II Highway',
    description: 'Route 66 serves as a crucial military supply route and transportation corridor during World War II.',
    category: 'cultural',
    icon: '⚔️',
    details: [
      'Military convoys regularly used the highway',
      'Defense plants built along the route',
      'Population boom in western cities',
      'Infrastructure improvements for military needs'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/WWII_convoy_Route_66.jpg/512px-WWII_convoy_Route_66.jpg',
    imageCaption: 'A military convoy traveling on Route 66 during World War II, when the highway served as a vital supply line connecting the industrial Midwest to defense plants in California.',
    imageSource: 'U.S. Army Corps of Engineers / National Archives'
  },
  {
    id: 'celebration',
    year: 1946,
    title: 'Post-War Celebration',
    description: 'America celebrates the end of WWII with a surge in leisure travel and tourism along Route 66.',
    category: 'cultural',
    icon: '🎉',
    details: [
      'Veterans returned home with savings to spend',
      'New car production resumed after wartime halt',
      'Family road trips became popular American pastime',
      'Motels and restaurants flourished'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Route_66_family_vacation_1946.jpg/512px-Route_66_family_vacation_1946.jpg',
    imageCaption: 'A family poses with their car on Route 66 in 1946, representing the post-war boom in leisure travel as Americans celebrated peace and prosperity.',
    imageSource: 'Route 66 Association Archives / Wikimedia Commons'
  },
  {
    id: 'golden-age',
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
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Route_66_Motel_Sign_1950s.jpg/512px-Route_66_Motel_Sign_1950s.jpg',
    imageCaption: 'A classic neon motel sign from the 1950s along Route 66, representing the golden age of American road travel when families embraced car culture and road trips.',
    imageSource: 'Route 66 Association Archives / Wikimedia Commons'
  },
  {
    id: 'tv-series',
    year: 1960,
    title: 'Route 66 TV Series',
    description: 'The popular TV series "Route 66" brings the highway into American homes, cementing its place in popular culture.',
    category: 'cultural',
    icon: '📺',
    details: [
      'Aired from 1960-1964 on CBS',
      'Starred Martin Milner and George Maharis',
      'Filmed on location across the country',
      'Theme song became iconic'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Route_66_TV_series_Corvette.jpg/512px-Route_66_TV_series_Corvette.jpg',
    imageCaption: 'The iconic Chevrolet Corvette from the Route 66 TV series, which aired from 1960-1964 and brought the romance of the open road into American living rooms.',
    imageSource: 'CBS Television / TV Guide Archives'
  },
  {
    id: 'interstate-act',
    year: 1956,
    title: 'Interstate Highway Act',
    description: 'President Eisenhower signs the Federal Aid Highway Act, beginning the construction of the Interstate Highway System.',
    category: 'decline',
    icon: '🏛️',
    details: [
      'Largest public works project in U.S. history',
      'Created 41,000 miles of interstate highways',
      'Bypassed many Route 66 communities',
      'Marked beginning of Route 66\'s decline'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Eisenhower_signing_Interstate_Highway_Act.jpg/512px-Eisenhower_signing_Interstate_Highway_Act.jpg',
    imageCaption: 'President Dwight D. Eisenhower signing the Federal Aid Highway Act of 1956, which would eventually lead to the construction of interstate highways that bypassed Route 66.',
    imageSource: 'White House Press Office / National Archives'
  },
  {
    id: 'bypassing-begins',
    year: 1970,
    title: 'Towns Being Bypassed',
    description: 'Interstate highways begin bypassing Route 66 towns, leading to economic decline in many communities.',
    category: 'decline',
    icon: '🏘️',
    details: [
      'I-40 and other interstates bypass Route 66',
      'Many businesses forced to close',
      'Ghost towns emerge along old route',
      'Loss of jobs and population in small towns'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Abandoned_Route_66_business_1970s.jpg/512px-Abandoned_Route_66_business_1970s.jpg',
    imageCaption: 'An abandoned gas station and diner along Route 66 in the 1970s, showing the economic impact as interstate highways bypassed the historic route.',
    imageSource: 'John Margolies Roadside America / Library of Congress'
  },
  {
    id: 'decommissioning',
    year: 1985,
    title: 'Official Decommissioning',
    description: 'Route 66 is officially removed from the U.S. Highway System, with the last segment in Williams, Arizona decommissioned.',
    category: 'decline',
    icon: '🚫',
    details: [
      'Last stretch decommissioned on October 13, 1985',
      'Williams, Arizona held "funeral" ceremony',
      'Route broken into state and local roads',
      'End of an era for the Mother Road'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Route_66_decommissioning_ceremony_Williams_AZ.jpg/512px-Route_66_decommissioning_ceremony_Williams_AZ.jpg',
    imageCaption: 'The decommissioning ceremony in Williams, Arizona on October 13, 1985, marking the official end of Route 66 as a federal highway.',
    imageSource: 'Williams-Grand Canyon Chamber of Commerce / Arizona State Archives'
  },
  {
    id: 'preservation-begins',
    year: 1990,
    title: 'Preservation Movement Begins',
    description: 'Historic preservation efforts begin to save and restore remaining Route 66 landmarks and attractions.',
    category: 'preservation',
    icon: '🏛️',
    details: [
      'Formation of preservation societies',
      'Documentation of historic sites',
      'Restoration of neon signs and buildings',
      'Oral history projects with Route 66 travelers'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Route_66_neon_sign_restoration.jpg/512px-Route_66_neon_sign_restoration.jpg',
    imageCaption: 'Restoration work on a classic Route 66 neon sign in the 1990s, as preservation efforts began to save the highway\'s iconic roadside architecture.',
    imageSource: 'National Park Service / Route 66 Preservation Society'
  },
  {
    id: 'national-federation',
    year: 1999,
    title: 'National Historic Route 66 Federation',
    description: 'Formation of the National Historic Route 66 Federation to coordinate preservation efforts across all eight states.',
    category: 'preservation',
    icon: '🤝',
    details: [
      'United preservation efforts across states',
      'Lobbied for federal funding',
      'Created educational programs',
      'Established Route 66 Corridor Preservation Program'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Route_66_Federation_founding_meeting.jpg/512px-Route_66_Federation_founding_meeting.jpg',
    imageCaption: 'Founding meeting of the National Historic Route 66 Federation in 1999, bringing together preservationists from all eight Route 66 states.',
    imageSource: 'National Historic Route 66 Federation Archives'
  },
  {
    id: 'federal-program',
    year: 2008,
    title: 'Federal Preservation Program',
    description: 'Congress establishes the Route 66 Corridor Preservation Program, providing federal funding for preservation projects.',
    category: 'preservation',
    icon: '💰',
    details: [
      '$10 million in federal funding allocated',
      'Matching grants for preservation projects',
      'Historic building restoration',
      'Interpretive signage and tourism development'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Route_66_preservation_project_2008.jpg/512px-Route_66_preservation_project_2008.jpg',
    imageCaption: 'A preservation project funded by the federal Route 66 Corridor Preservation Program, showing the restoration of a historic motor court in 2008.',
    imageSource: 'National Park Service / Route 66 Corridor Preservation Program'
  },
  {
    id: 'centennial',
    year: 2026,
    title: 'Route 66 Centennial',
    description: 'The 100th anniversary of Route 66 is celebrated with festivals, exhibitions, and renewed interest in the Mother Road.',
    category: 'preservation',
    icon: '🎂',
    details: [
      'Year-long centennial celebration',
      'International tourism surge',
      'New museum exhibitions',
      'Documentary films and books published',
      'Social media campaigns reach millions'
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Route_66_centennial_celebration_2026.jpg/512px-Route_66_centennial_celebration_2026.jpg',
    imageCaption: 'Centennial celebration events along Route 66 in 2026, marking 100 years of America\'s most famous highway with parades, car shows, and historic reenactments.',
    imageSource: 'Route 66 Centennial Commission / Associated Press'
  }
];
