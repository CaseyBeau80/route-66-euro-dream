
// Global type definitions
interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
}

interface JQueryStatic {
  fn: JQueryFn;
  (selector: string | Element | Document | JQuery): JQuery;
}

interface JQueryFn {
  vectorMap: any;
}

interface JQuery {
  vectorMap: (options?: VectorMapOptions) => any;
  data(key: string): any;
  empty(): JQuery;
}

interface VectorMapOptions {
  map: string;
  backgroundColor?: string;
  borderColor?: string;        // Added missing property
  borderOpacity?: number;      // Added missing property
  borderWidth?: number;        // Added missing property
  color?: string;              // Added missing property
  enableZoom?: boolean;        // Added missing property
  hoverColor?: string;         // Added missing property
  hoverOpacity?: number | null; // Added missing property
  normalizeFunction?: string;  // Added missing property
  scaleColors?: string[];      // Added missing property
  selectedColor?: string;      // Added missing property
  selectedRegions?: string[];  // Added missing property
  showTooltip?: boolean;       // Added missing property
  regionStyle?: {
    initial?: Record<string, any>;
    hover?: Record<string, any>;
    selected?: Record<string, any>;
  };
  markers?: Array<{
    latLng: [number, number]; // Explicitly using tuple type
    name: string;
  }>;
  markerStyle?: {
    initial?: Record<string, any>;
    hover?: Record<string, any>;
    selected?: Record<string, any>;
  };
  onRegionOver?: (event: Event, code: string) => void;
  onMarkerOver?: (event: Event, index: number) => void;
  onRegionClick?: (event: Event, code: string, region: string) => void; // Updated to match implementation
  onMarkerClick?: (event: Event, index: number) => void;
}
