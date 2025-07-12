import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HiddenGem {
  id: string;
  title: string;
  name: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  city_name: string;
  state: string | null;
  website: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  year_opened: number | null;
  founded_year: number | null;
  tags: string[] | null;
  featured: boolean | null;
  slug: string | null;
}

const HiddenGemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [hiddenGem, setHiddenGem] = useState<HiddenGem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHiddenGem = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('hidden_gems')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError('Hidden gem not found');
          return;
        }

        setHiddenGem(data);
      } catch (err) {
        console.error('Error fetching hidden gem:', err);
        setError('Failed to load hidden gem');
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenGem();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading hidden gem details...</p>
        </div>
      </div>
    );
  }

  if (error || !hiddenGem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hidden Gem Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested hidden gem could not be found.'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{hiddenGem.title}</h1>
          {hiddenGem.name && hiddenGem.name !== hiddenGem.title && (
            <p className="text-xl text-primary-foreground/90 mt-1">{hiddenGem.name}</p>
          )}
          <p className="text-primary-foreground/80 flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4" />
            {hiddenGem.city_name}{hiddenGem.state && `, ${hiddenGem.state}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {hiddenGem.image_url && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={hiddenGem.image_url}
                  alt={hiddenGem.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {hiddenGem.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {hiddenGem.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {hiddenGem.tags && hiddenGem.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hiddenGem.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hiddenGem.category && (
                  <div>
                    <strong>Category:</strong> {hiddenGem.category}
                  </div>
                )}

                {(hiddenGem.year_opened || hiddenGem.founded_year) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <strong>Opened:</strong> {hiddenGem.year_opened || hiddenGem.founded_year}
                  </div>
                )}

                {hiddenGem.website && (
                  <div className="pt-4">
                    <a
                      href={hiddenGem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {hiddenGem.city_name}{hiddenGem.state && `, ${hiddenGem.state}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {hiddenGem.latitude.toFixed(6)}, {hiddenGem.longitude.toFixed(6)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenGemDetailPage;