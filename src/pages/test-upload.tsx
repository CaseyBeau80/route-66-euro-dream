'use client';

import TestUpload from '@/components/TestUpload';
import SocialMetaTags from '@/components/shared/SocialMetaTags';

export default function TestUploadPage() {
  return (
    <main className="min-h-screen bg-background">
      <SocialMetaTags 
        path="/test-upload"
        title="Route 66 Media Upload – Ramble 66"
        description="Share your Route 66 journey photos and videos with fellow travelers on Ramble 66."
      />
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">📸 Route 66 Media Upload Challenge</h1>
            <p className="text-lg text-muted-foreground">
              Share your journey along America's Main Street with fellow travelers - photos, videos, and planning content welcome!
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-blue-800">How It Works</h2>
            <div className="space-y-2 text-blue-700">
              <p>📷 Upload photos and videos from your Route 66 adventure</p>
              <p>🎬 Share travel planning videos, route demonstrations, or journey vlogs</p>
              <p>🔍 Automatic content moderation for community safety</p>
              <p>✨ Instant upload to your Route 66 media collection</p>
              <p>🏆 Join thousands of travelers sharing their Route 66 memories</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-amber-800">Content Guidelines</h2>
            <div className="space-y-2 text-amber-700">
              <p>• Capture iconic Route 66 landmarks, signs, and attractions</p>
              <p>• Share scenic highway views and historic stops</p>
              <p>• Include roadside diners, motels, and vintage Americana</p>
              <p>• Travel planning videos, route walkthroughs, and journey documentation</p>
              <p>• Keep content family-friendly and appropriate for all ages</p>
            </div>
          </div>

          <TestUpload />
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4 text-center">
            <h2 className="text-xl font-semibold text-green-800">Start Your Route 66 Journey</h2>
            <p className="text-green-700">
              Ready to explore? Plan your Route 66 adventure and discover iconic stops, 
              hidden gems, and must-see attractions along America's most famous highway.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
