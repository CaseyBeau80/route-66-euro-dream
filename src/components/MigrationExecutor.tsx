
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HiddenGemsToAttractionsService } from '@/services/HiddenGemsToAttractionsService';
import { Loader2, CheckCircle, XCircle, Info } from 'lucide-react';

const MigrationExecutor: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const executeMigration = async () => {
    setIsExecuting(true);
    setResults(null);
    
    try {
      console.log('🚀 Starting migration execution...');
      const migrationResults = await HiddenGemsToAttractionsService.executeMigrationPlan();
      setResults(migrationResults);
      
      // Get updated status
      const statusResults = await HiddenGemsToAttractionsService.getMigrationStatus();
      setStatus(statusResults);
      
    } catch (error) {
      console.error('❌ Migration execution failed:', error);
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const checkStatus = async () => {
    try {
      const statusResults = await HiddenGemsToAttractionsService.getMigrationStatus();
      setStatus(statusResults);
    } catch (error) {
      console.error('❌ Failed to check status:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Hidden Gems to Attractions Migration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This will move 10 specific entries from the hidden_gems table to the attractions table, 
            handle duplicates, and populate missing state values.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={executeMigration} 
              disabled={isExecuting}
              className="flex items-center gap-2"
            >
              {isExecuting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isExecuting ? 'Executing Migration...' : 'Execute Migration Plan'}
            </Button>
            
            <Button 
              onClick={checkStatus} 
              variant="outline"
              disabled={isExecuting}
            >
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Migration Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Migration Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.success ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2">Duplicate Handled</Badge>
                    <p className="text-sm text-gray-600">
                      {results.duplicateHandled ? '✅ Handled' : '❌ Failed'}
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">States Populated</Badge>
                    <p className="text-sm text-gray-600">
                      {results.statesPopulated ? '✅ Completed' : '❌ Failed'}
                    </p>
                  </div>
                </div>

                {results.moveResults && (
                  <div>
                    <h4 className="font-medium mb-2">Entry Move Results:</h4>
                    <div className="space-y-1">
                      {results.moveResults.map((result: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>{result.name}</span>
                          {!result.success && (
                            <span className="text-red-600 text-xs">({result.error})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.verificationResults && (
                  <div>
                    <h4 className="font-medium mb-2">Verification Results:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Successfully Moved:</span>
                        <span className="ml-2">{results.verificationResults.movedEntries.length}/10</span>
                      </div>
                      <div>
                        <span className="font-medium">Total Attractions:</span>
                        <span className="ml-2">{results.verificationResults.totalInAttractions}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600">
                <p>Migration failed: {results.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Check Results */}
      {status && (
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status.entriesInAttractions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-green-600">
                    In Attractions ({status.entriesInAttractions.length})
                  </h4>
                  <div className="space-y-1">
                    {status.entriesInAttractions.map((entry: any, index: number) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{entry.name}</span>
                        <span className="text-gray-500">({entry.actualName})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {status.entriesInHiddenGems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-blue-600">
                    Still in Hidden Gems ({status.entriesInHiddenGems.length})
                  </h4>
                  <div className="space-y-1">
                    {status.entriesInHiddenGems.map((entry: any, index: number) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span>{entry.name}</span>
                        <span className="text-gray-500">({entry.actualName})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {status.notFound.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">
                    Not Found ({status.notFound.length})
                  </h4>
                  <div className="space-y-1">
                    {status.notFound.map((entry: string, index: number) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>{entry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MigrationExecutor;
