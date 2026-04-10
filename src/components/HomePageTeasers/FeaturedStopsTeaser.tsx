import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { PictureOptimized } from '@/components/ui/PictureOptimized';

interface FeaturedStop {
  name: string;
  slug: string;
  city_name: string;
  state: string;
  image_url: string | null;
  category: string;
  source: 'attractions' | 'hidden_gems';
}

// Curated fallback stops when no featured data is available
const FALLBACK_STOPS: FeaturedStop[] = [
  {
    name: "Cadillac Ranch",
    slug: "cadillac-ranch",
    city_name: "Amarillo",
    state: "TX",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    category: "Roadside Oddities",
    source: "attractions"
  },
  {
    name: "Blue Whale of Catoosa",
    slug: "blue-whale-of-catoosa",
    city_name: "Catoosa",
    state: "OK",
    image_url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
    category: "Roadside Oddities",
    source: "attractions"
  },
  {
    name: "Wigwam Motel",
    slug: "wigwam-motel",
    city_name: "Holbrook",
    state: "AZ",
    image_url: "https://images.unsplash.com/photo-1545243424-0ce743321e11?w=400&h=300&fit=crop",
    category: "Motels & Lodging",
    source: "attractions"
  },
  {
    name: "Santa Monica Pier",
    slug: "santa-monica-pier",
    city_name: "Santa Monica",
    state: "CA",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    category: "History & Landmarks",
    source: "attractions"
  },
  {
    name: "Gateway Arch",
    slug: "gateway-arch",
    city_name: "St. Louis",
    state: "MO",
    image_url: "https://images.unsplash.com/photo-1569025743873-ea3a9ber979f?w=400&h=300&fit=crop",
    category: "History & Landmarks",
    source: "attractions"
  },
  {
    name: "Meramec Caverns",
    slug: "meramec-caverns",
    city_name: "Stanton",
    state: "MO",
    image_url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=300&fit=crop",
    category: "Parks & Nature",
    source: "attractions"
  },
  {
    name: "Petrified Forest",
    slug: "petrified-forest-national-park",
    city_name: "Holbrook",
    state: "AZ",
    image_url: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=400&h=300&fit=crop",
    category: "Parks & Nature",
    source: "attractions"
  },
  {
    name: "Route 66 Museum",
    slug: "route-66-museum-clinton",
    city_name: "Clinton",
    state: "OK",
    image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop",
    category: "Museums",
    source: "attractions"
  }
];

const FeaturedStopsTeaser: React.FC = () => {
  const [stops, setStops] = React.useState<FeaturedStop[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [attractionsRes, gemsRes] = await Promise.all([
          supabase.from('attractions' as any).select('name, slug, city_name, state, image_url, category').eq('featured', true).limit(8),
          supabase.from('hidden_gems' as any).select('name, slug, city_name, state, image_url, category').eq('featured', true).limit(4),
        ]);

        const attractions: FeaturedStop[] = ((attractionsRes.data || []) as any[]).map(a => ({ ...a, source: 'attractions' as const }));
        const gems: FeaturedStop[] = ((gemsRes.data || []) as any[]).map(g => ({ ...g, source: 'hidden_gems' as const }));
        
        const combined = [...attractions, ...gems].slice(0, 8);
        
        // Use fallback if no featured data available
        setStops(combined.length > 0 ? combined : FALLBACK_STOPS);
      } catch (err) {
        console.error('Failed to fetch featured stops:', err);
        setStops(FALLBACK_STOPS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getStopLink = (stop: FeaturedStop) => {
    return stop.source === 'hidden_gems' 
      ? `/hidden-gems/${stop.slug}` 
      : `/attractions/${stop.slug}`;
  };

  return (
    <section className="py-12 sm:py-16 bg-route66-background-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-route66-red/10 text-route66-red px-4 py-1.5 rounded-sm text-sm font-special-elite mb-4 border border-route66-red/20">
            <MapPin className="h-4 w-4" />
            <span>Don't Miss These</span>
          </div>
          <h2 className="font-route66 text-3xl sm:text-4xl text-route66-brown mb-3">
            Featured Stops
          </h2>
          <p className="text-route66-brown/70 font-body max-w-2xl mx-auto">
            Handpicked highlights along America's most famous highway — from neon-lit motels to giant roadside oddities.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stops.map((stop) => (
              <Link
                key={`${stop.source}-${stop.slug}`}
                to={getStopLink(stop)}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-route66-border hover:border-route66-red bg-white shadow-[4px_4px_0_0_rgba(107,76,56,0.15)] hover:shadow-[2px_2px_0_0_rgba(192,57,43,0.2)] transition-all duration-200 rounded-sm h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    {stop.image_url ? (
                      <img
                        src={stop.image_url}
                        alt={stop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-route66-cream flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-route66-brown/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-bold text-sm text-route66-brown group-hover:text-route66-red transition-colors line-clamp-1">
                      {stop.name}
                    </h3>
                    <p className="text-xs text-route66-brown/60 mt-1">
                      {stop.city_name}, {stop.state}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-route66-red hover:bg-route66-red-hover text-white font-special-elite px-6 py-3 rounded-sm border-2 border-route66-red shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
          >
            Browse all 240 stops
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStopsTeaser;