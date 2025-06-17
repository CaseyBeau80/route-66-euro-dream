
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HeritageDatabaseMigration } from '../services/data/HeritageDatabaseMigration';
import { useToast } from '@/hooks/use-toast';

interface HeritageValidationStatus {
  totalCities: number;
  citiesWithScores: number;
  missingScores: string[];
}

const HeritageManagementPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<HeritageValidationStatus | null>(null);
  const [migrationResults, setMigrationResults] = useState<any>(null);
  const { toast } = useToast();

  const handleValidateScores = async () => {
    setIsLoading(true);
    try {
      const status = await HeritageDatabaseMigration.validateHeritageScores();
      setValidationStatus(status);
      
      toast({
        title: "Validation Complete",
        description: `Found ${status.citiesWithScores}/${status.totalCities} cities with heritage scores`,
        variant: status.citiesWithScores === status.totalCities ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Error validating heritage scores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyMigration = async () => {
    setIsLoading(true);
    try {
      const results = await HeritageDatabaseMigration.applyHeritageScores();
      setMigrationResults(results);
      
      toast({
        title: results.success ? "Migration Complete" : "Migration Failed",
        description: results.message,
        variant: results.success ? "default" : "destructive"
      });

      // Refresh validation status
      if (results.success) {
        await handleValidateScores();
      }
    } catch (error) {
      toast({
        title: "Migration Failed",
        description: "Error applying heritage scores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const heritageData = HeritageDatabaseMigration.getHeritageCityData();
  const tierCounts = heritageData.reduce((acc, city) => {
    acc[city.route66_importance] = (acc[city.route66_importance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏛️ Heritage Database Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Heritage Data Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{heritageData.length}</div>
            <div className="text-sm text-blue-800">Total Heritage Cities</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{tierCounts.iconic || 0}</div>
            <div className="text-sm text-purple-800">Iconic Cities</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{tierCounts.major || 0}</div>
            <div className="text-sm text-green-800">Major Cities</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{tierCounts.significant || 0}</div>
            <div className="text-sm text-orange-800">Significant Cities</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{tierCounts.notable || 0}</div>
            <div className="text-sm text-gray-800">Notable Cities</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={handleValidateScores} 
            disabled={isLoading}
            variant="outline"
          >
            🔍 Validate Current Scores
          </Button>
          <Button 
            onClick={handleApplyMigration} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🚀 Apply Heritage Migration
          </Button>
        </div>

        {/* Validation Status */}
        {validationStatus && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">
                  Heritage Score Status: {validationStatus.citiesWithScores}/{validationStatus.totalCities} cities have scores
                </div>
                {validationStatus.missingScores.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Missing heritage scores:</div>
                    <div className="flex flex-wrap gap-1">
                      {validationStatus.missingScores.slice(0, 10).map((city, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {city}
                        </Badge>
                      ))}
                      {validationStatus.missingScores.length > 10 && (
                        <Badge variant="secondary" className="text-xs">
                          +{validationStatus.missingScores.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Migration Results */}
        {migrationResults && (
          <Alert variant={migrationResults.success ? "default" : "destructive"}>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">{migrationResults.message}</div>
                {migrationResults.errors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Errors:</div>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {migrationResults.errors.slice(0, 5).map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                      {migrationResults.errors.length > 5 && (
                        <li>... and {migrationResults.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Heritage Cities Preview */}
        <div>
          <h3 className="font-semibold mb-3">Heritage Cities Database</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {heritageData.slice(0, 20).map((city, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{city.name}, {city.state}</span>
                  <Badge className="ml-2" variant={
                    city.route66_importance === 'iconic' ? 'default' :
                    city.route66_importance === 'major' ? 'secondary' : 'outline'
                  }>
                    {city.route66_importance}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Heritage: {city.heritage_score} | Tourism: {city.tourism_score}
                </div>
              </div>
            ))}
            {heritageData.length > 20 && (
              <div className="text-center text-sm text-gray-500 p-2">
                ... and {heritageData.length - 20} more cities
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeritageManagementPanel;
