
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

  const createVintageRoute66Icon = () => {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
          <defs>
            <filter id="vintageShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
            </filter>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F5F2EA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#E8E2D4;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="route66Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1E3A5F;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2C5F41;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Shield Background -->
          <path d="M18 2 L32 8 L32 22 C32 28 26 34 18 40 C10 34 4 28 4 22 L4 8 Z" 
                fill="url(#shieldGradient)" 
                stroke="#2C5F41" 
                stroke-width="2" 
                filter="url(#vintageShadow)"/>
          
          <!-- Route 66 Banner -->
          <rect x="6" y="12" width="24" height="8" rx="2" 
                fill="url(#route66Gradient)" 
                stroke="#1E3A5F" 
                stroke-width="1"/>
          
          <!-- Route 66 Text -->
          <text x="18" y="17.5" text-anchor="middle" 
                fill="#F5F2EA" 
                font-family="Arial Black, sans-serif" 
                font-size="7" 
                font-weight="900">ROUTE</text>
          
          <!-- Large 66 -->
          <text x="18" y="30" text-anchor="middle" 
                fill="#D92121" 
                font-family="Arial Black, sans-serif" 
                font-size="12" 
                font-weight="900" 
                stroke="#1E3A5F" 
                stroke-width="0.5">66</text>
          
          <!-- Hidden Gem Star -->
          <circle cx="26" cy="10" r="4" fill="#D92121" stroke="#F5F2EA" stroke-width="1"/>
          <path d="M26,7 L26.8,9.2 L29,9.2 L27.1,10.6 L27.9,12.8 L26,11.4 L24.1,12.8 L24.9,10.6 L23,9.2 L25.2,9.2 Z" 
                fill="#F5F2EA"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(36, 42),
      anchor: new google.maps.Point(18, 42)
    };
  };

  if (loading) {
    console.log('⏳ Hidden gems still loading...');
    return null;
  }

  console.log(`🗺️ Rendering ${hiddenGems.length} vintage Route 66 hidden gems on map`);

  return (
    <>
      {hiddenGems.map((gem) => {
        console.log(`Rendering vintage gem: ${gem.title} at ${gem.latitude}, ${gem.longitude}`);
        return (
          <Marker
            key={`hidden-gem-${gem.id}`}
            position={{ lat: Number(gem.latitude), lng: Number(gem.longitude) }}
            onClick={() => handleMarkerClick(gem)}
            icon={createVintageRoute66Icon()}
            title={`Hidden Gem: ${gem.title}`}
            zIndex={1000}
          >
            {activeGem === gem.id && (
              <InfoWindow onCloseClick={() => setActiveGem(null)}>
                <div className="vintage-roadside-sign max-w-xs bg-gradient-to-b from-route66-cream to-gray-100 border-4 border-route66-blue rounded-lg shadow-2xl overflow-hidden">
                  {/* Vintage Header Banner */}
                  <div className="bg-gradient-to-r from-route66-blue to-teal-700 text-route66-cream px-4 py-2 relative">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-route66-red rounded-full flex items-center justify-center border border-route66-cream">
                          <Star className="h-3 w-3 text-route66-cream" fill="currentColor" />
                        </div>
                        <span className="text-xs font-black tracking-wide uppercase">Hidden Gem</span>
                      </div>
                      <div className="text-xs font-bold bg-route66-cream text-route66-blue px-2 py-1 rounded transform -rotate-3">
                        ROUTE 66
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content Area */}
                  <div className="p-4 bg-route66-cream">
                    {/* Title Section */}
                    <div className="mb-3 text-center">
                      <h3 className="font-black text-lg text-route66-blue leading-tight uppercase tracking-wide border-b-2 border-route66-red pb-1 mb-2">
                        {gem.title}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-route66-gray">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm font-bold uppercase tracking-wide">{gem.city_name}</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    {gem.description && (
                      <div className="mb-4 p-3 bg-white border-2 border-dashed border-route66-blue rounded">
                        <p className="text-sm text-route66-gray leading-relaxed font-medium">
                          {gem.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Website Button */}
                    {gem.website && (
                      <div className="text-center mb-3">
                        <button
                          onClick={() => handleWebsiteClick(gem.website!)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-route66-red text-route66-cream font-bold text-sm rounded-full border-2 border-route66-blue hover:bg-red-700 transition-all duration-200 shadow-lg transform hover:scale-105 uppercase tracking-wide"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Visit Site
                        </button>
                      </div>
                    )}
                    
                    {/* Bottom Banner */}
                    <div className="bg-gradient-to-r from-route66-blue to-teal-700 text-route66-cream px-3 py-2 -mx-4 -mb-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 bg-route66-red rounded-full flex items-center justify-center">
                          <span className="text-xs font-black text-route66-cream">66</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">
                          America's Main Street
                        </span>
                        <div className="w-4 h-4 bg-route66-red rounded-full flex items-center justify-center">
                          <span className="text-xs font-black text-route66-cream">66</span>
                        </div>
                      </div>
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
