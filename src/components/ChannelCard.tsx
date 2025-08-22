'use client';

import React from 'react';
import Image from 'next/image';
import { YouTubeChannel } from '@/types';

interface ChannelCardProps {
  channel: YouTubeChannel;
  onClick?: (channel: YouTubeChannel) => void;
  className?: string;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ 
  channel, 
  onClick, 
  className = '' 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(channel);
    }
  };

  const formatNumber = (num: string | undefined) => {
    if (!num) return '0';
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Channel Avatar and Info */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Image
              src={channel.thumbnail}
              alt={channel.title}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {channel.title}
            </h3>
            
            <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
              {channel.subscriberCount && (
                <span>{formatNumber(channel.subscriberCount)} subscribers</span>
              )}
              {channel.videoCount && (
                <span>{formatNumber(channel.videoCount)} videos</span>
              )}
            </div>
          </div>
        </div>

        {/* Channel Description */}
        {channel.description && (
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {channel.description}
          </p>
        )}
      </div>
    </div>
  );
};
