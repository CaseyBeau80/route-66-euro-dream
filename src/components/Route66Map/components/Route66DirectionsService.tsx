
import { useEffect, useState } from 'react';
import StaticRoute66Path from './StaticRoute66Path';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [pathRendered, setPathRendered] = useState(false);

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("Initializing Route 66 static highway path");
    setPathRendered(true);
  }, [map]);

  if (!pathRendered) return null;

  return (
    <StaticRoute66Path map={map} />
  );
};

export default Route66DirectionsService;
