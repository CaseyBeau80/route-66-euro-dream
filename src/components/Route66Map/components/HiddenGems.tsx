
import React, { useEffect, useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';
import { Eye, MapPin, ExternalLink } from 'lucide-react';

interface HiddenGem {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  city_name: string;
  website: string | null;
}

interface HiddenGemsProps {
  map: google.maps.Map;
  onGemClick?: (gem: HiddenGem) => void;
}

const HiddenGems: React.FC<HiddenGemsProps> = ({ map, onGemClick }) => {
  const [hiddenGems, setHiddenGems] = useState<HiddenGem[]>([]);
  const [activeGem, setActiveGem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHiddenGems();
  }, []);

  const fetchHiddenGems = async () => {
    try {
      console.log('🔍 Fetching hidden gems from database...');
      const { data, error } = await supabase
        .from('hidden_gems')
        .select('*')
        .order('title');

      if (error) {
        console.error('Error fetching hidden gems:', error);
        return;
      }

      console.log(`✨ Found ${data?.length || 0} hidden gems`, data);
      setHiddenGems(data || []);
    } catch (error) {
      console.error('Error in fetchHiddenGems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (gem: HiddenGem) => {
    console.log('🎯 Hidden gem clicked:', gem.title);
    setActiveGem(activeGem === gem.id ? null : gem.id);
    if (onGemClick) {
      onGemClick(gem);
    }
  };

  const handleWebsiteClick = (website: string) => {
    console.log('🌐 Opening website:', website);
    // Ensure the URL has a protocol
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`🗺️ Rendering ${hiddenGems.length} hidden gems on map`);

  return (
    <>
      {hiddenGems.map((gem) => {
        console.log(`Rendering gem: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
        return (
          <Marker
            key={`hidden-gem-${gem.id}`}
            position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
            onClick={() => handleMarkerClick(gem)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="12" fill="#7C3AED" stroke="#FFFFFF" stroke-width="3"/>
                  <path d="M14 8l3 8-8-3 8 3-3 8" fill="#FFFFFF" stroke="#7C3AED" stroke-width="1"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(28, 28),
              anchor: new google.maps.Point(14, 14)
            }}
            title={`Hidden Gem: ${gem.title}`}
            zIndex={1000}
          >
            {activeGem === gem.id && (
              <InfoWindow onCloseClick={() => setActiveGem(null)}>
                <div className="p-3 max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <h3 className="font-bold text-purple-800">{gem.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{gem.city_name}</span>
                  </div>
                  
                  {gem.description && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {gem.description}
                    </p>
                  )}
                  
                  {gem.website && (
                    <div className="mb-3">
                      <button
                        onClick={() => handleWebsiteClick(gem.website!)}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit Website
                      </button>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-xs text-purple-600 font-medium">
                      ✨ Hidden Gem
                    </span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default HiddenGems;
