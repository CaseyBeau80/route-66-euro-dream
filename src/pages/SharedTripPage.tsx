import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TripService, SavedTrip } from '@/components/TripCalculator/services/TripService';
import SharedTripContentRenderer from '@/components/TripCalculator/components/share/SharedTripContentRenderer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Share2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SocialMetaTags from '@/components/shared/SocialMetaTags';

const SharedTripPage: React.FC = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [savedTrip, setSavedTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedTrip = async () => {
      if (!shareCode) {
        setError('Invalid share code');
        setLoading(false);
        return;
      }

      try {
        console.log('📥 Loading shared trip with code:', shareCode);
        
        // Load trip and increment view count
        const trip = await TripService.loadTripByShareCode(shareCode);
        await TripService.incrementViewCount(shareCode);
        
        setSavedTrip(trip);
        setError(null);
        
        console.log('✅ Shared trip loaded successfully:', trip);
      } catch (err) {
        console.error('❌ Error loading shared trip:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    loadSharedTrip();
  }, [shareCode]);

  const handleShareTrip = async () => {
    if (!shareCode) return;
    
    try {
      const shareUrl = TripService.getShareUrl(shareCode);
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link Copied!",
        description: "Trip link has been copied to your clipboard.",
        variant: "default"
      });
    } catch (err) {
      console.error('Error copying link:', err);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Trip...</h2>
          <p className="text-gray-600">Please wait while we load your shared Route 66 trip.</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !savedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The shared trip could not be found. It may have been removed or the link is invalid.'}
          </p>
          <Link to="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <SocialMetaTags 
        path={`/trip/${shareCode}`}
        title={`${savedTrip.title} – Route 66 Trip | Ramble 66`}
        description={savedTrip.description || `Explore this shared Route 66 trip from ${savedTrip.trip_data.startCity} to ${savedTrip.trip_data.endCity}.`}
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Views: {savedTrip.view_count.toLocaleString()}
              </div>
              <Button 
                onClick={handleShareTrip}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Header Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {savedTrip.title}
            </h1>
            {savedTrip.description && (
              <p className="text-blue-100 text-lg mb-4">
                {savedTrip.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{savedTrip.trip_data.startCity} to {savedTrip.trip_data.endCity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{savedTrip.trip_data.segments.length} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SharedTripContentRenderer
          tripPlan={savedTrip.trip_data}
          isSharedView={true}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to plan your own Route 66 adventure?
          </p>
          <Link to="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Create Your Trip
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedTripPage;