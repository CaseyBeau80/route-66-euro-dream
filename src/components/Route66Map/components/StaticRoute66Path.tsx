
import { useEffect } from 'react';
import Route66Markers from './markers/Route66Markers';

interface StaticRoute66PathProps {
  map: google.maps.Map;
  enhanced?: boolean; // Whether to show enhanced static route
}

const StaticRoute66Path = ({ map, enhanced = false }: StaticRoute66PathProps) => {
  return <Route66Markers map={map} enhanced={enhanced} />;
};

export default StaticRoute66Path;
