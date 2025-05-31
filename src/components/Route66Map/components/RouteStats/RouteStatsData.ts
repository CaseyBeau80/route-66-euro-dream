
export interface RouteStats {
  totalPoints: number;
  totalDistance: number;
  segments: number;
  averagePointsPerSegment: number;
}

export const getMockRouteStats = (): RouteStats => {
  return {
    totalPoints: 1847,
    totalDistance: 2448.2,
    segments: 209,
    averagePointsPerSegment: 8.8
  };
};
