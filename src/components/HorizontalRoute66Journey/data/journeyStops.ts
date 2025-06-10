
import { JourneyStop } from '../types';

export const route66JourneyStops: JourneyStop[] = [
  {
    id: 'chicago-start',
    city: 'Chicago',
    state: 'Illinois',
    title: 'The Journey Begins',
    subtitle: 'Where America\'s Main Street Starts',
    description: 'Your adventure begins at Grant Park in Chicago, where Route 66 officially starts. This bustling metropolis marks the beginning of a 2,448-mile journey through the heart of America.',
    backgroundImage: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 41.8781, lng: -87.6298 },
    highlights: [
      'Grant Park - Official Route 66 Start',
      'Chicago Architecture',
      'Deep Dish Pizza',
      'Willis Tower Skydeck'
    ],
    category: 'start',
    sequence: 1
  },
  {
    id: 'joliet',
    city: 'Joliet',
    state: 'Illinois',
    title: 'The Prison City',
    subtitle: 'Blues Brothers Country',
    description: 'Made famous by the Blues Brothers movie, Joliet represents the industrial heart of Illinois with its historic prison and Route 66 heritage.',
    backgroundImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 41.5250, lng: -88.0817 },
    highlights: [
      'Old Joliet Prison',
      'Blues Brothers Legacy',
      'Route 66 Raceway',
      'Historic Downtown'
    ],
    category: 'major',
    sequence: 2
  },
  {
    id: 'pontiac',
    city: 'Pontiac',
    state: 'Illinois',
    title: 'Route 66 Hall of Fame',
    subtitle: 'Preserving the Mother Road\'s Legacy',
    description: 'Home to the Route 66 Hall of Fame and Museum, Pontiac celebrates the history and culture of America\'s most famous highway.',
    backgroundImage: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 41.1306, lng: -88.8290 },
    highlights: [
      'Route 66 Hall of Fame',
      'Historic Downtown Murals',
      'Pontiac-Oakland Museum',
      'Swinging Bridge'
    ],
    category: 'cultural',
    sequence: 3
  },
  {
    id: 'springfield-il',
    city: 'Springfield',
    state: 'Illinois',
    title: 'Land of Lincoln',
    subtitle: 'Presidential History Meets Route 66',
    description: 'Illinois\' capital city where Abraham Lincoln made his mark, and where Route 66 continues its westward journey through America\'s heartland.',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 39.8003, lng: -89.6437 },
    highlights: [
      'Abraham Lincoln Presidential Library',
      'Lincoln Home National Historic Site',
      'Old State Capitol',
      'Cozy Dog Drive In - Birthplace of Corn Dog'
    ],
    category: 'major',
    sequence: 4
  },
  {
    id: 'st-louis',
    city: 'St. Louis',
    state: 'Missouri',
    title: 'Gateway to the West',
    subtitle: 'Where East Meets West',
    description: 'The iconic Gateway Arch marks your passage into the American West. St. Louis has been a crossroads of culture and commerce for centuries.',
    backgroundImage: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 38.7067, lng: -90.3990 },
    highlights: [
      'Gateway Arch National Park',
      'Historic Route 66 State Park',
      'Anheuser-Busch Brewery',
      'Forest Park'
    ],
    category: 'major',
    sequence: 5
  },
  {
    id: 'springfield-mo',
    city: 'Springfield',
    state: 'Missouri',
    title: 'Birthplace of Route 66',
    subtitle: 'Where It All Began',
    description: 'Springfield, Missouri claims to be the birthplace of Route 66, where the federal highway system was first conceived and planned.',
    backgroundImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 37.2090, lng: -93.2923 },
    highlights: [
      'Route 66 Car Museum',
      'Historic Route 66 Festival',
      'Fantastic Caverns',
      'Wilson\'s Creek Battlefield'
    ],
    category: 'cultural',
    sequence: 6
  },
  {
    id: 'joplin',
    city: 'Joplin',
    state: 'Missouri',
    title: 'Crossroads of America',
    subtitle: 'Mining Town Heritage',
    description: 'Once a booming mining town, Joplin represents the industrial heritage of the Midwest and the resilience of Route 66 communities.',
    backgroundImage: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 37.0842, lng: -94.5133 },
    highlights: [
      'Route 66 Mural Park',
      'George Washington Carver Monument',
      'Precious Moments Chapel',
      'Historic Downtown'
    ],
    category: 'major',
    sequence: 7
  },
  {
    id: 'tulsa',
    city: 'Tulsa',
    state: 'Oklahoma',
    title: 'Oil Capital of the World',
    subtitle: 'Art Deco and Black Gold',
    description: 'Tulsa\'s Art Deco architecture and oil heritage make it a unique stop on Route 66, showcasing Oklahoma\'s boom-and-bust history.',
    backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 36.1540, lng: -95.9928 },
    highlights: [
      'Golden Driller Statue',
      'Art Deco District',
      'Philbrook Museum',
      'Route 66 Village'
    ],
    category: 'major',
    sequence: 8
  },
  {
    id: 'oklahoma-city',
    city: 'Oklahoma City',
    state: 'Oklahoma',
    title: 'Pioneer Spirit',
    subtitle: 'Capital of the Sooner State',
    description: 'Oklahoma\'s capital embodies the pioneer spirit of the American West, with cowboy culture and Route 66 heritage converging.',
    backgroundImage: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.4676, lng: -97.5164 },
    highlights: [
      'National Cowboy Museum',
      'Oklahoma City Memorial',
      'Bricktown Entertainment District',
      'Route 66 Park'
    ],
    category: 'major',
    sequence: 9
  },
  {
    id: 'elk-city',
    city: 'Elk City',
    state: 'Oklahoma',
    title: 'Natural Gas Capital',
    subtitle: 'Western Gateway',
    description: 'As you approach the Texas border, Elk City represents the transition from Oklahoma\'s rolling hills to the vast Texas plains.',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.5089, lng: -98.9680 },
    highlights: [
      'National Route 66 Museum',
      'Old Town Museum',
      'Elk City Lake',
      'Historic Downtown'
    ],
    category: 'scenic',
    sequence: 10
  },
  {
    id: 'amarillo',
    city: 'Amarillo',
    state: 'Texas',
    title: 'Yellow City of the Plains',
    subtitle: 'Where Art Meets the Prairie',
    description: 'Amarillo sits in the heart of the Texas Panhandle, famous for Cadillac Ranch and representing the vastness of the American prairie.',
    backgroundImage: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.2220, lng: -101.8313 },
    highlights: [
      'Cadillac Ranch',
      'Big Texan Steak Ranch',
      'Palo Duro Canyon State Park',
      'American Quarter Horse Museum'
    ],
    category: 'major',
    sequence: 11
  },
  {
    id: 'tucumcari',
    city: 'Tucumcari',
    state: 'New Mexico',
    title: 'Gateway to New Mexico',
    subtitle: 'Land of Enchantment Begins',
    description: 'Tucumcari welcomes travelers to New Mexico with its famous neon signs and represents the cultural shift into the Southwest.',
    backgroundImage: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.1245, lng: -103.7207 },
    highlights: [
      'Historic Route 66 Neon Signs',
      'Tucumcari Mountain',
      'Mesalands Dinosaur Museum',
      'Blue Hole'
    ],
    category: 'scenic',
    sequence: 12
  },
  {
    id: 'santa-fe',
    city: 'Santa Fe',
    state: 'New Mexico',
    title: 'City Different',
    subtitle: 'Ancient Culture, Artistic Soul',
    description: 'America\'s oldest state capital, where Native American, Hispanic, and Anglo cultures blend in a unique Southwestern tapestry.',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.6869, lng: -105.9378 },
    highlights: [
      'Santa Fe Plaza',
      'Palace of the Governors',
      'Canyon Road Art District',
      'Loretto Chapel'
    ],
    category: 'cultural',
    sequence: 13
  },
  {
    id: 'albuquerque',
    city: 'Albuquerque',
    state: 'New Mexico',
    title: 'Crossroads of the Southwest',
    subtitle: 'High Desert Metropolis',
    description: 'New Mexico\'s largest city sits at the crossroads of ancient trade routes and modern highways, where hot air balloons fill the desert sky.',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.0844, lng: -106.6504 },
    highlights: [
      'International Balloon Fiesta',
      'Old Town Albuquerque',
      'Sandia Peak Tramway',
      'Indian Pueblo Cultural Center'
    ],
    category: 'major',
    sequence: 14
  },
  {
    id: 'gallup',
    city: 'Gallup',
    state: 'New Mexico',
    title: 'Heart of Indian Country',
    subtitle: 'Trading Post Capital',
    description: 'Gallup serves as the gateway to Native American country, surrounded by the Navajo Nation and rich in indigenous culture.',
    backgroundImage: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.0820, lng: -108.7426 },
    highlights: [
      'Historic Trading Posts',
      'Inter-Tribal Ceremonial',
      'Red Rock Park',
      'El Rancho Hotel'
    ],
    category: 'cultural',
    sequence: 15
  },
  {
    id: 'holbrook',
    city: 'Holbrook',
    state: 'Arizona',
    title: 'Wigwam Village',
    subtitle: 'Petrified Forest Gateway',
    description: 'Home to the famous Wigwam Motel and gateway to Petrified Forest National Park, Holbrook embodies Route 66\'s quirky roadside culture.',
    backgroundImage: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.0819, lng: -110.0298 },
    highlights: [
      'Wigwam Motel',
      'Petrified Forest National Park',
      'Navajo County Museum',
      'Route 66 Courthouse'
    ],
    category: 'scenic',
    sequence: 16
  },
  {
    id: 'winslow',
    city: 'Winslow',
    state: 'Arizona',
    title: 'Take It Easy',
    subtitle: 'Eagles Song Made Famous',
    description: 'Immortalized in the Eagles\' song "Take It Easy," Winslow celebrates its musical heritage and railroad history.',
    backgroundImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.0606, lng: -110.6322 },
    highlights: [
      'Standin\' on the Corner Park',
      'La Posada Hotel',
      'Meteor Crater',
      'Old Trails Museum'
    ],
    category: 'cultural',
    sequence: 17
  },
  {
    id: 'flagstaff',
    city: 'Flagstaff',
    state: 'Arizona',
    title: 'Mountain Town Oasis',
    subtitle: 'Pines and Peaks',
    description: 'Set among the ponderosa pines at 7,000 feet elevation, Flagstaff offers cool mountain air and serves as gateway to the Grand Canyon.',
    backgroundImage: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.1983, lng: -111.6513 },
    highlights: [
      'Lowell Observatory',
      'Arizona Snowbowl',
      'Historic Downtown',
      'Museum of Northern Arizona'
    ],
    category: 'major',
    sequence: 18
  },
  {
    id: 'seligman',
    city: 'Seligman',
    state: 'Arizona',
    title: 'Birthplace of Historic Route 66',
    subtitle: 'Angel Delgadillo\'s Town',
    description: 'The birthplace of the Historic Route 66 preservation movement, where Angel Delgadillo sparked the revival of the Mother Road.',
    backgroundImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.2677, lng: -113.7558 },
    highlights: [
      'Angel Delgadillo\'s Barber Shop',
      'Historic Route 66 General Store',
      'Rusty Bolt',
      'Route 66 Gift Shop'
    ],
    category: 'cultural',
    sequence: 19
  },
  {
    id: 'kingman',
    city: 'Kingman',
    state: 'Arizona',
    title: 'Heart of Historic Route 66',
    subtitle: 'Desert Crossroads',
    description: 'Kingman sits at the heart of the longest remaining stretch of original Route 66, surrounded by the Mojave Desert\'s stark beauty.',
    backgroundImage: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 35.1894, lng: -114.0530 },
    highlights: [
      'Route 66 Museum',
      'Historic Powerhouse',
      'Hualapai Mountain Park',
      'Andy Devine Avenue'
    ],
    category: 'major',
    sequence: 20
  },
  {
    id: 'needles',
    city: 'Needles',
    state: 'California',
    title: 'Gateway to California',
    subtitle: 'Where Dreams Come True',
    description: 'Your first taste of California, where the Colorado River marks the border and the final stretch of your Route 66 journey begins.',
    backgroundImage: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 34.7361, lng: -116.9954 },
    highlights: [
      'El Garces Harvey House',
      'Colorado River',
      'Needles Regional Museum',
      'Historic Downtown'
    ],
    category: 'major',
    sequence: 21
  },
  {
    id: 'barstow',
    city: 'Barstow',
    state: 'California',
    title: 'Railroad Junction',
    subtitle: 'Mojave Desert Outpost',
    description: 'A vital railroad junction in the Mojave Desert, Barstow represents the harsh beauty and isolation of the California desert.',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 34.9983, lng: -117.1858 },
    highlights: [
      'Route 66 Mother Road Museum',
      'Harvey House Railroad Depot',
      'Calico Ghost Town',
      'Rainbow Basin'
    ],
    category: 'scenic',
    sequence: 22
  },
  {
    id: 'san-bernardino',
    city: 'San Bernardino',
    state: 'California',
    title: 'Original McDonald\'s',
    subtitle: 'Fast Food History',
    description: 'Home to the original McDonald\'s restaurant and museum, San Bernardino marks your entry into Southern California\'s urban landscape.',
    backgroundImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 34.0529, lng: -117.1822 },
    highlights: [
      'Original McDonald\'s Museum',
      'California Theatre',
      'Glen Helen Regional Park',
      'Route 66 Rendezvous'
    ],
    category: 'cultural',
    sequence: 23
  },
  {
    id: 'santa-monica',
    city: 'Santa Monica',
    state: 'California',
    title: 'End of the Trail',
    subtitle: 'Where Route 66 Meets the Pacific',
    description: 'Your epic 2,448-mile journey ends at Santa Monica Pier, where Route 66 meets the Pacific Ocean in a celebration of American adventure.',
    backgroundImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    coordinates: { lat: 34.0195, lng: -118.4912 },
    highlights: [
      'Santa Monica Pier',
      'Route 66 End Sign',
      'Pacific Wheel',
      'Santa Monica Beach'
    ],
    category: 'end',
    sequence: 24
  }
];
