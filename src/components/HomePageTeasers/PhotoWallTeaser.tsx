import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PictureOptimized } from '@/components/ui/PictureOptimized';

interface PhotoEntry {
  id: string;
  photo_url: string;
  caption: string | null;
  traveler_name: string | null;
}

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

  return (
    <section className="py-12 sm:py-16 bg-route66-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-route66-gold/20 text-route66-brown px-4 py-1.5 rounded-full text-sm font-medium mb-4">
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

        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
            {photos.map((photo) => (
              <div key={photo.id} className="aspect-square overflow-hidden rounded-sm border-2 border-route66-border shadow-[4px_4px_0_0_rgba(107,76,56,0.15)]">
                <PictureOptimized
                  src={photo.photo_url}
                  alt={photo.caption || 'Route 66 community photo'}
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/photo-wall"
            className="inline-flex items-center gap-2 bg-route66-brown hover:bg-route66-brown/90 text-white font-special-elite px-6 py-3 rounded-sm border-2 border-route66-brown shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
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
