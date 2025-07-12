import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Attraction {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  city_name: string;
  state: string;
  website: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  admission_fee: string | null;
  hours_of_operation: string | null;
  year_opened: number | null;
  founded_year: number | null;
  tags: string[] | null;
  featured: boolean | null;
}

const AttractionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttraction = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('attractions')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError('Attraction not found');
          return;
        }

        setAttraction(data);
      } catch (err) {
        console.error('Error fetching attraction:', err);
        setError('Failed to load attraction');
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading attraction details...</p>
        </div>
      </div>
    );
  }

  if (error || !attraction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Attraction Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested attraction could not be found.'}</p>
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
          <h1 className="text-3xl font-bold">{attraction.title || attraction.name}</h1>
          <p className="text-primary-foreground/80 flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4" />
            {attraction.city_name}, {attraction.state}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {attraction.image_url && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={attraction.image_url}
                  alt={attraction.title || attraction.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {attraction.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {attraction.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {attraction.tags && attraction.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {attraction.tags.map((tag, index) => (
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
                {attraction.category && (
                  <div>
                    <strong>Category:</strong> {attraction.category}
                  </div>
                )}

                {attraction.admission_fee && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <strong>Admission:</strong> {attraction.admission_fee}
                  </div>
                )}

                {attraction.hours_of_operation && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <strong>Hours:</strong> {attraction.hours_of_operation}
                  </div>
                )}

                {(attraction.year_opened || attraction.founded_year) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <strong>Opened:</strong> {attraction.year_opened || attraction.founded_year}
                  </div>
                )}

                {attraction.website && (
                  <div className="pt-4">
                    <a
                      href={attraction.website}
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
                  {attraction.city_name}, {attraction.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {attraction.latitude.toFixed(6)}, {attraction.longitude.toFixed(6)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetailPage;