'use client';

import React from 'react';
import Image from 'next/image';
import { YouTubeVideo } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: YouTubeVideo;
  onClick?: (video: YouTubeVideo) => void;
  className?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onClick, 
  className = '' 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(video);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200" />
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
          {video.title}
        </h3>
        
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 space-x-2">
          <span className="font-medium">{video.channelTitle}</span>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          {formatDate(video.publishedAt)}
        </div>
      </div>
    </div>
  );
};
