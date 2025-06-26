
export interface TimelineMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  details: string[];
  category: 'establishment' | 'cultural' | 'decline' | 'modern';
  icon: string;
  imageUrl?: string;
  imageCaption?: string;
  imageSource?: string;
  audioUrl?: string;
}

export const categoryColors = {
  establishment: 'bg-green-50 border-green-200',
  cultural: 'bg-purple-50 border-purple-200', 
  decline: 'bg-orange-50 border-orange-200',
  modern: 'bg-blue-50 border-blue-200'
} as const;

export const categoryLabels = {
  establishment: 'Birth & Growth',
  cultural: 'Cultural Impact',
  decline: 'Decline Era', 
  modern: 'Modern Revival'
} as const;

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: 'route66-establishment-1926',
    year: 1926,
    title: 'Route 66 Is Born',
    description: 'The Mother Road officially established, connecting Chicago to Los Angeles across 2,448 miles of American landscape.',
    details: [
      'Originally designated as U.S. Highway 66 on November 11, 1926',
      'Connected Chicago, Illinois to Santa Monica, California',
      'Total length of 2,448 miles through 8 states',
      'Became one of the original highways in the U.S. Highway System'
    ],
    category: 'establishment',
    icon: '🛣️',
    imageUrl: '/lovable-uploads/625379a4-1f3a-4507-b7ae-394af1f403ae.png'
  },
  {
    id: 'route66-culture-1946',
    year: 1946,
    title: 'Get Your Kicks on Route 66',
    description: 'Bobby Troup\'s hit song popularizes Route 66 in American culture, later covered by artists like Nat King Cole and the Rolling Stones.',
    details: [
      'Written by Bobby Troup after driving Route 66 from Pennsylvania to California',
      'First recorded by Nat King Cole, becoming a major hit',
      'Later covered by Chuck Berry, Rolling Stones, and many others',
      'Helped cement Route 66\'s place in American popular culture'
    ],
    category: 'cultural',
    icon: '🎵',
    imageUrl: '/lovable-uploads/79d1bcf2-04dd-4206-8f0b-14e6cdce4cdc.png'
  },
  {
    id: 'route66-golden-1950s',
    year: 1950,
    title: 'The Golden Age Begins',
    description: 'Post-war prosperity brings millions of travelers to Route 66, spawning iconic motels, diners, and roadside attractions.',
    details: [
      'Post-WWII economic boom increased automobile travel',
      'Iconic motels like the Blue Swallow and El Rancho opened',
      'Classic diners and drive-ins became Route 66 staples',
      'Roadside attractions like the Cadillac Ranch were conceived'
    ],
    category: 'cultural',
    icon: '🏨',
    imageUrl: '/lovable-uploads/91a28dec-6315-4bc4-a149-27576d22dc45.png'
  },
  {
    id: 'route66-interstate-1956',
    year: 1956,
    title: 'Interstate System Approved',
    description: 'President Eisenhower signs the Interstate Highway Act, beginning the end of Route 66\'s dominance.',
    details: [
      'Federal-Aid Highway Act signed by President Eisenhower',
      'Authorized construction of 41,000 miles of interstate highways',
      'Began the gradual replacement of Route 66 with faster interstates',
      'Marked the beginning of Route 66\'s decline as a major highway'
    ],
    category: 'decline',
    icon: '🏛️',
    imageUrl: '/lovable-uploads/8ffcc42d-a7be-49cb-b89b-f2bbcd89cfdf.png'
  },
  {
    id: 'route66-decommission-1985',
    year: 1985,
    title: 'Official Decommissioning',
    description: 'Route 66 is officially removed from the U.S. Highway System, but its legend lives on.',
    details: [
      'Last section bypassed by Interstate 40 in Arizona',
      'Officially removed from U.S. Highway System',
      'Many businesses along the route struggled or closed',
      'Preservation efforts began almost immediately'
    ],
    category: 'decline',
    icon: '🚧',
    imageUrl: '/lovable-uploads/d2b2f3b5-9867-467f-a160-bd1a3160dd09.png'
  },
  {
    id: 'route66-historic-1999',
    year: 1999,
    title: 'Historic Route 66 Designation',
    description: 'Route 66 receives official recognition as a Historic Route, beginning its preservation and tourism renaissance.',
    details: [
      'Designated as a National Scenic Byway',
      'Federal funding provided for preservation efforts',
      'Tourism began to revive along the historic route',
      'State historic route designations established'
    ],
    category: 'modern',
    icon: '🏛️',
    imageUrl: '/lovable-uploads/ef90c3a0-71fe-4f68-8671-5a455d6e9bc1.png'
  }
];
