
import { FunFact } from '../types';

export const funFactsDatabase: FunFact[] = [
  // History Facts
  {
    id: '1',
    fact: 'Route 66 was officially established on November 11, 1926, making it one of the original highways in the U.S. Highway System.',
    category: 'history',
    year: 1926,
    source: 'National Route 66 Association'
  },
  {
    id: '2',
    fact: 'The highway was completely paved by 1938, transforming cross-country travel and earning the nickname "Main Street of America."',
    category: 'history',
    year: 1938
  },
  {
    id: '3',
    fact: 'Route 66 was officially decommissioned in 1985, but has been preserved as a Historic Route in many states.',
    category: 'history',
    year: 1985
  },
  {
    id: '4',
    fact: 'During the Dust Bowl era of the 1930s, Route 66 became known as the "Mother Road" when over 200,000 people migrated west to California.',
    category: 'history',
    year: 1930,
    location: 'California'
  },
  {
    id: '5',
    fact: 'The famous Burma-Shave advertising signs along Route 66 became a cultural phenomenon, with rhyming jingles spread across multiple billboards.',
    category: 'culture'
  },

  // Trivia Facts
  {
    id: '6',
    fact: 'Route 66 spans 2,448 miles from Chicago to Santa Monica, crossing through 8 states and 3 time zones.',
    category: 'trivia',
    location: 'Chicago to Santa Monica'
  },
  {
    id: '7',
    fact: 'The original route included over 800 curves, leading to its nickname "The Crookedest Road in the World."',
    category: 'trivia'
  },
  {
    id: '8',
    fact: 'Illinois has the shortest stretch of Route 66 at just 301 miles, while Texas has the longest at 178 miles.',
    category: 'trivia',
    location: 'Illinois & Texas'
  },
  {
    id: '9',
    fact: 'The famous Wigwam Motel in Holbrook, Arizona, features 15 concrete teepees that have welcomed travelers since 1950.',
    category: 'architecture',
    location: 'Holbrook, Arizona',
    year: 1950
  },
  {
    id: '10',
    fact: 'The Chain of Rocks Bridge near St. Louis has a unique 22-degree bend in the middle, making it one of Route 66\'s most photographed landmarks.',
    category: 'architecture',
    location: 'St. Louis, Missouri'
  },

  // Culture Facts
  {
    id: '11',
    fact: 'The song "Route 66" was written by Bobby Troup in 1946 and has been covered by artists from Nat King Cole to the Rolling Stones.',
    category: 'culture',
    year: 1946
  },
  {
    id: '12',
    fact: 'Disney-Pixar\'s "Cars" movie was inspired by Route 66, with the fictional town of Radiator Springs based on real Route 66 communities.',
    category: 'culture'
  },
  {
    id: '13',
    fact: 'The iconic Route 66 shield design was created in 1957 and became one of America\'s most recognizable road signs.',
    category: 'culture',
    year: 1957
  },
  {
    id: '14',
    fact: 'Jack D. Rittenhouse wrote the first Route 66 guidebook in 1946, documenting every business and landmark along the highway.',
    category: 'culture',
    year: 1946
  },
  {
    id: '15',
    fact: 'The Big Texan Steak Ranch in Amarillo has been challenging travelers to eat a 72-ounce steak dinner in one hour since 1960.',
    category: 'culture',
    location: 'Amarillo, Texas',
    year: 1960
  },

  // Famous People
  {
    id: '16',
    fact: 'Elvis Presley frequently traveled Route 66 and performed in many towns along the highway during his career.',
    category: 'famous-people'
  },
  {
    id: '17',
    fact: 'John Steinbeck immortalized Route 66 in "The Grapes of Wrath," calling it the "Mother Road" for the first time in literature.',
    category: 'famous-people'
  },
  {
    id: '18',
    fact: 'Angel Delgadillo, known as the "Guardian Angel of Route 66," helped preserve the historic highway and founded the Historic Route 66 Association.',
    category: 'famous-people',
    location: 'Seligman, Arizona'
  },
  {
    id: '19',
    fact: 'James Dean filmed scenes for "Giant" along Route 66 in Texas, cementing the highway\'s connection to Hollywood.',
    category: 'famous-people',
    location: 'Texas'
  },
  {
    id: '20',
    fact: 'Cyrus Avery, known as the "Father of Route 66," was instrumental in the highway\'s creation and promoted it tirelessly.',
    category: 'famous-people'
  },

  // Architecture & Landmarks
  {
    id: '21',
    fact: 'The Gemini Giant in Wilmington, Illinois, is a 30-foot-tall fiberglass spaceman that has been greeting travelers since 1965.',
    category: 'architecture',
    location: 'Wilmington, Illinois',
    year: 1965
  },
  {
    id: '22',
    fact: 'Cadillac Ranch in Amarillo features 10 Cadillacs buried nose-first in the ground, created by art group Ant Farm in 1974.',
    category: 'architecture',
    location: 'Amarillo, Texas',
    year: 1974
  },
  {
    id: '23',
    fact: 'The Blue Whale of Catoosa in Oklahoma was built in the 1970s as a family swimming hole and became an iconic Route 66 landmark.',
    category: 'architecture',
    location: 'Catoosa, Oklahoma',
    year: 1970
  },
  {
    id: '24',
    fact: 'The Munger Moss Motel in Lebanon, Missouri, has been family-owned since 1946 and features vintage neon signage.',
    category: 'architecture',
    location: 'Lebanon, Missouri',
    year: 1946
  },
  {
    id: '25',
    fact: 'The Madonna of the Trail statues were placed along the National Old Trails Road, which later became part of Route 66.',
    category: 'architecture'
  },

  // More Recent & Modern Facts
  {
    id: '26',
    fact: 'Route 66 generates over $38 million annually in tourism revenue for communities along the historic highway.',
    category: 'trivia'
  },
  {
    id: '27',
    fact: 'The International Route 66 Festival in Kingman, Arizona, attracts over 30,000 visitors annually.',
    category: 'culture',
    location: 'Kingman, Arizona'
  },
  {
    id: '28',
    fact: 'Modern GPS systems often struggle with historic Route 66 alignments, making printed maps and guidebooks still essential.',
    category: 'trivia'
  },
  {
    id: '29',
    fact: 'The Route 66 Centennial will be celebrated in 2026, marking 100 years since the highway\'s establishment.',
    category: 'history',
    year: 2026
  },
  {
    id: '30',
    fact: 'Each year, travelers from over 50 countries visit Route 66, making it one of America\'s most international tourist destinations.',
    category: 'trivia'
  }
];
