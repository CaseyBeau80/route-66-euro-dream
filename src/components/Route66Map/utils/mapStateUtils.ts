
/**
 * Helper function to calculate approximate centroids for state labels
 */
export const getStateCentroid = (pathD: string): {x: number, y: number} | null => {
  // A simple centroid approximation based on the path's points
  const points = pathD.split(/[ML,Z]/).filter(Boolean);
  let sumX = 0, sumY = 0, count = 0;
  
  points.forEach(point => {
    const [x, y] = point.trim().split(' ').map(Number);
    if (!isNaN(x) && !isNaN(y)) {
      sumX += x;
      sumY += y;
      count++;
    }
  });
  
  return count ? {x: sumX/count, y: sumY/count} : null;
};
