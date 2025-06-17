
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route66TripPlannerService } from '../services/Route66TripPlannerService';
import HeritageManagementPanel from './HeritageManagementPanel';

const DeveloperDebugTools: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const runDiagnostics = async () => {
    try {
      const dataStatus = Route66TripPlannerService.getDataSourceStatus();
      const isUsingFallback = Route66TripPlannerService.isUsingFallbackData();
      const destinationCount = await Route66TripPlannerService.getDestinationCitiesCount();

      setDebugInfo({
        dataStatus,
        isUsingFallback,
        destinationCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug diagnostics failed:', error);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <Card className="w-full mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          🔧 Developer Debug Tools
          <Badge variant="outline" className="text-xs">
            Development Only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="diagnostics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diagnostics">System Diagnostics</TabsTrigger>
            <TabsTrigger value="heritage">Heritage Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnostics" className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={runDiagnostics} variant="outline" size="sm">
                🔍 Run Diagnostics
              </Button>
              <Button 
                onClick={() => console.log('Manual debug point')} 
                variant="outline" 
                size="sm"
              >
                📝 Console Log
              </Button>
            </div>

            {debugInfo && (
              <div className="space-y-3">
                <div className="text-sm font-mono bg-gray-100 p-3 rounded">
                  <div className="font-semibold mb-2">System Status:</div>
                  {debugInfo.error ? (
                    <div className="text-red-600">❌ Error: {debugInfo.error}</div>
                  ) : (
                    <>
                      <div>📊 Data Status: {debugInfo.dataStatus}</div>
                      <div>🔄 Using Fallback: {debugInfo.isUsingFallback ? 'Yes' : 'No'}</div>
                      <div>🏙️ Destination Cities: {debugInfo.destinationCount}</div>
                      <div>⏰ Last Check: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="heritage" className="space-y-4">
            <HeritageManagementPanel />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeveloperDebugTools;
