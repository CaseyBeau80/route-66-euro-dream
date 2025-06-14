import React, { useState } from 'react';
import { TripPlan, DailySegment } from '../services/planning/TripPlanBuilder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Route, 
  Calendar, 
  MapPin, 
  Camera, 
  Share2, 
  Download,
  Cloud,
  Clock,
  DollarSign,
  Utensils
} from 'lucide-react';
import { format } from 'date-fns';
import WeatherTabContent from './WeatherTabContent';
import AttractionsTabContent from './AttractionsTabContent';
import RestaurantsTabContent from './RestaurantsTabContent';
import CostTabContent from './CostTabContent';
import ShareTripButton from './ShareTripButton';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';

interface TripResultsTabsProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  onShareTrip?: () => void;
  isGeneratingShareUrl?: boolean;
}

type TabType = 'overview' | 'weather' | 'attractions' | 'restaurants' | 'costs';

const TripResultsTabs: React.FC<TripResultsTabsProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  onShareTrip,
  isGeneratingShareUrl = false
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Check if we have API key for weather
  const hasWeatherApiKey = React.useMemo(() => {
    return WeatherApiKeyManager.hasApiKey();
  }, []);

  console.log('📊 TripResultsTabs render:', {
    activeTab,
    tripPlan: !!tripPlan,
    tripStartDate: tripStartDate?.toISOString(),
    hasWeatherApiKey,
    segmentCount: tripPlan?.segments?.length
  });

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Route },
    { id: 'weather' as TabType, label: 'Weather', icon: Cloud },
    { id: 'attractions' as TabType, label: 'Attractions', icon: Camera },
    { id: 'restaurants' as TabType, label: 'Restaurants', icon: Utensils },
    { id: 'costs' as TabType, label: 'Costs', icon: DollarSign }
  ];

  const getTotalAttractions = () => {
    return tripPlan.segments?.reduce((total, segment) => 
      total + (segment.attractions?.length || 0), 0) || 0;
  };

  const getTotalRestaurants = () => {
    return tripPlan.segments?.reduce((total, segment) => 
      total + (segment.restaurants?.length || 0), 0) || 0;
  };

  const formatDrivingTime = (distance: number) => {
    const hours = Math.round(distance / 55 * 10) / 10;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === id
                  ? 'border-route66-primary text-route66-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {label}
              {id === 'attractions' && (
                <Badge variant="secondary" className="text-xs">
                  {getTotalAttractions()}
                </Badge>
              )}
              {id === 'restaurants' && (
                <Badge variant="secondary" className="text-xs">
                  {getTotalRestaurants()}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Trip Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-route66-text-primary">
                    {tripPlan.segments?.length || 0}
                  </div>
                  <div className="text-sm text-route66-text-secondary">Days</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Route className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-route66-text-primary">
                    {Math.round(tripPlan.totalDistance || 0)}
                  </div>
                  <div className="text-sm text-route66-text-secondary">Miles</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-route66-text-primary">
                    {formatDrivingTime(tripPlan.totalDistance || 0)}
                  </div>
                  <div className="text-sm text-route66-text-secondary">Drive Time</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-route66-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-route66-text-primary">
                    {getTotalAttractions()}
                  </div>
                  <div className="text-sm text-route66-text-secondary">Attractions</div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Breakdown */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-route66-text-primary">Daily Breakdown</h4>
              
              {tripPlan.segments?.map((segment, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-medium">
                          Day {segment.day}
                        </Badge>
                        <div>
                          <h5 className="font-semibold text-route66-text-primary">
                            {segment.startCity} → {segment.endCity}
                          </h5>
                          {tripStartDate && (
                            <p className="text-sm text-route66-text-secondary">
                              {format(
                                new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000),
                                'EEEE, MMMM d, yyyy'
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-route66-text-primary">
                          {Math.round(segment.distance)} miles
                        </div>
                        <div className="text-xs text-route66-text-secondary">
                          {formatDrivingTime(segment.distance)}
                        </div>
                      </div>
                    </div>

                    {segment.attractions && segment.attractions.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-sm font-medium text-route66-text-primary mb-2">
                          Recommended Stops ({segment.attractions.length}):
                        </h6>
                        <div className="flex flex-wrap gap-1">
                          {segment.attractions.slice(0, 3).map((attraction, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {attraction.name}
                            </Badge>
                          ))}
                          {segment.attractions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{segment.attractions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Share Section */}
            <div className="flex justify-center pt-4">
              <ShareTripButton
                onShare={onShareTrip}
                shareUrl={shareUrl}
                isGenerating={isGeneratingShareUrl}
              />
            </div>
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            {/* Weather API Key Check */}
            {!hasWeatherApiKey && (
              <div className="mb-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Cloud className="h-12 w-12 text-blue-500 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          🌤️ Enable Live Weather Forecasts
                        </h3>
                        <p className="text-blue-700 mb-4">
                          Get real-time weather forecasts for each day of your Route 66 journey
                        </p>
                      </div>
                      <div className="max-w-md mx-auto">
                        <SimpleWeatherApiKeyInput 
                          onApiKeySet={() => {
                            console.log('🔑 Weather API key set from main tab');
                            window.location.reload();
                          }}
                          cityName="your Route 66 journey"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <WeatherTabContent
              segments={tripPlan.segments || []}
              tripStartDate={tripStartDate}
              tripId={tripPlan.id}
              isVisible={true}
            />
          </div>
        )}

        {/* Other tabs */}
        {activeTab === 'attractions' && (
          <AttractionsTabContent
            segments={tripPlan.segments || []}
            isVisible={true}
          />
        )}

        {activeTab === 'restaurants' && (
          <RestaurantsTabContent
            segments={tripPlan.segments || []}
            isVisible={true}
          />
        )}

        {activeTab === 'costs' && (
          <CostTabContent
            tripPlan={tripPlan}
            isVisible={true}
          />
        )}
      </div>
    </div>
  );
};

export default TripResultsTabs;
