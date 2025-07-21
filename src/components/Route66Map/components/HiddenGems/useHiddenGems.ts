import { useEffect, useState } from 'react';
import { HiddenGem } from './types';

export const useHiddenGems = () => {
  const [hiddenGems, setHiddenGems] = useState<HiddenGem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHiddenGems();
  }, []);

  const fetchHiddenGems = async () => {
    try {
      console.log('💎 Loading static hidden gems data...');
      
      // Static hidden gems data for Route 66
      const staticHiddenGems: HiddenGem[] = [
        {
          id: '1',
          title: 'Blue Whale of Catoosa',
          latitude: 36.1878,
          longitude: -95.7489,
          description: 'Giant blue whale sculpture and swimming hole in Catoosa, Oklahoma.',
          city_name: 'Catoosa',
          website: null
        },
        {
          id: '2',
          title: 'Cadillac Ranch',
          latitude: 35.2220,
          longitude: -101.9673,
          description: 'Art installation with 10 half-buried Cadillacs in Amarillo, Texas.',
          city_name: 'Amarillo',
          website: null
        },
        {
          id: '3',
          title: 'Gemini Giant',
          latitude: 41.5056,
          longitude: -88.0817,
          description: 'Fiberglass muffler man holding a rocket in Wilmington, Illinois.',
          city_name: 'Wilmington',
          website: null
        },
        {
          id: '4',
          title: 'Wigwam Motel',
          latitude: 35.0819,
          longitude: -110.0298,
          description: 'Iconic teepee-shaped motel rooms in Holbrook, Arizona.',
          city_name: 'Holbrook',
          website: null
        },
        {
          id: '5',
          title: 'Leaning Water Tower',
          latitude: 35.0889,
          longitude: -100.8900,
          description: 'Famous leaning water tower in Groom, Texas.',
          city_name: 'Groom',
          website: null
        }
      ];

      console.log(`💎 Found ${staticHiddenGems.length} static hidden gems`);
      
      staticHiddenGems.forEach(gem => {
        console.log(`✅ Valid coordinates for ${gem.title}: lat=${gem.latitude}, lng=${gem.longitude}`);
      });

      setHiddenGems(staticHiddenGems);
      console.log(`💎 Set ${staticHiddenGems.length} valid hidden gems`);
      
    } catch (error) {
      console.error('❌ Error in fetchHiddenGems:', error);
    } finally {
      setLoading(false);
    }
  };

  return { hiddenGems, loading };
};