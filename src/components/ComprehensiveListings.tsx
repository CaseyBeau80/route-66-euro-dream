
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Star, ExternalLink } from 'lucide-react';

interface ListingItem {
  id: string;
  name: string;
  title?: string;
  description: string | null;
  city_name: string;
  state: string;
  image_url?: string | null;
  website?: string | null;
  latitude: number;
  longitude: number;
  category: string;
  tags: string[];
  population?: number;
  founded_year?: number;
  year_opened?: number;
  featured?: boolean;
}

interface CategoryData {
  title: string;
  items: ListingItem[];
  loading: boolean;
  color: string;
  icon: string;
}

const ComprehensiveListings = () => {
  const [categories, setCategories] = useState<Record<string, CategoryData>>({
    destination_cities: {
      title: 'Destination Cities',
      items: [],
      loading: true,
      color: 'bg-blue-500',
      icon: '🏙️'
    },
    attractions: {
      title: 'Historic Attractions',
      items: [],
      loading: true,
      color: 'bg-green-500',
      icon: '🏛️'
    },
    drive_ins: {
      title: 'Drive-In Theaters',
      items: [],
      loading: true,
      color: 'bg-purple-500',
      icon: '🎬'
    },
    hidden_gems: {
      title: 'Hidden Gems',
      items: [],
      loading: true,
      color: 'bg-orange-500',
      icon: '💎'
    },
    route66_waypoints: {
      title: 'Route 66 Waypoints',
      items: [],
      loading: true,
      color: 'bg-red-500',
      icon: '🛣️'
    }
  });

  const getPlaceholderImage = (name: string, description: string | null, category: string): string => {
    const nameAndDesc = `${name} ${description || ''}`.toLowerCase();
    
    // Category-specific images
    if (category === 'destination_cities') {
      if (nameAndDesc.includes('chicago')) return "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=600&q=80";
      if (nameAndDesc.includes('santa monica')) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80";
      if (nameAndDesc.includes('flagstaff')) return "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80";
      return "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=600&q=80";
    }
    
    if (category === 'drive_ins') {
      return "https://images.unsplash.com/photo-1489599856444-7f58f2ab7ec9?auto=format&fit=crop&w=600&q=80";
    }
    
    if (category === 'attractions') {
      if (nameAndDesc.includes('museum')) return "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80";
      if (nameAndDesc.includes('ranch')) return "https://images.unsplash.com/photo-1544966503-7e10ae230fb1?auto=format&fit=crop&w=600&q=80";
      return "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=600&q=80";
    }
    
    if (category === 'route66_waypoints') {
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80";
    }
    
    // Hidden gems - contextual
    if (nameAndDesc.includes('motel') || nameAndDesc.includes('motor') || nameAndDesc.includes('inn')) {
      return "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=600&q=80";
    }
    if (nameAndDesc.includes('diner') || nameAndDesc.includes('cafe') || nameAndDesc.includes('restaurant')) {
      return "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=600&q=80";
    }
    if (nameAndDesc.includes('gas') || nameAndDesc.includes('station')) {
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80";
    }
    
    // Default Route 66 road image
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80";
  };

  const generateTags = (item: any, category: string): string[] => {
    const tags: string[] = [];
    
    if (item.featured) tags.push('Featured');
    if (item.state) tags.push(item.state);
    
    switch (category) {
      case 'destination_cities':
        if (item.population && item.population > 100000) tags.push('Major City');
        if (item.founded_year && item.founded_year < 1900) tags.push('Historic');
        break;
      case 'attractions':
        if (item.category) tags.push(item.category);
        if (item.admission_fee === 'Free') tags.push('Free Entry');
        break;
      case 'drive_ins':
        if (item.status === 'active') tags.push('Operating');
        if (item.year_opened && item.year_opened < 1960) tags.push('Classic');
        break;
      case 'route66_waypoints':
        if (item.is_major_stop) tags.push('Major Stop');
        if (item.highway_designation) tags.push(item.highway_designation);
        break;
      default:
        tags.push('Hidden Gem');
    }
    
    return tags;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch destination cities
        const { data: cities, error: citiesError } = await supabase
          .from('destination_cities')
          .select('*')
          .limit(6);

        if (!citiesError && cities) {
          setCategories(prev => ({
            ...prev,
            destination_cities: {
              ...prev.destination_cities,
              items: cities.map(city => ({
                id: city.id,
                name: city.name,
                description: city.description,
                city_name: city.name,
                state: city.state,
                image_url: city.image_url,
                website: city.website,
                latitude: city.latitude,
                longitude: city.longitude,
                category: 'destination_cities',
                tags: generateTags(city, 'destination_cities'),
                population: city.population,
                founded_year: city.founded_year,
                featured: city.featured
              })),
              loading: false
            }
          }));
        }

        // Fetch attractions
        const { data: attractions, error: attractionsError } = await supabase
          .from('attractions')
          .select('*')
          .limit(6);

        if (!attractionsError && attractions) {
          setCategories(prev => ({
            ...prev,
            attractions: {
              ...prev.attractions,
              items: attractions.map(attraction => ({
                id: attraction.id,
                name: attraction.name,
                description: attraction.description,
                city_name: attraction.city_name,
                state: attraction.state,
                image_url: attraction.image_url,
                website: attraction.website,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                category: 'attractions',
                tags: generateTags(attraction, 'attractions'),
                featured: attraction.featured
              })),
              loading: false
            }
          }));
        }

        // Fetch drive-ins
        const { data: driveIns, error: driveInsError } = await supabase
          .from('drive_ins')
          .select('*')
          .limit(6);

        if (!driveInsError && driveIns) {
          setCategories(prev => ({
            ...prev,
            drive_ins: {
              ...prev.drive_ins,
              items: driveIns.map(driveIn => ({
                id: driveIn.id,
                name: driveIn.name,
                description: driveIn.description,
                city_name: driveIn.city_name,
                state: driveIn.state,
                image_url: driveIn.image_url,
                website: driveIn.website,
                latitude: driveIn.latitude,
                longitude: driveIn.longitude,
                category: 'drive_ins',
                tags: generateTags(driveIn, 'drive_ins'),
                year_opened: driveIn.year_opened,
                featured: driveIn.featured
              })),
              loading: false
            }
          }));
        }

        // Fetch hidden gems
        const { data: hiddenGems, error: hiddenGemsError } = await supabase
          .from('hidden_gems')
          .select('*')
          .limit(6);

        if (!hiddenGemsError && hiddenGems) {
          setCategories(prev => ({
            ...prev,
            hidden_gems: {
              ...prev.hidden_gems,
              items: hiddenGems.map(gem => ({
                id: gem.id,
                name: gem.title,
                title: gem.title,
                description: gem.description,
                city_name: gem.city_name,
                state: 'Various', // Hidden gems don't have state in the schema
                image_url: null,
                website: gem.website,
                latitude: gem.latitude,
                longitude: gem.longitude,
                category: 'hidden_gems',
                tags: generateTags(gem, 'hidden_gems')
              })),
              loading: false
            }
          }));
        }

        // Fetch route66 waypoints
        const { data: waypoints, error: waypointsError } = await supabase
          .from('route66_waypoints')
          .select('*')
          .order('sequence_order')
          .limit(6);

        if (!waypointsError && waypoints) {
          setCategories(prev => ({
            ...prev,
            route66_waypoints: {
              ...prev.route66_waypoints,
              items: waypoints.map(waypoint => ({
                id: waypoint.id,
                name: waypoint.name,
                description: waypoint.description,
                city_name: waypoint.name,
                state: waypoint.state,
                image_url: null,
                website: null,
                latitude: waypoint.latitude,
                longitude: waypoint.longitude,
                category: 'route66_waypoints',
                tags: generateTags(waypoint, 'route66_waypoints')
              })),
              loading: false
            }
          }));
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Set all categories to not loading on error
        setCategories(prev => 
          Object.keys(prev).reduce((acc, key) => ({
            ...acc,
            [key]: { ...prev[key], loading: false }
          }), {})
        );
      }
    };

    fetchAllData();
  }, []);

  const renderCategorySection = (categoryKey: string, categoryData: CategoryData) => (
    <div key={categoryKey} className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-12 h-12 ${categoryData.color} rounded-lg flex items-center justify-center text-white text-2xl shadow-lg`}>
          {categoryData.icon}
        </div>
        <div>
          <h2 className="text-3xl font-route66 text-route66-red">{categoryData.title}</h2>
          <p className="text-route66-gray">Discover amazing places along Route 66</p>
        </div>
      </div>

      {categoryData.loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData.items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-route66-gray/10">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image_url || getPlaceholderImage(item.name, item.description, item.category)} 
                  alt={item.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {item.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-route66-vintage-yellow text-black flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg text-route66-gray mb-1">{item.name}</h3>
                <p className="text-sm text-route66-gray/70 flex items-center mb-3">
                  <MapPin size={14} className="mr-1 flex-shrink-0" /> 
                  {item.city_name}{item.state && `, ${item.state}`}
                </p>
                
                {item.description && (
                  <p className="text-sm text-route66-gray mb-4 line-clamp-3">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-route66-cream border-route66-gray/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Additional info based on category */}
                <div className="flex items-center justify-between text-xs text-route66-gray/60 mb-3">
                  {item.population && (
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      {item.population.toLocaleString()}
                    </div>
                  )}
                  {(item.founded_year || item.year_opened) && (
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {item.founded_year || item.year_opened}
                    </div>
                  )}
                </div>

                {item.website && (
                  <a 
                    href={item.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-route66-blue hover:text-route66-blue/80 text-sm font-medium"
                  >
                    <ExternalLink size={14} />
                    Visit Website
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!categoryData.loading && categoryData.items.length === 0 && (
        <div className="text-center py-12 text-route66-gray/60">
          <p className="text-lg">No {categoryData.title.toLowerCase()} found at the moment.</p>
          <p className="text-sm">Check back soon for new additions!</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-route66 text-route66-red mb-4">Discover Route 66</h1>
          <p className="text-xl text-route66-gray max-w-3xl mx-auto">
            Explore the complete collection of destinations, attractions, and hidden gems along America's most famous highway
          </p>
        </div>

        {Object.entries(categories).map(([key, data]) => renderCategorySection(key, data))}
      </div>
    </section>
  );
};

export default ComprehensiveListings;
