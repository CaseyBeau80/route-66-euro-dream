
export interface EventSource {
  name: string;
  url: string;
  type: 'official' | 'chamber' | 'visitor_bureau' | 'facebook' | 'eventbrite' | 'tourism';
  description: string;
}

export interface CityEventData {
  cityName: string;
  state: string;
  eventSources: EventSource[];
}

export const cityEventLinks: CityEventData[] = [
  {
    cityName: "Chicago",
    state: "IL",
    eventSources: [
      {
        name: "Choose Chicago Events",
        url: "https://www.choosechicago.com/events/",
        type: "tourism",
        description: "Official Chicago tourism events calendar"
      },
      {
        name: "Chicago Events - Eventbrite",
        url: "https://www.eventbrite.com/d/il--chicago/events/",
        type: "eventbrite",
        description: "Eventbrite listings for Chicago area events"
      }
    ]
  },
  {
    cityName: "Joliet",
    state: "IL",
    eventSources: [
      {
        name: "Joliet Area Historical Museum Events",
        url: "https://www.jolietmuseum.org/events",
        type: "official",
        description: "Historical museum and local events"
      },
      {
        name: "Visit Joliet Events",
        url: "https://www.visitjoliet.com/events/",
        type: "visitor_bureau",
        description: "Official Joliet tourism events"
      }
    ]
  },
  {
    cityName: "Pontiac",
    state: "IL",
    eventSources: [
      {
        name: "Pontiac Tourism Events",
        url: "https://www.pontiac.org/events",
        type: "tourism",
        description: "Official Pontiac tourism events calendar"
      },
      {
        name: "Pontiac Illinois Route 66 Hall of Fame Events",
        url: "https://www.pontiac66.com/events",
        type: "official",
        description: "Route 66 themed events and exhibitions"
      }
    ]
  },
  {
    cityName: "Springfield",
    state: "IL",
    eventSources: [
      {
        name: "Visit Springfield Events",
        url: "https://www.visitspringfieldillinois.com/events/",
        type: "visitor_bureau",
        description: "Official Springfield tourism events"
      },
      {
        name: "Springfield Events - Facebook",
        url: "https://www.facebook.com/events/search?q=springfield%20illinois&filters=eyJycF9ldmVudHNfbG9jYXRpb24iOiJ7XCJuYW1lXCI6XCJzcHJpbmdmaWVsZCBpbGxpbm9pc1wiLFwiYWRkcmVzc1wiOlwiU3ByaW5nZmllbGQsIElMXCJ9In0%3D",
        type: "facebook",
        description: "Community events and gatherings"
      }
    ]
  },
  {
    cityName: "St. Louis",
    state: "MO",
    eventSources: [
      {
        name: "Explore St. Louis Events",
        url: "https://explorestlouis.com/events/",
        type: "tourism",
        description: "Official St. Louis tourism events calendar"
      },
      {
        name: "St. Louis Events - Eventbrite",
        url: "https://www.eventbrite.com/d/mo--st-louis/events/",
        type: "eventbrite",
        description: "Local events and activities"
      }
    ]
  },
  {
    cityName: "Cuba",
    state: "MO",
    eventSources: [
      {
        name: "Cuba Missouri Chamber Events",
        url: "https://www.cubamochamber.com/events",
        type: "chamber",
        description: "Local chamber of commerce events"
      },
      {
        name: "Cuba MO Events - Facebook",
        url: "https://www.facebook.com/events/search?q=cuba%20missouri&filters=eyJycF9ldmVudHNfbG9jYXRpb24iOiJ7XCJuYW1lXCI6XCJjdWJhIG1pc3NvdXJpXCIsXCJhZGRyZXNzXCI6XCJDdWJhLCBNT1wifSJ9",
        type: "facebook",
        description: "Community events and local activities"
      }
    ]
  },
  {
    cityName: "Rolla",
    state: "MO",
    eventSources: [
      {
        name: "Visit Rolla Events",
        url: "https://www.visitrolla.com/events/",
        type: "visitor_bureau",
        description: "Official Rolla tourism events"
      },
      {
        name: "Rolla Area Chamber Events",
        url: "https://www.rollachamber.org/events",
        type: "chamber",
        description: "Chamber of commerce events and activities"
      }
    ]
  },
  {
    cityName: "Springfield",
    state: "MO",
    eventSources: [
      {
        name: "Visit Springfield Events",
        url: "https://www.visitspringfieldmo.org/events/",
        type: "visitor_bureau",
        description: "Official Springfield, MO tourism events"
      },
      {
        name: "Springfield Events - Eventbrite",
        url: "https://www.eventbrite.com/d/mo--springfield/events/",
        type: "eventbrite",
        description: "Local Springfield events and activities"
      }
    ]
  },
  {
    cityName: "Joplin",
    state: "MO",
    eventSources: [
      {
        name: "Visit Joplin Events",
        url: "https://www.visitjoplinmo.com/events/",
        type: "visitor_bureau",
        description: "Official Joplin tourism events"
      },
      {
        name: "Joplin Area Chamber Events",
        url: "https://www.joplincc.com/events",
        type: "chamber",
        description: "Local business and community events"
      }
    ]
  },
  {
    cityName: "Tulsa",
    state: "OK",
    eventSources: [
      {
        name: "Visit Tulsa Events",
        url: "https://www.visittulsa.com/events/",
        type: "visitor_bureau",
        description: "Official Tulsa tourism events calendar"
      },
      {
        name: "Tulsa Events - Eventbrite",
        url: "https://www.eventbrite.com/d/ok--tulsa/events/",
        type: "eventbrite",
        description: "Local Tulsa events and activities"
      }
    ]
  },
  {
    cityName: "Oklahoma City",
    state: "OK",
    eventSources: [
      {
        name: "Visit OKC Events",
        url: "https://www.visitokc.com/events/",
        type: "visitor_bureau",
        description: "Official Oklahoma City tourism events"
      },
      {
        name: "OKC Events - Eventbrite",
        url: "https://www.eventbrite.com/d/ok--oklahoma-city/events/",
        type: "eventbrite",
        description: "Oklahoma City area events and activities"
      }
    ]
  },
  {
    cityName: "Amarillo",
    state: "TX",
    eventSources: [
      {
        name: "Visit Amarillo Events",
        url: "https://www.visitamarillo.com/events/",
        type: "visitor_bureau",
        description: "Official Amarillo tourism events"
      },
      {
        name: "Amarillo Chamber Events",
        url: "https://www.amarillo-chamber.org/events",
        type: "chamber",
        description: "Local chamber and business events"
      }
    ]
  },
  {
    cityName: "Santa Fe",
    state: "NM",
    eventSources: [
      {
        name: "Santa Fe Tourism Events",
        url: "https://www.santafe.org/events/",
        type: "tourism",
        description: "Official Santa Fe tourism events calendar"
      },
      {
        name: "Santa Fe Events - Eventbrite",
        url: "https://www.eventbrite.com/d/nm--santa-fe/events/",
        type: "eventbrite",
        description: "Local Santa Fe events and activities"
      }
    ]
  },
  {
    cityName: "Albuquerque",
    state: "NM",
    eventSources: [
      {
        name: "Visit Albuquerque Events",
        url: "https://www.visitalbuquerque.org/events/",
        type: "visitor_bureau",
        description: "Official Albuquerque tourism events"
      },
      {
        name: "Albuquerque Events - Eventbrite",
        url: "https://www.eventbrite.com/d/nm--albuquerque/events/",
        type: "eventbrite",
        description: "Albuquerque area events and activities"
      }
    ]
  },
  {
    cityName: "Gallup",
    state: "NM",
    eventSources: [
      {
        name: "Gallup Tourism Events",
        url: "https://www.gallupmainstreet.org/events",
        type: "tourism",
        description: "Local Gallup events and cultural activities"
      },
      {
        name: "Gallup Chamber Events",
        url: "https://www.gallupnmchamber.com/events",
        type: "chamber",
        description: "Chamber of commerce events"
      }
    ]
  },
  {
    cityName: "Flagstaff",
    state: "AZ",
    eventSources: [
      {
        name: "Visit Flagstaff Events",
        url: "https://www.flagstaffarizona.org/events/",
        type: "visitor_bureau",
        description: "Official Flagstaff tourism events"
      },
      {
        name: "Flagstaff Events - Eventbrite",
        url: "https://www.eventbrite.com/d/az--flagstaff/events/",
        type: "eventbrite",
        description: "Local Flagstaff events and activities"
      }
    ]
  },
  {
    cityName: "Williams",
    state: "AZ",
    eventSources: [
      {
        name: "Williams Arizona Events",
        url: "https://experiencewilliams.com/events/",
        type: "tourism",
        description: "Official Williams tourism events"
      },
      {
        name: "Williams Chamber Events",
        url: "https://williamschamber.com/events",
        type: "chamber",
        description: "Local chamber and community events"
      }
    ]
  },
  {
    cityName: "Kingman",
    state: "AZ",
    eventSources: [
      {
        name: "Visit Kingman Events",
        url: "https://www.visitkingman.com/events",
        type: "visitor_bureau",
        description: "Official Kingman tourism events"
      },
      {
        name: "Kingman Area Chamber Events",
        url: "https://kingmanchamber.org/events",
        type: "chamber",
        description: "Local business and community events"
      }
    ]
  },
  {
    cityName: "Barstow",
    state: "CA",
    eventSources: [
      {
        name: "Barstow Chamber Events",
        url: "https://www.barstowchamber.com/events",
        type: "chamber",
        description: "Local chamber of commerce events"
      },
      {
        name: "Barstow Events - Facebook",
        url: "https://www.facebook.com/events/search?q=barstow%20california&filters=eyJycF9ldmVudHNfbG9jYXRpb24iOiJ7XCJuYW1lXCI6XCJiYXJzdG93IGNhbGlmb3JuaWFcIixcImFkZHJlc3NcIjpcIkJhcnN0b3csIENBXCJ9In0%3D",
        type: "facebook",
        description: "Local community events and activities"
      }
    ]
  },
  {
    cityName: "San Bernardino",
    state: "CA",
    eventSources: [
      {
        name: "San Bernardino Events",
        url: "https://www.sbcity.org/residents/recreation___sports/special_events",
        type: "official",
        description: "Official city special events calendar"
      },
      {
        name: "San Bernardino Events - Eventbrite",
        url: "https://www.eventbrite.com/d/ca--san-bernardino/events/",
        type: "eventbrite",
        description: "Local San Bernardino events"
      }
    ]
  },
  {
    cityName: "Pasadena",
    state: "CA",
    eventSources: [
      {
        name: "Visit Pasadena Events",
        url: "https://www.visitpasadena.com/events/",
        type: "visitor_bureau",
        description: "Official Pasadena tourism events"
      },
      {
        name: "Pasadena Events - Eventbrite",
        url: "https://www.eventbrite.com/d/ca--pasadena/events/",
        type: "eventbrite",
        description: "Local Pasadena events and activities"
      }
    ]
  },
  {
    cityName: "Santa Monica",
    state: "CA",
    eventSources: [
      {
        name: "Visit Santa Monica Events",
        url: "https://www.santamonica.com/events/",
        type: "visitor_bureau",
        description: "Official Santa Monica tourism events"
      },
      {
        name: "Santa Monica Events - Eventbrite",
        url: "https://www.eventbrite.com/d/ca--santa-monica/events/",
        type: "eventbrite",
        description: "Santa Monica area events and activities"
      }
    ]
  }
];

export const getCityEventLinks = (cityName: string, state?: string): CityEventData | null => {
  return cityEventLinks.find(city => 
    city.cityName.toLowerCase() === cityName.toLowerCase() && 
    (!state || city.state === state)
  ) || null;
};

export const getAllEventSources = (): EventSource[] => {
  return cityEventLinks.flatMap(city => city.eventSources);
};
