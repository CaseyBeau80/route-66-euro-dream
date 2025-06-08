
'use client';

import TestUpload from '@/components/TestUpload';

export default function TestUploadPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">📤 Photo Moderation Test</h1>
            <p className="text-lg text-muted-foreground">
              Test the Google Cloud Vision API integration for photo challenge uploads
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-blue-800">Setup Instructions</h2>
            <div className="space-y-2 text-blue-700">
              <p>1. Get a Google Cloud Vision API key from the Google Cloud Console</p>
              <p>2. Enable the Vision API for your project</p>
              <p>3. Create the moderation_results table using the provided SQL</p>
              <p>4. Ensure RLS policies are set up for testing</p>
              <p>5. Enter your API key and test with various images</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-yellow-800">Testing Guidelines</h2>
            <div className="space-y-2 text-yellow-700">
              <p>• Images are accepted only if ALL categories are VERY_UNLIKELY or UNLIKELY</p>
              <p>• Test with various types of images to verify moderation</p>
              <p>• Check the Supabase tables to verify data insertion</p>
              <p>• Monitor console logs for detailed debugging information</p>
            </div>
          </div>

          <TestUpload />
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">SQL Setup</h2>
            <p className="text-gray-600 mb-4">Run this SQL in your Supabase SQL editor:</p>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`-- Create moderation_results table
CREATE TABLE IF NOT EXISTS moderation_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID REFERENCES photo_challenges(id) ON DELETE CASCADE,
  adult TEXT NOT NULL,
  spoof TEXT NOT NULL,
  medical TEXT NOT NULL,
  violence TEXT NOT NULL,
  racy TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE moderation_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for testing (adjust as needed)
CREATE POLICY "Allow public insert on moderation_results" 
ON moderation_results FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public select on moderation_results" 
ON moderation_results FOR SELECT 
TO public 
USING (true);`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
