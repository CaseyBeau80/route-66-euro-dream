
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DestinationCity {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
  website?: string;
  population?: number;
  founded_year?: number;
  featured?: boolean;
}

export const useDestinationCities = () => {
  const [destinationCities, setDestinationCities] = useState<DestinationCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinationCities = async () => {
      try {
        console.log("🏛️ Fetching destination cities from Supabase...");
        
        const { data, error } = await supabase
          .from('destination_cities')
          .select('*')
          .order('name');

        if (error) {
          console.error("❌ Error fetching destination cities:", error);
          setError(error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.log("❌ No destination cities found in database");
          setError("No destination cities found in database");
          return;
        }

        console.log(`✅ Fetched ${data.length} destination cities from Supabase`);
        
        // Enhanced debugging for Santa Fe specifically
        const santaFe = data.find(city => 
          city.name.toLowerCase().includes('santa fe') ||
          city.name.toLowerCase().includes('santa_fe')
        );
        
        if (santaFe) {
          console.log(`🎯 SANTA FE FOUND in destination_cities:`, {
            id: santaFe.id,
            name: santaFe.name,
            state: santaFe.state,
            latitude: santaFe.latitude,
            longitude: santaFe.longitude,
            coordinatesValid: !isNaN(santaFe.latitude) && !isNaN(santaFe.longitude),
            latitudeRange: santaFe.latitude >= 35 && santaFe.latitude <= 36,
            longitudeRange: santaFe.longitude >= -107 && santaFe.longitude <= -105
          });
        } else {
          console.error(`❌ SANTA FE NOT FOUND in destination_cities table!`);
          console.log(`🔍 Available cities:`, data.map(city => `${city.name}, ${city.state}`));
        }
        
        // Validate coordinates for all cities
        const invalidCoordinates = data.filter(city => 
          isNaN(city.latitude) || isNaN(city.longitude) ||
          city.latitude === 0 || city.longitude === 0
        );
        
        if (invalidCoordinates.length > 0) {
          console.warn(`⚠️ Cities with invalid coordinates:`, invalidCoordinates.map(city => 
            `${city.name}: lat=${city.latitude}, lng=${city.longitude}`
          ));
        }
        
        // Log cities for debugging
        console.log(`🏛️ Destination cities:`, data.map(city => `${city.name} (${city.state})`));
        
        setDestinationCities(data);
      } catch (err) {
        console.error("❌ Error fetching destination cities:", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationCities();
  }, []);

  return { destinationCities, isLoading, error };
};
