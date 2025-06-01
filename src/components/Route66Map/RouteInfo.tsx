
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Route, Clock, Eye, Compass } from 'lucide-react';
import { route66Towns } from '@/types/route66';
import { supabase } from '@/integrations/supabase/client';
import HiddenGemsLegend from './components/HiddenGemsLegend';

interface RouteInfoProps {
  selectedState: string | null;
}

const RouteInfo: React.FC<RouteInfoProps> = ({ selectedState }) => {
  const [hiddenGemsCount, setHiddenGemsCount] = useState(0);

  useEffect(() => {
    fetchHiddenGemsCount();
  }, []);

  const fetchHiddenGemsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('hidden_gems')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching hidden gems count:', error);
        return;
      }

      console.log(`✨ Found ${count} hidden gems in database`);
      setHiddenGemsCount(count || 0);
    } catch (error) {
      console.error('Error in fetchHiddenGemsCount:', error);
    }
  };

  const stateToFullName: { [key: string]: string } = {
    'CA': 'California',
    'AZ': 'Arizona', 
    'NM': 'New Mexico',
    'TX': 'Texas',
    'OK': 'Oklahoma',
    'MO': 'Missouri',
    'IL': 'Illinois'
  };

  const selectedStateFullName = selectedState ? stateToFullName[selectedState] : null;
  const townsInSelectedState = selectedStateFullName
    ? route66Towns.filter(town => town.name.includes(selectedStateFullName))
    : [];

  return (
    <div className="mt-3 space-y-3">
      {/* Vintage Route Statistics Card */}
      <Card className="route66-authentic border-2 border-route66-vintage-brown">
        <CardHeader className="pb-2 bg-gradient-to-r from-route66-vintage-red to-route66-vintage-burgundy text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Compass className="h-5 w-5 text-route66-vintage-yellow" />
            <span className="font-travel tracking-wider">ROUTE 66 OVERVIEW</span>
            <div className="w-6 h-6 bg-route66-vintage-yellow rounded-full flex items-center justify-center ml-auto">
              <span className="text-route66-navy font-bold text-xs">66</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 pb-3 vintage-paper-texture">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center vintage-postcard p-3">
              <div className="text-2xl font-bold text-route66-vintage-red font-route66">2,448</div>
              <div className="text-xs text-route66-vintage-brown font-travel uppercase tracking-wide">Miles</div>
            </div>
            <div className="text-center vintage-postcard p-3">
              <div className="text-2xl font-bold text-route66-vintage-blue font-route66">8</div>
              <div className="text-xs text-route66-vintage-brown font-travel uppercase tracking-wide">States</div>
            </div>
            <div className="text-center vintage-postcard p-3">
              <div className="text-2xl font-bold text-route66-vintage-turquoise font-route66">{route66Towns.length}</div>
              <div className="text-xs text-route66-vintage-brown font-travel uppercase tracking-wide">Towns</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {Object.entries(stateToFullName).map(([code, name]) => (
              <Badge 
                key={code} 
                variant={selectedState === code ? "default" : "secondary"}
                className={`text-xs px-2 py-1 stamp-effect font-travel ${
                  selectedState === code 
                    ? 'bg-route66-vintage-red text-white' 
                    : 'bg-route66-vintage-beige text-route66-vintage-brown'
                }`}
              >
                {code}
              </Badge>
            ))}
          </div>
          
          {selectedStateFullName && (
            <div className="mt-3 p-3 bg-route66-vintage-yellow rounded-lg border-2 border-route66-vintage-brown">
              <div className="text-center">
                <div className="font-americana text-sm font-bold text-route66-navy mb-1">
                  {selectedStateFullName.toUpperCase()}
                </div>
                <div className="text-xs text-route66-vintage-brown font-travel">
                  {townsInSelectedState.length} Historic Stops: {townsInSelectedState
                    .map(town => town.name.split(',')[0])
                    .slice(0, 3)
                    .join(', ')}
                  {townsInSelectedState.length > 3 && ` & ${townsInSelectedState.length - 3} more`}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Hidden Gems Legend */}
      <HiddenGemsLegend count={hiddenGemsCount} />

      {/* Vintage Map Legend Card */}
      <Card className="route66-authentic border-2 border-route66-vintage-brown">
        <CardHeader className="pb-2 bg-gradient-to-r from-route66-vintage-blue to-route66-navy text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-lg">
            <MapPin className="h-5 w-5 text-route66-vintage-yellow" />
            <span className="font-travel tracking-wider">MAP LEGEND</span>
            <div className="w-6 h-6 bg-route66-vintage-yellow rounded-full flex items-center justify-center ml-auto">
              <span className="text-route66-navy font-bold text-xs">★</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 pb-3 vintage-paper-texture">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 vintage-postcard p-2">
              <div className="w-4 h-4 bg-route66-vintage-red rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-travel text-route66-vintage-brown">Historic Route 66 Towns</span>
            </div>
            <div className="flex items-center gap-3 vintage-postcard p-2">
              <div className="w-4 h-2 bg-route66-orange rounded shadow-sm"></div>
              <span className="font-travel text-route66-vintage-brown">The Mother Road Pathway</span>
            </div>
            <div className="flex items-center gap-3 vintage-postcard p-2">
              <div className="w-4 h-4 bg-route66-vintage-turquoise rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-white transform rotate-45"></div>
              </div>
              <span className="font-travel text-route66-vintage-brown">Hidden Gems & Attractions</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown vintage-paper-texture">
            <div className="flex items-center gap-2 text-route66-vintage-blue mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-americana font-bold text-sm">TRAVEL TIP</span>
            </div>
            <p className="text-xs text-route66-vintage-brown font-travel leading-relaxed">
              Click any marker to discover authentic Route 66 stories, vintage photos, and local treasures. 
              Purple gems reveal the road's best-kept secrets!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteInfo;
