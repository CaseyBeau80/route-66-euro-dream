
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SimpleInstagramCarousel from '../InstagramCarousel/components/SimpleInstagramCarousel';
import { Camera, Share2, Trophy, Users, Instagram, Hash } from 'lucide-react';

const SocialGallerySection: React.FC = () => {
  return (
    <section className="py-20 bg-route66-background-section">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Camera className="h-5 w-5" />
            SOCIAL COMMUNITY
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-route66-primary mb-6">
            Share Your Route 66 Journey
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Join thousands of travelers sharing their Route 66 adventures. Upload photos, 
            complete challenges, and connect with fellow road trip enthusiasts.
          </p>
        </div>

        {/* Social Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center bg-pink-50 rounded-xl p-4 border border-pink-200">
            <div className="text-2xl font-bold text-route66-primary mb-1">25K+</div>
            <div className="text-sm text-gray-600">Community Members</div>
          </div>
          <div className="text-center bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="text-2xl font-bold text-route66-primary mb-1">150K+</div>
            <div className="text-sm text-gray-600">Photos Shared</div>
          </div>
          <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-route66-primary mb-1">50+</div>
            <div className="text-sm text-gray-600">Active Challenges</div>
          </div>
          <div className="text-center bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-2xl font-bold text-route66-primary mb-1">Daily</div>
            <div className="text-sm text-gray-600">New Content</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Instagram Feed */}
          <div>
            <Card className="shadow-lg border-2 border-route66-border">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-route66-border">
                <CardTitle className="flex items-center gap-3 text-route66-primary">
                  <Instagram className="h-6 w-6 text-pink-600" />
                  Route 66 Community Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SimpleInstagramCarousel />
              </CardContent>
            </Card>
          </div>

          {/* Photo Challenges & Community Features */}
          <div className="space-y-6">
            {/* Current Challenge */}
            <Card className="shadow-lg border-2 border-yellow-300 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-yellow-800">
                  <Trophy className="h-6 w-6" />
                  This Week's Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-bold text-yellow-800 mb-2">🏆 "Vintage Neon Signs"</h4>
                  <p className="text-yellow-700 mb-3">
                    Capture the iconic neon signage that defines Route 66's nostalgic charm
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-600">📅 4 days remaining</span>
                    <span className="text-yellow-600">🏅 87 participants</span>
                  </div>
                </div>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Camera className="mr-2 h-4 w-4" />
                  Join Challenge
                </Button>
              </CardContent>
            </Card>

            {/* Community Features */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Share2 className="h-6 w-6 text-route66-primary" />
                    <h4 className="font-bold text-gray-800">Share Your Photos</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Tag @route66heritage and use #Route66Adventure to be featured!
                  </p>
                  <Button variant="outline" className="w-full border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white">
                    <Hash className="mr-2 h-4 w-4" />
                    #Route66Adventure
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-6 w-6 text-route66-primary" />
                    <h4 className="font-bold text-gray-800">Join Community</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Connect with fellow travelers and share tips, stories, and experiences
                  </p>
                  <Button variant="outline" className="w-full border-route66-primary text-route66-primary hover:bg-route66-primary hover:text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Connect Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Popular Photo Categories */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">📸 Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Classic Diners", count: 1243, emoji: "🍔" },
                    { name: "Vintage Motels", count: 856, emoji: "🏨" },
                    { name: "Route 66 Shields", count: 2156, emoji: "🛡️" },
                    { name: "Desert Views", count: 892, emoji: "🏜️" }
                  ].map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                      <div className="text-2xl mb-1">{category.emoji}</div>
                      <div className="font-semibold text-sm text-gray-800">{category.name}</div>
                      <div className="text-xs text-gray-600">{category.count} photos</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialGallerySection;
