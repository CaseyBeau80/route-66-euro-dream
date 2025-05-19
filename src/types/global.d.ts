
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
  onRegionClick?: (event: Event, code: string) => void;
  onMarkerClick?: (event: Event, index: number) => void;
}
