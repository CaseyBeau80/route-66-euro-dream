
import React, { useEffect, useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';
import { Eye, MapPin, ExternalLink, Star } from 'lucide-react';

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
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const createEnhancedGemIcon = () => {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
            </filter>
            <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#9333EA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="14" cy="14" r="12" fill="url(#gemGradient)" stroke="#FFFFFF" stroke-width="2" filter="url(#shadow)"/>
          <circle cx="14" cy="14" r="8" fill="#FFFFFF" fill-opacity="0.2"/>
          <g transform="translate(14,14)">
            <path d="M-3,-6 L0,-8 L3,-6 L4,0 L0,6 L-4,0 Z" fill="#FFFFFF" stroke="#7C3AED" stroke-width="0.5"/>
            <circle cx="0" cy="-2" r="1" fill="#FFD700"/>
          </g>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(28, 28),
      anchor: new google.maps.Point(14, 14)
    };
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
            icon={createEnhancedGemIcon()}
            title={`Hidden Gem: ${gem.title}`}
            zIndex={1000}
          >
            {activeGem === gem.id && (
              <InfoWindow onCloseClick={() => setActiveGem(null)}>
                <div className="p-4 max-w-sm bg-white rounded-lg shadow-lg">
                  {/* Header with icon and title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-purple-800 leading-tight">
                        {gem.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-600">{gem.city_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {gem.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {gem.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Website link */}
                  {gem.website && (
                    <div className="mb-3">
                      <button
                        onClick={() => handleWebsiteClick(gem.website!)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit Website
                      </button>
                    </div>
                  )}
                  
                  {/* Footer badge */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        Hidden Gem
                      </span>
                    </div>
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
