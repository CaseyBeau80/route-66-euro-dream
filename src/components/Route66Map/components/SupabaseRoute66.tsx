
import React, { useEffect } from 'react';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';
import type { SupabaseRoute66Props } from '../types/supabaseTypes';

interface EnhancedSupabaseRoute66Props extends SupabaseRoute66Props {
  onRouteError?: () => void;
  onRouteSuccess?: () => void;
}

// This component is COMPLETELY DISABLED to prevent route conflicts
// All route rendering is now handled EXCLUSIVELY by Route66StaticPolyline component
const SupabaseRoute66: React.FC<EnhancedSupabaseRoute66Props> = ({ 
  map, 
  onRouteError,
  onRouteSuccess
}) => {
  console.log('⚠️ SupabaseRoute66: Component COMPLETELY DISABLED to prevent conflicts with SINGLE Route66StaticPolyline - NO RENDERING WHATSOEVER');
  
  // Don't call any callbacks to prevent interference with the main route system
  return null;
};

export default SupabaseRoute66;
