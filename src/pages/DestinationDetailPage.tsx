import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Users, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DestinationCity {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  state: string;
  website: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  population: number | null;
  elevation_ft: number | null;
  founded_year: number | null;
  featured: boolean | null;
  status: string | null;
}

const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<DestinationCity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) return;

      try {
        // Try to fetch by ID first, then by slug-like name if not found
        let { data, error } = await supabase
          .from('destination_cities')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;

        // If not found by ID, try to find by name (treating id as a slug)
        if (!data) {
          const searchName = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const { data: nameData, error: nameError } = await supabase
            .from('destination_cities')
            .select('*')
            .ilike('name', `%${searchName}%`)
            .maybeSingle();

          if (nameError) throw nameError;
          data = nameData;
        }

        if (!data) {
          setError('Destination city not found');
          return;
        }

        setDestination(data);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError('Failed to load destination');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Destination Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested destination could not be found.'}</p>
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
          <h1 className="text-3xl font-bold">{destination.name}</h1>
          <p className="text-primary-foreground/80 flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4" />
            {destination.state}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {destination.image_url && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={destination.image_url}
                  alt={destination.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {destination.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About {destination.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {destination.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>City Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>State:</strong> {destination.state}
                </div>

                {destination.population && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <strong>Population:</strong> {destination.population.toLocaleString()}
                  </div>
                )}

                {destination.elevation_ft && (
                  <div className="flex items-center gap-2">
                    <Mountain className="h-4 w-4" />
                    <strong>Elevation:</strong> {destination.elevation_ft.toLocaleString()} ft
                  </div>
                )}

                {destination.founded_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <strong>Founded:</strong> {destination.founded_year}
                  </div>
                )}

                {destination.status && (
                  <div>
                    <strong>Status:</strong> {destination.status}
                  </div>
                )}

                {destination.website && (
                  <div className="pt-4">
                    <a
                      href={destination.website}
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
                  {destination.name}, {destination.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {destination.latitude.toFixed(6)}, {destination.longitude.toFixed(6)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;