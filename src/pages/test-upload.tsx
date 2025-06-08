
'use client';

import TestUpload from '@/components/TestUpload';

export default function TestUploadPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">📤 Photo Moderation Test (Edge Function)</h1>
            <p className="text-lg text-muted-foreground">
              Test the server-side Google Cloud Vision API integration via Supabase Edge Function
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-blue-800">Edge Function Integration</h2>
            <div className="space-y-2 text-blue-700">
              <p>1. Images are sent to your deployed Supabase Edge Function</p>
              <p>2. Server-side moderation using Google Cloud Vision API</p>
              <p>3. Automatic upload to Supabase storage if approved</p>
              <p>4. Data insertion into photo_challenges table</p>
              <p>5. Complete JSON response with results</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-green-800">Test Configuration</h2>
            <div className="space-y-2 text-green-700">
              <p>• Trip ID: hardcoded to "demo-trip"</p>
              <p>• Stop ID: hardcoded to "tulsa"</p>
              <p>• User Session: auto-generated with timestamp</p>
              <p>• Only requires Google Cloud Vision API key input</p>
            </div>
          </div>

          <TestUpload />
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Edge Function Endpoint</h2>
            <p className="text-gray-600 mb-4">Your Edge Function URL:</p>
            <code className="bg-gray-800 text-gray-100 p-4 rounded-lg block text-sm">
              https://xbwaphzntaxmdfzfsmvt.supabase.co/functions/v1/moderate-and-upload
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
