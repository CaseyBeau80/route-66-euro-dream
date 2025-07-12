import type { Attraction } from '@/components/Route66Map/types/attractions';

export const filterAttractionsByZoom = (
  attractions: Attraction[],
  currentZoom: number,
  loading: boolean
): Attraction[] => {
  if (loading) {
    console.log('⏳ AttractionsContainer: Still loading attractions');
    return [];
  }

  let visibleAttractions = attractions;

  // Simplified zoom-based filtering - less aggressive
  if (currentZoom >= 7) {
    // High zoom: show all attractions
    visibleAttractions = attractions;
    console.log(`🎯 HIGH ZOOM (${currentZoom}): Showing ALL ${attractions.length} attractions`);
  } else if (currentZoom >= 5) {
    // Medium zoom: show featured + every other attraction
    visibleAttractions = attractions.filter((attraction, index) => 
      attraction.featured || index % 2 === 0
    );
    console.log(`🎯 MEDIUM ZOOM (${currentZoom}): Showing ${visibleAttractions.length} of ${attractions.length} attractions`);
  } else {
    // Low zoom: show featured + every 3rd attraction
    visibleAttractions = attractions.filter((attraction, index) => 
      attraction.featured || index % 3 === 0
    );
    console.log(`🎯 LOW ZOOM (${currentZoom}): Showing ${visibleAttractions.length} of ${attractions.length} attractions`);
  }

  // Debug: Check if our specific attractions are in the filtered list
  const waterfalls = visibleAttractions.find(a => a.name.toLowerCase().includes('waterfall'));
  const shoalCreek = visibleAttractions.find(a => a.name.toLowerCase().includes('shoal creek'));
  
  console.log('🔍 FILTERED ATTRACTIONS CHECK:');
  console.log('  The Waterfalls in filtered list:', waterfalls ? 'YES' : 'NO');
  console.log('  Shoal Creek in filtered list:', shoalCreek ? 'YES' : 'NO');

  return visibleAttractions;
};