// TouristAttraction Schema Data - Featured attractions visible in directory
// ItemList wrapping TouristAttraction objects with required properties

export interface AttractionItem {
  name: string;
  description: string;
  addressLocality: string;
  addressRegion: string;
  latitude: number;
  longitude: number;
  image?: string;
}

export const attractionsSchemaData: AttractionItem[] = [
  {
    name: "Cadillac Ranch",
    description: "Art installation featuring ten graffiti-covered Cadillacs buried nose-first in a field, open to visitors since 1974",
    addressLocality: "Amarillo",
    addressRegion: "TX",
    latitude: 35.18731,
    longitude: -101.98719
  },
  {
    name: "Blue Whale of Catoosa",
    description: "Giant blue whale structure built in the 1970s as a family swimming hole, now a beloved Oklahoma roadside attraction",
    addressLocality: "Catoosa",
    addressRegion: "OK",
    latitude: 36.18940,
    longitude: -95.73830
  },
  {
    name: "Wigwam Motel",
    description: "Historic motel where guests sleep in concrete teepee-shaped rooms, preserving Route 66 nostalgia since 1950",
    addressLocality: "Holbrook",
    addressRegion: "AZ",
    latitude: 34.90222,
    longitude: -110.15806
  },
  {
    name: "Santa Monica Pier",
    description: "Official western terminus of Route 66 featuring the iconic 'End of the Trail' sign overlooking the Pacific Ocean",
    addressLocality: "Santa Monica",
    addressRegion: "CA",
    latitude: 34.00890,
    longitude: -118.49780
  },
  {
    name: "Chain of Rocks Bridge",
    description: "Historic bridge famous for its unique 22-degree bend in the middle, now a pedestrian and cycling path",
    addressLocality: "St. Louis",
    addressRegion: "MO",
    latitude: 38.75830,
    longitude: -90.15580
  },
  {
    name: "Gemini Giant",
    description: "30-foot tall fiberglass Muffler Man holding a rocket, one of Route 66's most photographed roadside giants",
    addressLocality: "Wilmington",
    addressRegion: "IL",
    latitude: 41.30778,
    longitude: -88.14611
  }
];

export const generateAttractionsSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Featured Route 66 Attractions",
  "description": "Top must-see attractions along Historic Route 66 from Chicago to Santa Monica",
  "numberOfItems": attractionsSchemaData.length,
  "itemListElement": attractionsSchemaData.map((attraction, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "TouristAttraction",
      "name": attraction.name,
      "description": attraction.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": attraction.addressLocality,
        "addressRegion": attraction.addressRegion,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": attraction.latitude,
        "longitude": attraction.longitude
      },
      ...(attraction.image && { image: attraction.image })
    }
  }))
});

export const generateSoftwareAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ramble 66 Route 66 Trip Planner",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Web",
  "description": "Free interactive Route 66 trip planner with maps, weather forecasts, budget estimates, and shareable itineraries for the historic Mother Road",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
});
