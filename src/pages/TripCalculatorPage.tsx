
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NavigationBar from '@/components/NavigationBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, MapPin, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TripCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  const handleBackToHome = () => navigate('/');
  const handlePhotoChallenge = () => navigate('/test-upload');

  return (
    <>
      <Helmet>
        <title>Route 66 Trip Calculator - RAMBLE 66</title>
        <meta name="description" content="Plan your perfect Route 66 adventure with our comprehensive trip calculator" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-route66-text-primary">Route 66 Trip Calculator</h1>
                <p className="text-lg text-route66-text-secondary">
                  Plan your perfect journey along America's Main Street
                </p>
              </div>

              {/* Main Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trip Planning Card */}
                <Card className="bg-route66-background border-route66-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-route66-text-primary">
                      <MapPin className="w-5 h-5" />
                      Trip Planning
                    </CardTitle>
                    <CardDescription>
                      Calculate distances, plan stops, and create your perfect Route 66 itinerary
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-route66-text-secondary">✓ Distance calculations</p>
                      <p className="text-sm text-route66-text-secondary">✓ Stop recommendations</p>
                      <p className="text-sm text-route66-text-secondary">✓ Time estimates</p>
                      <p className="text-sm text-route66-text-secondary">✓ Cost planning</p>
                    </div>
                    <Button 
                      className="w-full bg-route66-primary hover:bg-route66-rust text-white"
                      onClick={() => {
                        // This would normally navigate to the actual trip calculator
                        // For now, we'll show a coming soon message
                        alert('Trip Calculator coming soon! Visit our Photo Challenge in the meantime.');
                      }}
                    >
                      Start Planning
                    </Button>
                  </CardContent>
                </Card>

                {/* Photo Challenge Card */}
                <Card className="bg-route66-background border-route66-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-route66-text-primary">
                      <Camera className="w-5 h-5" />
                      Photo Challenge
                    </CardTitle>
                    <CardDescription>
                      Share your Route 66 photos and become a Trailblazer at iconic locations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-route66-text-secondary">📸 Upload travel photos</p>
                      <p className="text-sm text-route66-text-secondary">🏆 Earn Trailblazer status</p>
                      <p className="text-sm text-route66-text-secondary">🌟 Join the leaderboard</p>
                      <p className="text-sm text-route66-text-secondary">🔒 Safe content moderation</p>
                    </div>
                    <Button 
                      className="w-full bg-route66-vintage-brown hover:bg-route66-rust text-white"
                      onClick={handlePhotoChallenge}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Start Photo Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Coming Soon Features */}
              <Card className="bg-gradient-to-r from-route66-background to-route66-background-alt border-route66-border">
                <CardHeader>
                  <CardTitle className="text-route66-text-primary">Coming Soon</CardTitle>
                  <CardDescription>
                    We're working on exciting new features to make your Route 66 experience even better
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-route66-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MapPin className="w-6 h-6 text-route66-primary" />
                      </div>
                      <h3 className="font-semibold text-route66-text-primary">Interactive Maps</h3>
                      <p className="text-sm text-route66-text-secondary">Detailed route mapping with real-time navigation</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-route66-vintage-brown/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Camera className="w-6 h-6 text-route66-vintage-brown" />
                      </div>
                      <h3 className="font-semibold text-route66-text-primary">AR Photo Mode</h3>
                      <p className="text-sm text-route66-text-secondary">Augmented reality photo experiences at landmarks</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-route66-rust/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-6 h-6 text-route66-rust" />
                      </div>
                      <h3 className="font-semibold text-route66-text-primary">Community Hub</h3>
                      <p className="text-sm text-route66-text-secondary">Connect with fellow Route 66 travelers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-center">
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripCalculatorPage;
