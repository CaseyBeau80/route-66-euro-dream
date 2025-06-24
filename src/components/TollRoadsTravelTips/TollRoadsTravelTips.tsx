
import React from 'react';
import CompactLayoutSection from '../CompactLayoutSection/CompactLayoutSection';
import TollRoads from '../TollRoads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Fuel, Coffee, Bed, Camera, Phone } from 'lucide-react';

interface TollRoadsTravelTipsProps {
  language: string;
}

const TollRoadsTravelTips: React.FC<TollRoadsTravelTipsProps> = ({ language }) => {
  const travelTips = [
    {
      icon: Fuel,
      title: "Fuel Planning",
      description: "Gas stations can be sparse in desert areas. Fill up when you can!",
      tips: ["Fill up in major cities", "Carry extra water", "Check fuel gauge regularly"]
    },
    {
      icon: Coffee,
      title: "Dining Tips",
      description: "Experience authentic Route 66 diners and local cuisines.",
      tips: ["Try local specialties", "Visit historic diners", "Ask locals for recommendations"]
    },
    {
      icon: Bed,
      title: "Accommodation",
      description: "Book ahead during peak season, especially in popular heritage cities.",
      tips: ["Book 2-3 days ahead", "Consider historic motels", "Check cancellation policies"]
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Capture the iconic sights and hidden gems along the Mother Road.",
      tips: ["Golden hour lighting", "Respect private property", "Backup your photos"]
    },
    {
      icon: Phone,
      title: "Connectivity",
      description: "Cell service can be limited in remote areas of Route 66.",
      tips: ["Download offline maps", "Inform others of your route", "Carry a car charger"]
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Allow extra time for unexpected discoveries and photo stops.",
      tips: ["Plan buffer time", "Don't rush experiences", "Embrace spontaneous stops"]
    }
  ];

  return (
    <CompactLayoutSection
      title="Toll Roads & Travel Tips"
      subtitle="Essential information for your Route 66 journey - from toll road costs to practical travel advice"
      sectionId="toll-roads-travel-tips"
      background="bg-route66-background-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Toll Roads Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-route66-border overflow-hidden">
            <TollRoads language={language} />
          </div>
        </div>

        {/* Travel Tips Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-route66-primary mb-4 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              Essential Travel Tips
            </h3>
            <p className="text-route66-text-secondary">
              Make the most of your Route 66 adventure with these expert recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {travelTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <tip.icon className="h-5 w-5 text-route66-primary" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                  <ul className="space-y-1">
                    {tip.tips.map((tipItem, tipIndex) => (
                      <li key={tipIndex} className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        {tipItem}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Emergency Contacts */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3 text-red-700">
                <Phone className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-600 font-medium">Emergency:</span>
                  <span className="text-red-700 font-bold">911</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600 font-medium">Roadside Assistance:</span>
                  <span className="text-red-700 font-bold">*AAA (*222)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600 font-medium">Weather Info:</span>
                  <span className="text-red-700 font-bold">511</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CompactLayoutSection>
  );
};

export default TollRoadsTravelTips;
