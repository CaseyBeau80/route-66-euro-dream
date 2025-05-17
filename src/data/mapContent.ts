
type ContentTranslations = {
  [key: string]: {
    title: string;
    subtitle: string;
    filters: {
      motorcycle: string;
      english: string;
      local: string;
      family: string;
    };
    categories: {
      lodging: string;
      food: string;
      music: string;
      history: string;
    };
    stateExplore: string;
    stateAttractions: string;
  };
};

export const mapContent: ContentTranslations = {
  en: {
    title: "Explore the Historic Route",
    subtitle: "Navigate the iconic 2,448-mile journey with our interactive map",
    filters: {
      motorcycle: "Motorcycle-friendly",
      english: "English-speaking staff",
      local: "Local favorite",
      family: "Family-friendly"
    },
    categories: {
      lodging: "Lodging",
      food: "Food",
      music: "Music",
      history: "History"
    },
    stateExplore: "Explore",
    stateAttractions: "Top Attractions:"
  },
  de: {
    title: "Erkunden Sie die historische Route",
    subtitle: "Navigieren Sie die ikonische 3.940-km-Reise mit unserer interaktiven Karte",
    filters: {
      motorcycle: "Motorradfreundlich",
      english: "Englischsprachiges Personal",
      local: "Lokaler Favorit",
      family: "Familienfreundlich"
    },
    categories: {
      lodging: "Unterkünfte",
      food: "Essen",
      music: "Musik",
      history: "Geschichte"
    },
    stateExplore: "Erkunden",
    stateAttractions: "Top Attraktionen:"
  },
  fr: {
    title: "Explorez la Route Historique",
    subtitle: "Naviguez sur l'emblématique voyage de 3.940 km avec notre carte interactive",
    filters: {
      motorcycle: "Adapté aux motos",
      english: "Personnel anglophone",
      local: "Favori local",
      family: "Adapté aux familles"
    },
    categories: {
      lodging: "Hébergement",
      food: "Nourriture",
      music: "Musique",
      history: "Histoire"
    },
    stateExplore: "Explorer",
    stateAttractions: "Attractions Principales:"
  },
  nl: {
    title: "Verken de Historische Route",
    subtitle: "Navigeer de iconische reis van 3.940 km met onze interactieve kaart",
    filters: {
      motorcycle: "Motorvriendelijk",
      english: "Engelssprekend personeel",
      local: "Lokale favoriet",
      family: "Gezinsvriendelijk"
    },
    categories: {
      lodging: "Accommodatie",
      food: "Eten",
      music: "Muziek",
      history: "Geschiedenis"
    },
    stateExplore: "Verkennen",
    stateAttractions: "Topattracties:"
  }
};
