
import React from 'react';
import { Polyline } from '@react-google-maps/api';
import { polylineOptions } from '../config/MapConfig';

interface Route66PathProps {
  path: google.maps.LatLngLiteral[];
}

const Route66Path: React.FC<Route66PathProps> = ({ path }) => {
  return (
    <Polyline
      path={path}
      options={polylineOptions}
    />
  );
};

export default Route66Path;
