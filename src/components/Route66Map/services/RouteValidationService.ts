
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteValidationService {
  static validateRoute(mainRouteCities: DestinationCity[], santaFeCity: DestinationCity | null): boolean {
    console.log('🔧 DEBUG: Validating route configuration');

    // Critical validation checks
    const hasChicago = mainRouteCities.some(city => city.name.toLowerCase().includes('chicago'));
    const hasSantaMonica = mainRouteCities.some(city => city.name.toLowerCase().includes('santa monica'));
    const hasAlbuquerqueInMain = mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque'));
    const hasSantaRosa = mainRouteCities.some(city => city.name.toLowerCase().includes('santa rosa'));
    const hasGallup = mainRouteCities.some(city => city.name.toLowerCase().includes('gallup'));
    
    console.log('🔧 DEBUG: Route validation checks:', {
      hasChicago,
      hasSantaMonica,
      hasAlbuquerqueInMain,
      hasSantaRosa,
      hasGallup,
      routeLength: mainRouteCities.length
    });
    
    if (hasAlbuquerqueInMain) {
      console.error('❌ CRITICAL ERROR: Albuquerque found in main route - should be excluded');
      return false;
    }

    if (!hasSantaRosa || !hasGallup) {
      console.error('❌ CRITICAL: Missing Santa Rosa or Gallup for direct connection');
      return false;
    }
    
    if (!hasChicago || !hasSantaMonica) {
      console.error('❌ Missing critical endpoints:', { hasChicago, hasSantaMonica });
      return false;
    }

    if (mainRouteCities.length < 2) {
      console.warn('⚠️ Not enough cities found in the correct order to create main route');
      return false;
    }

    // Verify Santa Rosa to Gallup direct connection
    const directConnection = this.verifySantaRosaToGallupConnection(mainRouteCities);
    if (!directConnection) {
      console.warn('⚠️ Santa Rosa to Gallup connection not direct');
    }

    console.log('✅ Route validation passed');
    return true;
  }

  private static verifySantaRosaToGallupConnection(mainRouteCities: DestinationCity[]): boolean {
    const santaRosaIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('santa rosa')
    );
    const gallupIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('gallup')
    );
    
    if (santaRosaIndex !== -1 && gallupIndex !== -1) {
      const directConnection = Math.abs(gallupIndex - santaRosaIndex) === 1;
      console.log('🔧 DEBUG: Santa Rosa → Gallup connection check:', {
        santaRosaIndex,
        gallupIndex,
        directConnection,
        citiesInBetween: directConnection ? 0 : Math.abs(gallupIndex - santaRosaIndex) - 1
      });
      return directConnection;
    }
    
    return false;
  }
}
