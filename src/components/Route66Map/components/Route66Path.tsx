
import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { polylineOptions } from '../config/MapConfig';

interface Route66PathProps {
  path: google.maps.LatLngLiteral[];
}

// Component removed as requested
const Route66Path: React.FC<Route66PathProps> = ({ path }) => {
  // Returning null instead of rendering the path
  return null;
};

export default Route66Path;
