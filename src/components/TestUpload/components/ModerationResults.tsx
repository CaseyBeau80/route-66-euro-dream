
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

export const ModerationResults = ({ results }: ModerationResultsProps) => {
  if (!results) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderation Results</CardTitle>
        <CardDescription>
          Google Cloud Vision SafeSearch Analysis (from Edge Function)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Adult:</span>
              <span className={getStatusColor(results.adult)}>
                {results.adult}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Violence:</span>
              <span className={getStatusColor(results.violence)}>
                {results.violence}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Racy:</span>
              <span className={getStatusColor(results.racy)}>
                {results.racy}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Spoof:</span>
              <span className={getStatusColor(results.spoof)}>
                {results.spoof}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Medical:</span>
              <span className={getStatusColor(results.medical)}>
                {results.medical}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
