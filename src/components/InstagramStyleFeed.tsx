
import React from 'react';
import SocialPost from './SocialPost/SocialPost';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

interface SocialPostData {
  id: string;
  username: string;
  userAvatar: string;
  location: string;
  image: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
}

const InstagramStyleFeed: React.FC = () => {
  console.log("📸 InstagramStyleFeed: Rendering Route 66 social feed");

  const samplePosts: SocialPostData[] = [
    {
      id: '1',
      username: 'route66_roadtripper',
      userAvatar: '/lovable-uploads/0a31764a-ace1-4bcf-973c-cba1bac689fe.png',
      location: 'Cadillac Ranch, Amarillo, TX',
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb',
      caption: 'Just witnessed the most incredible sunset at Cadillac Ranch! Nothing beats the magic of Route 66 🌅',
      hashtags: ['#Route66', '#CadillacRanch', '#TexasRoadTrip', '#SunsetVibes'],
      likes: 127,
      comments: 23,
      timeAgo: '2h'
    },
    {
      id: '2',
      username: 'mother_road_adventures',
      userAvatar: '/lovable-uploads/ef90c3a0-71fe-4f68-8671-5a455d6e9bc1.png',
      location: 'Blue Whale, Catoosa, OK',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
      caption: 'Found this hidden gem! The Blue Whale of Catoosa is a must-see roadside attraction 🐋',
      hashtags: ['#BlueWhale', '#Oklahoma', '#RoadsideAttraction', '#Route66Magic'],
      likes: 89,
      comments: 15,
      timeAgo: '5h'
    },
    {
      id: '3',
      username: 'vintage_americana',
      userAvatar: '/lovable-uploads/d4bef21f-6976-42cb-95de-facd08a1a838.png',
      location: 'Wigwam Motel, Holbrook, AZ',
      image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      caption: 'Sleeping in a concrete teepee tonight! The Wigwam Motel is pure Route 66 nostalgia ⛺',
      hashtags: ['#WigwamMotel', '#Arizona', '#VintageMotel', '#Route66History'],
      likes: 156,
      comments: 31,
      timeAgo: '8h'
    },
    {
      id: '4',
      username: 'classic_car_cruiser',
      userAvatar: '/lovable-uploads/cb155b0c-3bb5-4095-8150-9fb36bcb52b2.png',
      location: 'Santa Monica Pier, CA',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
      caption: 'Made it to the end! 2,448 miles of pure American adventure. What a journey! 🏁',
      hashtags: ['#SantaMonicaPier', '#Route66End', '#RoadTripComplete', '#AmericanDream'],
      likes: 203,
      comments: 47,
      timeAgo: '12h'
    },
    {
      id: '5',
      username: 'desert_wanderer',
      userAvatar: '/lovable-uploads/0a31764a-ace1-4bcf-973c-cba1bac689fe.png',
      location: 'Petrified Forest, AZ',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
      caption: 'Walking through millions of years of history at Petrified Forest National Park 🌲',
      hashtags: ['#PetrifiedForest', '#Arizona', '#NationalPark', '#Route66Detour'],
      likes: 94,
      comments: 18,
      timeAgo: '1d'
    },
    {
      id: '6',
      username: 'diner_hopper',
      userAvatar: '/lovable-uploads/ef90c3a0-71fe-4f68-8671-5a455d6e9bc1.png',
      location: 'Mel\'s Drive-In, St. Louis, MO',
      image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151',
      caption: 'Best milkshake on the Mother Road! This classic diner never disappoints 🥤',
      hashtags: ['#MelsDriveIn', '#StLouis', '#ClassicDiner', '#Route66Eats'],
      likes: 78,
      comments: 12,
      timeAgo: '2d'
    }
  ];

  return (
    <div className="w-full px-2 sm:px-3 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="font-route66 text-3xl md:text-4xl text-route66-red mb-2">
            ROUTE 66 SOCIAL FEED
          </h2>
          <p className="font-travel text-route66-vintage-brown text-lg">
            Real stories and adventures from fellow travelers on the Mother Road
          </p>
          <div className="flex justify-center mt-3 gap-2">
            <div className="bg-route66-vintage-yellow text-route66-navy px-4 py-1 rounded-full font-bold text-sm">
              #ROUTE66
            </div>
            <div className="bg-route66-orange text-white px-4 py-1 rounded-full font-bold text-sm">
              LIVE FEED
            </div>
          </div>
        </div>

        {/* Social Feed Container */}
        <div className="relative">
          {/* Vintage frame decoration */}
          <div className="absolute -inset-3 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown rounded-xl opacity-80 vintage-paper-texture"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow rounded-lg opacity-60"></div>
          
          <div className="relative bg-white rounded-lg p-4 border-4 border-route66-vintage-brown shadow-postcard">
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {samplePosts.map((post) => (
                <SocialPost 
                  key={post.id} 
                  post={post}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="vintage-button px-8 py-3 text-lg font-bold">
                VIEW MORE ADVENTURES
              </button>
            </div>
          </div>
          
          {/* Vintage route markers */}
          <div className="flex justify-center mt-4 gap-2">
            <div className="bg-route66-vintage-turquoise text-white px-3 py-1 rounded-full text-xs font-bold">
              REAL STORIES
            </div>
            <div className="bg-route66-orange text-white px-3 py-1 rounded-full text-xs font-bold">
              DAILY UPDATES
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramStyleFeed;
