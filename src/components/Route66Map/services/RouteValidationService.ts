
import type { DestinationCity } from '../hooks/useDestinationCities';

export class RouteValidationService {
  static validateRoute(mainRouteCities: DestinationCity[], santaFeCity: DestinationCity | null): boolean {
    console.log('🔧 DEBUG: Validating flowing route configuration with Santa Fe branch in main route');

    // Critical validation checks for flowing Santa Fe branch
    const hasChicago = mainRouteCities.some(city => city.name.toLowerCase().includes('chicago'));
    const hasSantaMonica = mainRouteCities.some(city => city.name.toLowerCase().includes('santa monica'));
    const hasSantaFeInMain = mainRouteCities.some(city => city.name.toLowerCase().includes('santa fe'));
    const hasAlbuquerqueInMain = mainRouteCities.some(city => city.name.toLowerCase().includes('albuquerque'));
    const hasSantaRosa = mainRouteCities.some(city => city.name.toLowerCase().includes('santa rosa'));
    const hasGallup = mainRouteCities.some(city => city.name.toLowerCase().includes('gallup'));
    
    console.log('🔧 DEBUG: Flowing route validation checks:', {
      hasChicago,
      hasSantaMonica,
      hasSantaFeInMain,
      hasAlbuquerqueInMain,
      hasSantaRosa,
      hasGallup,
      routeLength: mainRouteCities.length
    });
    
    if (!hasSantaFeInMain || !hasAlbuquerqueInMain) {
      console.error('❌ CRITICAL ERROR: Santa Fe or Albuquerque not found in main route for flowing branch');
      return false;
    }

    if (!hasSantaRosa || !hasGallup) {
      console.error('❌ CRITICAL: Missing Santa Rosa or Gallup for flowing branch connection');
      return false;
    }
    
    if (!hasChicago || !hasSantaMonica) {
      console.error('❌ Missing critical endpoints:', { hasChicago, hasSantaMonica });
      return false;
    }

    if (mainRouteCities.length < 2) {
      console.warn('⚠️ Not enough cities found in the correct order to create flowing main route');
      return false;
    }

    // Verify Santa Fe branch flow: Santa Rosa → Santa Fe → Albuquerque → Gallup
    const flowingConnection = this.verifySantaFeBranchFlow(mainRouteCities);
    if (!flowingConnection) {
      console.warn('⚠️ Santa Fe branch flow not properly ordered');
    }

    console.log('✅ Flowing route validation passed - Santa Fe branch integrated in main route');
    return true;
  }

  private static verifySantaFeBranchFlow(mainRouteCities: DestinationCity[]): boolean {
    const santaRosaIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('santa rosa')
    );
    const santaFeIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('santa fe')
    );
    const albuquerqueIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('albuquerque')
    );
    const gallupIndex = mainRouteCities.findIndex(city => 
      city.name.toLowerCase().includes('gallup')
    );
    
    if (santaRosaIndex !== -1 && santaFeIndex !== -1 && albuquerqueIndex !== -1 && gallupIndex !== -1) {
      const properFlow = (
        santaFeIndex === santaRosaIndex + 1 &&
        albuquerqueIndex === santaFeIndex + 1 &&
        gallupIndex === albuquerqueIndex + 1
      );
      
      console.log('🔧 DEBUG: Santa Fe branch flow check:', {
        santaRosaIndex,
        santaFeIndex,
        albuquerqueIndex,
        gallupIndex,
        properFlow,
        sequence: `${santaRosaIndex} → ${santaFeIndex} → ${albuquerqueIndex} → ${gallupIndex}`
      });
      
      return properFlow;
    }
    
    return false;
  }
}
