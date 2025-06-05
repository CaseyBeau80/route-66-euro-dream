
export interface RouteSection {
  name: string;
  startPercent: number;
  endPercent: number;
}

export const ROUTE_SECTIONS: RouteSection[] = [
  { name: 'Early Route', startPercent: 0, endPercent: 33 },
  { name: 'Mid Route', startPercent: 33, endPercent: 66 },
  { name: 'Final Stretch', startPercent: 66, endPercent: 100 }
];
