
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { Route66Waypoint } from '../../../types/supabaseTypes';

interface FunFactsTileProps {
  destination: Route66Waypoint;
}

// Comprehensive fun facts for Route 66 cities organized by state
const cityFunFacts: Record<string, string[]> = {
  // Illinois
  'Chicago': [
    'The official starting point of Route 66 at Grant Park',
    'Lou Mitchell\'s Restaurant has been serving Route 66 travelers since 1923',
    'The Art Institute of Chicago houses one of the world\'s best art collections',
    'Navy Pier offers entertainment and stunning Lake Michigan views',
    'The Chicago Theatre\'s iconic sign is a symbol of the city'
  ],
  'Joliet': [
    'Home to the world\'s first Dairy Queen, opened in 1940',
    'The iconic Blues Brothers scene was filmed at the Joliet Prison',
    'Features a giant Route 66 shield at Route 66 Park',
    'Rich & Creamy Ice Cream stand includes Blues Brothers statues',
    'The Illinois Rock & Roll Museum is located downtown'
  ],
  'Pontiac': [
    'Hosts the Route 66 Hall of Fame & Museum',
    'City is known for its large-scale, colorful wall murals',
    'The Livingston County War Museum highlights local veterans',
    'Features historic swinging pedestrian bridges',
    'Wally\'s Service Station has been restored as a visitor center'
  ],
  'Springfield, IL': [
    'Home of Abraham Lincoln; visit his preserved home and tomb',
    'The Cozy Dog Drive In claims to have invented the corn dog',
    'Brick-paved segment of Route 66 still exists in the city',
    'Hosts a vibrant Route 66 mural trail',
    'Site of the Illinois State Capitol with historic architecture'
  ],

  // Missouri
  'St. Louis': [
    'Gateway Arch is the tallest monument in the U.S.',
    'Chain of Rocks Bridge has a unique mid-river bend',
    'Ted Drewes serves frozen custard along Route 66 since 1929',
    'Route 66 State Park has exhibits and hiking trails',
    'The city is full of restored vintage gas stations and diners'
  ],
  'Springfield, MO': [
    'Official birthplace of the "Route 66" name (1926)',
    'The Route 66 Car Museum houses over 70 vintage vehicles',
    'Gillioz Theatre offers live shows in a historic setting',
    'Hosts an annual Birthplace of Route 66 Festival',
    'Park Central Square has a commemorative Route 66 plaque'
  ],
  'Joplin': [
    'Route 66 Mural Park features two massive murals and a photo car',
    'Bonnie and Clyde hid out in Joplin in 1933',
    'Grand Falls is the largest continuously flowing waterfall in MO',
    'Historic Schifferdecker Park includes golf and museums',
    'Downtown offers 20th-century charm with local shops and diners'
  ],

  // Oklahoma
  'Tulsa': [
    'Named the official Capital of Route 66 in 2024',
    'Meadow Gold neon sign is a restored landmark',
    'Buck Atom\'s Muffler Man stands 21 feet tall',
    'Mother Road Market is Tulsa\'s Route 66 food hall',
    '"Route 66 Rising" is a large public sculpture near the highway'
  ],
  'Oklahoma City': [
    'The Milk Bottle Grocery is a tiny Route 66 landmark',
    'Gold Dome is a historic geodesic structure from the 1950s',
    'Route 66 Park has exhibits and a replica gas station',
    'The National Cowboy Museum celebrates Western culture',
    'Historic Capitol Hill has old diners and vintage shops'
  ],
  'Elk City': [
    'National Route 66 Museum has vintage cars and memorabilia',
    'Old Town Complex features pioneer-era buildings',
    'Ackley Park has a carousel and miniature train',
    'Elk City Lake offers peaceful fishing and picnic spots',
    'Downtown holds antique stores and Route 66 signage'
  ],

  // Texas
  'Amarillo': [
    'Cadillac Ranch has 10 half-buried, graffiti-covered Cadillacs',
    'The Big Texan is known for its 72-oz steak challenge',
    'Route 66 Historic District is packed with shops and neon signs',
    'The Amarillo Museum of Art has global and local exhibits',
    'American Quarter Horse Hall of Fame celebrates equestrian history'
  ],

  // New Mexico
  'Tucumcari': [
    'Blue Swallow Motel has been welcoming guests since 1939',
    'Tee Pee Curios is a roadside shop shaped like a teepee',
    'Over 40 murals color downtown Tucumcari',
    'Mesalands Dinosaur Museum includes fossils and replicas',
    'Historic Museum is in a 1903 schoolhouse'
  ],
  'Albuquerque': [
    'Route 66 follows Central Avenue through the city',
    'KiMo Theatre is a blend of Pueblo and Art Deco design',
    'Nob Hill is a retro neighborhood with neon signs and bars',
    'Breaking Bad fans can visit filming sites across the city',
    'Sandia Peak Tramway is the world\'s third longest aerial tram'
  ],
  'Gallup': [
    'El Rancho Hotel hosted Hollywood stars on Route 66',
    'Gallup Cultural Center highlights Native history and art',
    'Red Rock Park offers hiking and incredible sandstone cliffs',
    'Navajo Code Talker Museum honors WWII heroes',
    'Annual Inter-Tribal Indian Ceremonial includes parades, dances, and crafts'
  ],

  // Arizona
  'Holbrook': [
    'Wigwam Motel features teepee-shaped rooms since 1950',
    'Petrified Forest National Park is nearby with ancient fossils',
    'Historic courthouse square has Route 66 memorabilia shops',
    'Joe and Aggie\'s Cafe has been serving travelers since 1943',
    'Rainbow Rock Shop displays colorful petrified wood and gems'
  ],
  'Flagstaff': [
    'Gateway to the Grand Canyon, just 80 miles south',
    'Historic downtown has preserved Route 66 neon signs',
    'Lowell Observatory discovered Pluto in 1930',
    'Museum of Northern Arizona showcases regional history',
    'Snowbowl offers skiing in winter at 7,000+ feet elevation'
  ],
  'Seligman': [
    'Birthplace of the Historic Route 66 preservation movement',
    'Angel Delgadillo\'s barber shop is a Route 66 icon',
    'Inspiration for the town of Radiator Springs in Cars',
    'Historic Seligman Sundries serves as a gift shop and museum',
    'Original Route 66 roadbed is still driveable through town'
  ],
  'Kingman': [
    'Route 66 Museum showcases the highway\'s history',
    'Mohave Museum of History and Arts displays local artifacts',
    'Historic Beale Street preserves Old West architecture',
    'Locomotive Park features a 1928 steam engine',
    'Gateway to the Hualapai Mountains for hiking and camping'
  ],

  // California
  'Needles': [
    'Gateway to California on historic Route 66',
    'El Garces Harvey House is a restored train depot hotel',
    'Colorado River offers boating and fishing opportunities',
    'Mojave National Preserve is nearby with desert landscapes',
    'Historic 66 Motel maintains classic roadside architecture'
  ],
  'Barstow': [
    'Major railroad junction since the 1880s',
    'Casa del Desierto is a restored Harvey House',
    'Route 66 Mother Road Museum celebrates highway history',
    'Calico Ghost Town is a nearby Old West attraction',
    'Mojave River Valley Museum displays regional artifacts'
  ],
  'San Bernardino': [
    'Original McDonald\'s museum marks fast food history',
    'California Theatre of Performing Arts hosts live shows',
    'San Bernardino National Forest offers mountain recreation',
    'Historic Arrowhead Springs Hotel was a celebrity retreat',
    'Route 66 Rendezvous is an annual classic car cruise'
  ],
  'Pasadena': [
    'Home of the Tournament of Roses Parade since 1890',
    'Huntington Library has world-class art and gardens',
    'Norton Simon Museum features European and Asian art',
    'Old Pasadena offers historic architecture and shopping',
    'Caltech campus is renowned for science and technology'
  ],
  'Los Angeles': [
    'Entertainment capital of the world with Hollywood',
    'Griffith Observatory offers city views and planetarium shows',
    'Venice Beach boardwalk features street performers and artists',
    'Getty Center houses impressive art collections',
    'Sunset Strip has legendary music venues and nightlife'
  ],
  'Santa Monica': [
    'Official western terminus of Route 66 at the pier',
    'Third Street Promenade offers shopping and entertainment',
    'Santa Monica Pier has an amusement park and aquarium',
    'Muscle Beach is famous for outdoor fitness culture',
    'Beautiful beaches stretch for miles along the Pacific Coast'
  ]
};

const FunFactsTile: React.FC<FunFactsTileProps> = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
  const stateName = destination.state;

  // Create lookup key, handling Springfield cases
  const factKey = cityName === 'Springfield' ? `${cityName}, ${stateName}` : cityName;

  // Get city-specific fun facts or fallback to generic ones
  const getFunFacts = (): string[] => {
    const specificFacts = cityFunFacts[factKey];
    
    if (specificFacts && specificFacts.length > 0) {
      return specificFacts;
    }

    // Fallback facts if city not found in our database
    return [
      `${cityName} is stop #${destination.sequence_order} along historic Route 66`,
      `Located in ${destination.state}, this ${destination.is_major_stop ? 'major destination' : 'historic waypoint'} has welcomed travelers since Route 66's heyday`,
      `The coordinates ${destination.latitude.toFixed(4)}°N, ${Math.abs(destination.longitude).toFixed(4)}°W mark this special place on America's Mother Road`
    ];
  };

  const facts = getFunFacts();

  return (
    <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-500 hover:shadow-lg transition-all duration-200 hover:border-orange-600">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-orange-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Fun Facts
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {facts.map((fact, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-700 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-orange-800 leading-relaxed font-medium">{fact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FunFactsTile;
