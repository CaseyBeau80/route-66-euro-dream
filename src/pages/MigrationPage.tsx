
import React from 'react';
import MigrationExecutor from '@/components/MigrationExecutor';

const MigrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Migration Tool
          </h1>
          <p className="text-gray-600">
            Move specific entries from Hidden Gems to Attractions
          </p>
        </div>
        
        <MigrationExecutor />
      </div>
    </div>
  );
};

export default MigrationPage;
