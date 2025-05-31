
export interface MarkerCluster {
  id: string;
  centerLat: number;
  centerLng: number;
  markers: Array<{
    id: string;
    latitude: number;
    longitude: number;
    type: 'gem' | 'attraction' | 'destination';
    data: any;
  }>;
  isExpanded: boolean;
}

export interface ClusterMarkerProps {
  cluster: MarkerCluster;
  map: google.maps.Map;
  onExpand: (clusterId: string) => void;
  onMarkerClick: (marker: any, type: string) => void;
}

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  type: 'gem' | 'attraction' | 'destination';
  data: any;
}
