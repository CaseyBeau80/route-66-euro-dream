
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TollRoads from '../TollRoads';
import { DollarSign, MapPin, Clock, Fuel, Phone, AlertTriangle } from 'lucide-react';

interface TollRoadTipsSectionProps {
  language: string;
}

const TollRoadTipsSection: React.FC<TollRoadTipsSectionProps> = ({ language }) => {
  const travelTips = [
    {
      icon: Fuel,
      title: "Fuel Planning",
      description: "Gas stations can be sparse in desert areas",
      tip: "Fill up in major cities and carry extra water"
    },
    {
      icon: Clock,
      title: "Time Management", 
      description: "Allow extra time for photo stops",
      tip: "Plan buffer time for unexpected discoveries"
    },
    {
      icon: Phone,
      title: "Connectivity",
      description: "Cell service limited in remote areas",
      tip: "Download offline maps and inform others of route"
    },
    {
      icon: MapPin,
      title: "Navigation",
      description: "Original route vs modern highways",
      tip: "Use heritage route markers for authentic experience"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-route66-accent-red text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <DollarSign className="h-5 w-5" />
            TRAVEL ESSENTIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-primary mb-6">
            Toll Roads & Travel Tips
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Essential information for your Route 66 journey including toll road costs, 
            travel tips, and practical advice for a smooth adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Toll Roads Information */}
          <div>
            <Card className="shadow-2xl border-2 border-route66-border h-fit">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-route66-border">
                <CardTitle className="flex items-center gap-3 text-route66-primary">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  Toll Road Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TollRoads language={language} />
              </CardContent>
            </Card>
          </div>

          {/* Travel Tips */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-route66-border">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-route66-border">
                <CardTitle className="flex items-center gap-3 text-route66-primary">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  Essential Travel Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {travelTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <tip.icon className="h-6 w-6 text-route66-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{tip.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                        <p className="text-xs text-green-700 font-medium">💡 {tip.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-lg border-2 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-700">
                  <AlertTriangle className="h-6 w-6" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                    <span className="font-medium text-red-700">Emergency Services:</span>
                    <span className="font-bold text-red-800 text-lg">911</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                    <span className="font-medium text-red-700">Roadside Assistance:</span>
                    <span className="font-bold text-red-800 text-lg">*AAA (*222)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                    <span className="font-medium text-red-700">Weather Information:</span>
                    <span className="font-bold text-red-800 text-lg">511</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Cost Estimates */}
            <Card className="shadow-lg border-2 border-green-300 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <DollarSign className="h-6 w-6" />
                  Quick Budget Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">$50-80</div>
                    <div className="text-sm text-gray-600">Daily Food</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">$70-150</div>
                    <div className="text-sm text-gray-600">Daily Lodging</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">$300-500</div>
                    <div className="text-sm text-gray-600">Total Fuel</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-700">$25-50</div>
                    <div className="text-sm text-gray-600">Tolls Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TollRoadTipsSection;
