
import React, { useState } from 'react';
import { InstagramPost } from '../types';
import { EnhancedReelDetectionService } from '../services/EnhancedReelDetectionService';

interface MediaDebugInfoProps {
  post: InstagramPost;
}

const MediaDebugInfo: React.FC<MediaDebugInfoProps> = ({ post }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  const handleBtnClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the parent card click
    setShowDebug(!showDebug);
  };
  
  if (!showDebug) {
    return (
      <button
        onClick={handleBtnClick}
        className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs hover:bg-opacity-70"
      >
        Debug
      </button>
    );
  }

  const analysis = EnhancedReelDetectionService.analyzePost(post);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 text-white p-4 text-xs overflow-auto z-50" onClick={e => e.stopPropagation()}>
      <button
        onClick={handleBtnClick}
        className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs"
      >
        Close
      </button>
      
      <h3 className="font-bold mb-2">Post Analysis: {post.id}</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Stored Media Type:</strong> {post.media_type}
        </div>
        <div>
          <strong>Detected as Video:</strong> {analysis.isVideo ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Confidence:</strong> {analysis.confidence}%
        </div>
        <div>
          <strong>Detection Method:</strong> {analysis.detectionMethod}
        </div>
        <div>
          <strong>Suggested Type:</strong> {analysis.suggestedMediaType}
        </div>
        
        <div className="mt-3">
          <strong>URLs:</strong>
          <div className="ml-2">
            <div><strong>Media URL:</strong> {post.media_url || 'None'}</div>
            <div><strong>Thumbnail:</strong> {post.thumbnail_url || 'None'}</div>
            <div><strong>Permalink:</strong> {post.permalink || 'None'}</div>
          </div>
        </div>
        
        {post.caption && (
          <div className="mt-3">
            <strong>Caption:</strong>
            <div className="ml-2 max-h-20 overflow-y-auto">
              {post.caption.substring(0, 200)}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaDebugInfo;
