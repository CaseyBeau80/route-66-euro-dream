
import { DetailedWaypointData } from '../types/DetailedWaypointData';

export const oklahomaWaypoints: DetailedWaypointData[] = [
  // Oklahoma - Following I-44 then I-40 with extensive detail
  {lat: 36.9000, lng: -94.8000, stopover: false, description: "Miami, OK", highway: "I-44"},
  {lat: 36.7000, lng: -95.2000, stopover: false, description: "Vinita", highway: "I-44"},
  {lat: 36.4500, lng: -95.6500, stopover: false, description: "Claremore", highway: "I-44"},
  {lat: 36.1540, lng: -95.9928, stopover: true, description: "Tulsa, OK", highway: "I-44"},
  {lat: 35.9500, lng: -96.4000, stopover: false, description: "Sapulpa", highway: "I-44"},
  {lat: 35.8500, lng: -96.6000, stopover: false, description: "Stroud", highway: "I-44"},
  {lat: 35.6500, lng: -97.0000, stopover: false, description: "Chandler", highway: "I-44"},
  {lat: 35.4676, lng: -97.5164, stopover: true, description: "Oklahoma City, OK", highway: "I-44/I-40"},
  {lat: 35.5322, lng: -97.9553, stopover: false, description: "El Reno", highway: "I-40"},
  {lat: 35.3500, lng: -98.5000, stopover: false, description: "Weatherford", highway: "I-40"},
  {lat: 35.5089, lng: -98.9680, stopover: true, description: "Elk City, OK", highway: "I-40"},
];
