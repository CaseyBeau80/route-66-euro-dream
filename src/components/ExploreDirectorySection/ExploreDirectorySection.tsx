
import React from 'react';
import UnifiedRoute66Carousel from '../UnifiedRoute66Carousel';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building, Utensils, Bed, Star, Camera } from 'lucide-react';

const ExploreDirectorySection: React.FC = () => {
  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-route66-accent-gold text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Building className="h-5 w-5" />
            EXPLORE DESTINATIONS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-primary mb-6">
            Route 66 Heritage Directory
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover authentic Route 66 destinations, from historic attractions and classic diners 
            to vintage motels and hidden gems along America's Mother Road.
          </p>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800 mb-1">Attractions</h4>
              <p className="text-xs text-gray-600">Historic Sites</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Utensils className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800 mb-1">Diners</h4>
              <p className="text-xs text-gray-600">Classic Eats</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Bed className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800 mb-1">Motels</h4>
              <p className="text-xs text-gray-600">Vintage Stays</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Camera className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800 mb-1">Drive-Ins</h4>
              <p className="text-xs text-gray-600">Movie Magic</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800 mb-1">Hidden Gems</h4>
              <p className="text-xs text-gray-600">Secret Spots</p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Building className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800 mb-1">Cities</h4>
              <p className="text-xs text-gray-600">Heritage Towns</p>
            </CardContent>
          </Card>
        </div>

        {/* Route 66 Directory Carousel */}
        <div className="bg-white rounded-xl shadow-2xl border-2 border-route66-border overflow-hidden">
          <div className="bg-gradient-to-r from-route66-primary to-route66-primary-light text-white p-6">
            <h3 className="text-2xl font-bold mb-2">Browse Route 66 Destinations</h3>
            <p className="text-blue-100">
              Explore curated collections of authentic Route 66 experiences, organized by category and location
            </p>
          </div>
          <div className="p-6">
            <UnifiedRoute66Carousel />
          </div>
        </div>

        {/* Directory Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-route66-border">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Curated Experiences</h4>
            <p className="text-gray-600">Hand-picked destinations that capture the true spirit of Route 66</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-route66-border">
            <MapPin className="h-12 w-12 text-route66-primary mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Heritage Focus</h4>
            <p className="text-gray-600">Authentic locations with rich history and cultural significance</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md border border-route66-border">
            <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">Photo Opportunities</h4>
            <p className="text-gray-600">Perfect spots for capturing memorable Route 66 moments</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreDirectorySection;
