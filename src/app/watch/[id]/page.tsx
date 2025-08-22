'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        iframe.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  // Mock video data for development
  const mockVideo = {
    id: videoId,
    title: 'Sample Video Title - This is a very long video title that might wrap to multiple lines',
    description: 'This is a sample video description for development purposes. It contains information about the video content and what viewers can expect to see.',
    channelTitle: 'Sample Channel',
    channelId: 'UC123456789',
    publishedAt: '2024-01-15T10:00:00Z',
    viewCount: '1,234,567',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden mb-6">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={mockVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              
              {/* Fullscreen button overlay */}
              <button
                onClick={handleFullscreen}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-md transition-all duration-200"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {mockVideo.title}
            </h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{mockVideo.viewCount} views</span>
                <span>•</span>
                <span>{new Date(mockVideo.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                    {mockVideo.channelTitle.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {mockVideo.channelTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {mockVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Related Videos
            </h2>
            
            <div className="space-y-4">
              {/* Mock related videos */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3 cursor-pointer group">
                  <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0">
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-xs">VIDEO</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                      Related Video Title {i} - This is a sample related video title
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Sample Channel
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      123K views • 2 days ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
