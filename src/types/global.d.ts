
// Global type definitions
interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
  jvm?: any; // Added jvm property to the Window interface
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
  borderColor?: string;
  borderOpacity?: number;
  borderWidth?: number;
  color?: string;
  enableZoom?: boolean;
  hoverColor?: string;
  hoverOpacity?: number | null;
  normalizeFunction?: string;
  scaleColors?: string[];
  selectedColor?: string;
  selectedRegions?: string[];
  showTooltip?: boolean;
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
