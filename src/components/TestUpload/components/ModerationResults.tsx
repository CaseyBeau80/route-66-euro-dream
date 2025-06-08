
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';
import { forwardRef } from 'react';

interface ModerationResultsData {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

interface ModerationResultsProps {
  results: ModerationResultsData | null;
}

const getStatusColor = (level: string) => {
  switch (level) {
    case 'VERY_UNLIKELY':
    case 'UNLIKELY':
      return 'text-green-600';
    case 'POSSIBLE':
      return 'text-yellow-600';
    case 'LIKELY':
    case 'VERY_LIKELY':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getStatusIcon = (level: string) => {
  switch (level) {
    case 'VERY_UNLIKELY':
    case 'UNLIKELY':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Shield className="h-4 w-4 text-muted-foreground" />;
  }
};

export const ModerationResults = forwardRef<HTMLDivElement, ModerationResultsProps>(
  ({ results }, ref) => {
    if (!results) return null;

    return (
      <Card ref={ref}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Content Safety Check
          </CardTitle>
          <CardDescription>
            Automated content analysis to ensure community-friendly photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.adult)}
                  <span className="font-medium">Adult Content:</span>
                </div>
                <span className={`font-semibold ${getStatusColor(results.adult)}`}>
                  {results.adult}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.violence)}
                  <span className="font-medium">Violence:</span>
                </div>
                <span className={`font-semibold ${getStatusColor(results.violence)}`}>
                  {results.violence}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.racy)}
                  <span className="font-medium">Racy Content:</span>
                </div>
                <span className={`font-semibold ${getStatusColor(results.racy)}`}>
                  {results.racy}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.spoof)}
                  <span className="font-medium">Spoof/Fake:</span>
                </div>
                <span className={`font-semibold ${getStatusColor(results.spoof)}`}>
                  {results.spoof}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.medical)}
                  <span className="font-medium">Medical:</span>
                </div>
                <span className={`font-semibold ${getStatusColor(results.medical)}`}>
                  {results.medical}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ModerationResults.displayName = 'ModerationResults';
