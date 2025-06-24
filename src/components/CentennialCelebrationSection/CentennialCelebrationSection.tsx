
import React from 'react';
import CentennialSection from '../CentennialSection';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Star, Award, Clock } from 'lucide-react';

const CentennialCelebrationSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-route66-primary text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Calendar className="h-5 w-5" />
            CENTENNIAL CELEBRATION 2026
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-primary mb-6">
            100 Years of Route 66
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Join the historic celebration of America's Mother Road centennial. 
            Discover special events, commemorative activities, and once-in-a-lifetime experiences.
          </p>
        </div>

        {/* Centennial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-lg border-2 border-route66-accent-red/30 bg-route66-accent-red/10">
            <CardContent className="p-6 text-center">
              <Calendar className="h-10 w-10 text-route66-accent-red mx-auto mb-3" />
              <h4 className="font-bold text-route66-primary mb-2">Historic Milestone</h4>
              <p className="text-sm text-route66-text-secondary">Celebrating 100 years of American road culture</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 border-route66-primary/30 bg-route66-primary/10">
            <CardContent className="p-6 text-center">
              <Star className="h-10 w-10 text-route66-primary mx-auto mb-3" />
              <h4 className="font-bold text-route66-primary mb-2">Special Events</h4>
              <p className="text-sm text-route66-text-secondary">Exclusive centennial celebrations nationwide</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 border-route66-accent-gold/30 bg-route66-accent-gold/10">
            <CardContent className="p-6 text-center">
              <Award className="h-10 w-10 text-route66-accent-gold mx-auto mb-3" />
              <h4 className="font-bold text-route66-primary mb-2">Commemorative</h4>
              <p className="text-sm text-route66-text-secondary">Limited edition collectibles and memorabilia</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-2 border-route66-accent-success/30 bg-route66-accent-success/10">
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 text-route66-accent-success mx-auto mb-3" />
              <h4 className="font-bold text-route66-primary mb-2">Legacy</h4>
              <p className="text-sm text-route66-text-secondary">Preserving Route 66 for future generations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Centennial Content */}
        <div className="bg-white rounded-xl shadow-2xl border-2 border-route66-border overflow-hidden mb-12">
          <div className="bg-route66-primary text-white h-2"></div>
          <div className="p-8">
            <CentennialSection />
          </div>
        </div>

        {/* Centennial Call to Action */}
        <div className="text-center">
          <Card className="shadow-lg border-2 border-route66-primary bg-route66-primary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-route66-primary mb-4">
                Be Part of Route 66 History
              </h3>
              <p className="text-lg text-route66-text-secondary mb-6">
                The centennial celebration is a once-in-a-lifetime opportunity to experience 
                Route 66's heritage and contribute to its lasting legacy.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm font-semibold">
                <div className="text-center">
                  <div className="text-2xl font-bold text-route66-accent-red mb-1">1926</div>
                  <div className="text-route66-text-secondary">Route 66 Established</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-route66-primary mb-1">2026</div>
                  <div className="text-route66-text-secondary">Centennial Celebration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-route66-accent-success mb-1">100</div>
                  <div className="text-route66-text-secondary">Years of Adventure</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CentennialCelebrationSection;
