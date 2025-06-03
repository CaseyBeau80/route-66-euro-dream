
import React from 'react';
import { InstagramPost } from '../types';
import { ImageOff } from 'lucide-react';
import PostContent from './PostContent';
import PostStats from './PostStats';

interface ErrorPlaceholderProps {
  post: InstagramPost;
}

const ErrorPlaceholder: React.FC<ErrorPlaceholderProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <div className="text-center">
            <ImageOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No media URL available</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <PostContent post={post} />
        <div className="mt-3">
          <PostStats post={post} />
        </div>
      </div>
    </div>
  );
};

export default ErrorPlaceholder;
