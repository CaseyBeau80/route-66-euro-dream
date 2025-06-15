import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bug, Search, Database, MapPin } from 'lucide-react';
import { GeographicAttractionService } from '../services/attractions/GeographicAttractionService';
import { SupabaseDataService } from '../services/data/SupabaseDataService';
const DeveloperDebugTools: React.FC = () => {
  const [testCity, setTestCity] = useState('Springfield');
  const [testState, setTestState] = useState('MO');
  const [debugResults, setDebugResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [databaseStats, setDatabaseStats] = useState<any>(null);
  const runCityDebug = async () => {
    setIsLoading(true);
    try {
      const results = await GeographicAttractionService.debugCitySearch(testCity, testState);
      setDebugResults(results);
      console.log('🔍 City debug results:', results);
    } catch (error) {
      setDebugResults({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const analyzeDatabaseStats = async () => {
    setIsLoading(true);
    try {
      const allStops = await SupabaseDataService.fetchAllStops();
      const stats = {
        totalStops: allStops.length,
        destinationCities: allStops.filter(s => s.category === 'destination_city').length,
        attractions: allStops.filter(s => s.category === 'attraction').length,
        restaurants: allStops.filter(s => s.category === 'restaurant').length,
        lodging: allStops.filter(s => s.category === 'lodging').length,
        historicSites: allStops.filter(s => s.category === 'historic_site').length,
        stateBreakdown: allStops.reduce((acc, stop) => {
          acc[stop.state] = (acc[stop.state] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        destinationCitiesByState: allStops.filter(s => s.category === 'destination_city').reduce((acc, stop) => {
          if (!acc[stop.state]) acc[stop.state] = [];
          acc[stop.state].push(stop.city_name);
          return acc;
        }, {} as Record<string, string[]>),
        invalidData: allStops.filter(stop => !stop.latitude || !stop.longitude || stop.latitude === 0 || stop.longitude === 0).map(stop => ({
          id: stop.id,
          name: stop.name,
          city: stop.city_name,
          state: stop.state
        }))
      };
      setDatabaseStats(stats);
      console.log('📊 Database stats:', stats);
    } catch (error) {
      setDatabaseStats({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const testAttractionSearch = async () => {
    setIsLoading(true);
    try {
      const searchResult = await GeographicAttractionService.findAttractionsNearCity(testCity, testState, 50);
      setDebugResults({
        searchType: 'attraction_search',
        cityName: testCity,
        state: testState,
        status: searchResult.status,
        attractionsFound: searchResult.attractions.length,
        attractions: searchResult.attractions.map(a => ({
          name: a.name,
          distance: a.distanceFromCity.toFixed(1),
          type: a.attractionType,
          category: a.category
        }))
      });
    } catch (error) {
      setDebugResults({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  return <Card className="border-purple-200 bg-purple-50">
      
      
    </Card>;
};
export default DeveloperDebugTools;