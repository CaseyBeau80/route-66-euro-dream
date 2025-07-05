
import { useState } from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed header to match the blue bar issue */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-blue-600">
        <div className="container mx-auto px-4 h-full flex items-center">
          <h1 className="text-white font-bold">Route 66 Ramble</h1>
        </div>
      </div>
      
      {/* Main content with proper top padding */}
      <div className="pt-16">
        {/* Simple content */}
        <div className="py-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Route 66 Planning Made Simple
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your complete Route 66 adventure starts here.
          </p>
          <div className="bg-blue-50 p-8 rounded-lg max-w-2xl mx-auto">
            <p className="text-lg text-blue-800">
              ✅ Website loading test successful!
            </p>
            <p className="text-sm text-blue-600 mt-2">
              If you can see this, the core rendering is working.
            </p>
          </div>
        </div>
        
        {/* Additional test content */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-8">Test Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold mb-2">Section 1</h4>
                <p className="text-gray-600">Basic content test</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold mb-2">Section 2</h4>
                <p className="text-gray-600">Layout test</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold mb-2">Section 3</h4>
                <p className="text-gray-600">Rendering test</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
