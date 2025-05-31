
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeatherWidget from '@/components/Route66Map/components/WeatherWidget';
import { useSupabaseRoute66 } from '@/components/Route66Map/hooks/useSupabaseRoute66';

const CityPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { waypoints, isLoading } = useSupabaseRoute66();

  // Find the city from waypoints based on slug
  const city = waypoints.find(waypoint => {
    const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
    const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return slug === citySlug;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800 font-semibold">Loading Route 66 city...</p>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-800 mb-4">City Not Found</h1>
          <p className="text-red-600 mb-6">The Route 66 city you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Route 66 Map
          </Button>
        </div>
      </div>
    );
  }

  const cityName = city.name.split(',')[0].split(' - ')[0].trim();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-amber-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Route 66 Map
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-black text-amber-800">66</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">{cityName}</h1>
              <div className="flex items-center gap-2 text-amber-100">
                <MapPin className="w-5 h-5" />
                <span className="text-xl">{city.state}</span>
                {city.highway_designation && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-bold">
                    {city.highway_designation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {city.description && (
            <p className="text-amber-100 max-w-2xl text-lg leading-relaxed">
              {city.description}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Content Tiles */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="weather" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              Weather
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="facts" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Fun Facts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  Current Weather in {cityName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherWidget 
                  lat={city.latitude} 
                  lng={city.longitude} 
                  cityName={cityName}
                  compact={false}
                  collapsible={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Upcoming Events in {cityName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <Calendar className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Events Coming Soon</h3>
                  <p className="text-amber-700">
                    Event listings for {cityName} are being curated. Check back soon for Route 66 festivals, 
                    car shows, and local celebrations!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facts">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Fun Facts about {cityName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                        66
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-800 mb-1">Route 66 Heritage</h4>
                        <p className="text-amber-700">
                          {cityName} is stop #{city.sequence_order} along the historic Route 66, 
                          America's most famous highway stretching from Chicago to Santa Monica.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-bold text-blue-800 mb-1">Geographic Location</h4>
                        <p className="text-blue-700">
                          Located at coordinates {city.latitude.toFixed(4)}°N, {Math.abs(city.longitude).toFixed(4)}°W 
                          in the heart of {city.state}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-bold text-green-800 mb-1">Historical Significance</h4>
                        <p className="text-green-700">
                          As a {city.is_major_stop ? 'major destination' : 'historic waypoint'} on Route 66, 
                          {cityName} played an important role in America's westward expansion and 
                          the golden age of automobile travel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CityPage;
