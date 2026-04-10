import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PhotoEntry {
  id: string;
  photo_url: string;
  caption: string | null;
  traveler_name: string | null;
}

// Placeholder Route 66 images when no community photos exist yet
const PLACEHOLDER_PHOTOS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1545243424-0ce743321e11?w=300&h=300&fit=crop",
];

const PhotoWallTeaser: React.FC = () => {
  const [photos, setPhotos] = React.useState<PhotoEntry[]>([]);

  React.useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase
          .from('community_photos' as any)
          .select('id, photo_url, caption, traveler_name')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(4);
        if (data) setPhotos(data as unknown as PhotoEntry[]);
      } catch {
        // Table may not exist yet — fail silently
      }
    };
    fetchPhotos();
  }, []);

  const hasPhotos = photos.length > 0;
  const displayImages = hasPhotos
    ? photos.map(p => ({ src: p.photo_url, alt: p.caption || 'Route 66 community photo' }))
    : PLACEHOLDER_PHOTOS.map((src, i) => ({ src, alt: `Route 66 road trip scene ${i + 1}` }));

  return (
    <section className="py-12 sm:py-16 bg-route66-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-route66-gold/20 text-route66-brown px-4 py-1.5 rounded-sm text-sm font-special-elite mb-4 border border-route66-gold/30">
            <Camera className="h-4 w-4" />
            <span>Community</span>
          </div>
          <h2 className="font-route66 text-3xl sm:text-4xl text-route66-brown mb-3">
            Join the Photo Wall
          </h2>
          <p className="text-route66-brown/70 font-body max-w-2xl mx-auto">
            Share your Route 66 memories and see what other travelers have captured along the Mother Road.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
          {displayImages.map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-sm border-2 border-route66-border shadow-[4px_4px_0_0_rgba(107,76,56,0.15)]">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/photo-wall"
            className="inline-flex items-center gap-2 bg-route66-red hover:bg-route66-red-hover text-white font-special-elite px-6 py-3 rounded-sm border-2 border-route66-red shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
          >
            View the Photo Wall
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PhotoWallTeaser;