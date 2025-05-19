
import { createFallbackMapData } from "@/utils/mapDependencyUtils";
import { route66Towns } from "@/types/route66";

/**
 * Helper functions for maintaining compatibility with the legacy Route66Map.tsx implementation
 */

// Helper function to calculate approximate centroids for state labels
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

// Legacy route66Towns export for backward compatibility
export { route66Towns };

// Legacy fallback map creation
export const ensureFallbackMap = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Create fallback map data
    createFallbackMapData();
    return true;
  } catch (e) {
    console.error("Error creating fallback map:", e);
    return false;
  }
};
