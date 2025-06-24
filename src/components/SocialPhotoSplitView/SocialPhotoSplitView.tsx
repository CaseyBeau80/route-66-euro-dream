
import React from 'react';
import SplitViewSection from '../SplitViewSection/SplitViewSection';
import SimpleInstagramCarousel from '../InstagramCarousel/components/SimpleInstagramCarousel';
import { Camera, Share2, Trophy, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SocialPhotoSplitView: React.FC = () => {
  const socialContent = (
    <div className="space-y-6">
      {/* Social Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="h-8 w-8 text-pink-600" />
          <div>
            <h3 className="text-2xl font-bold text-route66-primary">Social Route 66</h3>
            <p className="text-route66-text-secondary">Connect with fellow travelers</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-pink-100">
            <div className="flex items-center gap-2 text-pink-600 mb-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Community</span>
            </div>
            <p className="text-sm text-gray-600">Join thousands of Route 66 enthusiasts</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">Challenges</span>
            </div>
            <p className="text-sm text-gray-600">Complete photo challenges & earn badges</p>
          </div>
        </div>
      </div>

      {/* Instagram Feed */}
      <SimpleInstagramCarousel />

      {/* Social Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Share Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Tag us @route66heritage and use #Route66Adventure to be featured!
            </p>
            <Button variant="outline" className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Photo Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Complete weekly challenges and earn exclusive Route 66 badges!
            </p>
            <Button variant="outline" className="w-full">
              View Challenges
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const photoContent = (
    <div className="space-y-6">
      {/* Photo Challenge Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="h-8 w-8 text-yellow-600" />
          <div>
            <h3 className="text-2xl font-bold text-route66-primary">Photo Challenges</h3>
            <p className="text-route66-text-secondary">Capture the spirit of Route 66</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-yellow-100">
          <h4 className="font-bold text-yellow-800 mb-2">🏆 This Week's Challenge</h4>
          <p className="text-sm text-yellow-700 mb-3">
            "Vintage Neon Signs" - Capture the iconic neon signage that defines Route 66
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-600">📅 Ends in 4 days</span>
            <span className="text-yellow-600">🏅 52 participants</span>
          </div>
        </div>
      </div>

      {/* Challenge Categories */}
      <div className="grid grid-cols-1 gap-4">
        {[
          { title: "Classic Diners", emoji: "🍔", participants: 128, status: "Active" },
          { title: "Historic Motels", emoji: "🏨", participants: 95, status: "Active" },
          { title: "Route 66 Shields", emoji: "🛡️", participants: 203, status: "Popular" },
          { title: "Desert Landscapes", emoji: "🏜️", participants: 167, status: "Active" },
          { title: "Vintage Gas Stations", emoji: "⛽", participants: 89, status: "New" }
        ].map((challenge, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{challenge.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">{challenge.participants} photos submitted</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    challenge.status === 'Popular' ? 'bg-red-100 text-red-700' :
                    challenge.status === 'New' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {challenge.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Call to Action */}
      <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <Camera className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-yellow-800 mb-2">Ready to Join the Adventure?</h4>
          <p className="text-sm text-yellow-700 mb-4">
            Upload your Route 66 photos and become part of our growing community
          </p>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <Camera className="h-4 w-4 mr-2" />
            Start Photo Challenge
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SplitViewSection
      leftContent={socialContent}
      rightContent={photoContent}
      leftTitle="Social Community"
      rightTitle="Photo Challenges"
      sectionId="social-photo-split"
      leftBg="bg-white"
      rightBg="bg-yellow-50"
    />
  );
};

export default SocialPhotoSplitView;
