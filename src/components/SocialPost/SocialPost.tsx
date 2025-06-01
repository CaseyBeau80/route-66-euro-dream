
import React, { useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

interface SocialPostProps {
  post: {
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
  };
}

const SocialPost: React.FC<SocialPostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  console.log(`📱 SocialPost: Rendering post ${post.id} by ${post.username}`);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  return (
    <div className="bg-route66-cream rounded-lg border-2 border-route66-vintage-brown overflow-hidden shadow-postcard hover:transform hover:scale-105 transition-transform duration-200">
      {/* Post Header */}
      <div className="flex items-center p-3 bg-gradient-to-r from-route66-vintage-beige to-route66-tan">
        <img 
          src={post.userAvatar} 
          alt={`${post.username} avatar`}
          className="w-10 h-10 rounded-full border-2 border-route66-vintage-brown object-cover"
        />
        <div className="ml-3 flex-1">
          <h4 className="font-travel font-bold text-route66-vintage-brown text-sm">
            @{post.username}
          </h4>
          <p className="text-route66-rust text-xs font-travel">
            {post.location}
          </p>
        </div>
        <span className="text-route66-vintage-brown text-xs font-travel">
          {post.timeAgo}
        </span>
      </div>

      {/* Post Image */}
      <div className="relative">
        <img 
          src={post.image}
          alt={post.caption}
          className="w-full h-48 object-cover"
        />
        {/* Vintage photo corner */}
        <div className="absolute top-2 right-2">
          <div className="bg-route66-vintage-yellow text-route66-navy px-2 py-1 rounded text-xs font-bold opacity-80">
            ROUTE 66
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? 'text-route66-red' : 'text-route66-vintage-brown hover:text-route66-red'
              }`}
            >
              <Heart 
                size={20} 
                fill={isLiked ? 'currentColor' : 'none'}
                className="transition-all duration-200"
              />
              <span className="text-sm font-travel">{likeCount}</span>
            </button>
            
            <button className="flex items-center gap-1 text-route66-vintage-brown hover:text-route66-orange transition-colors">
              <MessageSquare size={20} />
              <span className="text-sm font-travel">{post.comments}</span>
            </button>
            
            <button className="text-route66-vintage-brown hover:text-route66-vintage-turquoise transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Post Caption */}
        <p className="text-route66-vintage-brown text-sm font-travel mb-2 leading-relaxed">
          {post.caption}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1">
          {post.hashtags.map((hashtag, index) => (
            <span 
              key={index}
              className="text-route66-rust text-xs font-travel hover:text-route66-red cursor-pointer transition-colors"
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPost;
