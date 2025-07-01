
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NavigationBar from '@/components/NavigationBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TripDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  const handleBackToHome = () => navigate('/');
  const handlePlanNewTrip = () => navigate('/trip-calculator');

  return (
    <>
      <Helmet>
        <title>Trip Details - RAMBLE 66</title>
        <meta name="description" content="Route 66 trip details - Plan your perfect Route 66 adventure" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section">
        <NavigationBar language={language} setLanguage={setLanguage} />
        
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-route66-background rounded-xl shadow-lg border border-route66-border p-8">
                <h2 className="text-3xl font-bold text-route66-text-primary mb-4">Trip Details</h2>
                <p className="text-route66-text-secondary mb-6">
                  Welcome to the trip details page. Use the trip calculator to create and share your Route 66 adventures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handlePlanNewTrip}
                    className="bg-route66-primary hover:bg-route66-rust text-white font-bold py-3 px-6 rounded-lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Plan a New Trip
                  </Button>
                  <Button
                    onClick={handleBackToHome}
                    variant="outline"
                    className="border-route66-vintage-brown text-route66-vintage-brown hover:bg-route66-vintage-brown hover:text-white font-bold py-3 px-6 rounded-lg"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripDetailsPage;
