
import React from 'react';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HiddenGemsLegendProps {
  count: number;
}

const HiddenGemsLegend: React.FC<HiddenGemsLegendProps> = ({ count }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-600" />
          Hidden Gems
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-white transform rotate-45"></div>
          </div>
          <span className="text-sm text-gray-600">
            {count} secret spots and local treasures along Route 66
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Discover off-the-beaten-path locations, mysterious phenomena, and unique attractions that most travelers miss.
        </p>
      </CardContent>
    </Card>
  );
};

export default HiddenGemsLegend;
