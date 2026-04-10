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

const FeaturedStopsTeaser: React.FC = () => {
  const [stops, setStops] = React.useState<FeaturedStop[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [attractionsRes, gemsRes] = await Promise.all([
          supabase.from('attractions').select('name, slug, city_name, state, image_url, category').eq('featured', true).limit(8),
          supabase.from('hidden_gems').select('name, slug, city_name, state, image_url, category').eq('featured', true).limit(4),
        ]);

        const attractions: FeaturedStop[] = (attractionsRes.data || []).map(a => ({ ...a, source: 'attractions' as const }));
        const gems: FeaturedStop[] = (gemsRes.data || []).map(g => ({ ...g, source: 'hidden_gems' as const }));
        
        // Combine and take up to 8
        setStops([...attractions, ...gems].slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch featured stops:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-route66-background-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-route66-red/10 text-route66-red px-4 py-1.5 rounded-full text-sm font-medium mb-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stops.map((stop) => (
              <Link
                key={`${stop.source}-${stop.slug}`}
                to={`/attractions/${stop.slug}`}
                className="group"
              >
                <Card className="overflow-hidden border-2 border-route66-border hover:border-route66-red bg-white shadow-[4px_4px_0_0_rgba(107,76,56,0.15)] hover:shadow-[2px_2px_0_0_rgba(192,57,43,0.2)] transition-all duration-200 rounded-sm h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    {stop.image_url ? (
                      <PictureOptimized
                        src={stop.image_url}
                        alt={stop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={300}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
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
