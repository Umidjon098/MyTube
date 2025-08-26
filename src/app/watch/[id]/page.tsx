"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import RelatedVideos from "@/components/RelatedVideos";
import { useVideoDetails } from "@/hooks/useVideoDetails";

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: videoData, isLoading, error } = useVideoDetails(videoId);

  const handleFullscreen = () => {
    const iframe = document.querySelector("iframe");
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

  return (
    <div className="max-w-[1440px] mx-auto px-4">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>
      {isLoading && <div>Loading video...</div>}
      {error && <div>Error loading video: {String(error)}</div>}
      {videoData && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Video Player & Info */}
          <div className="lg:w-2/3 flex-shrink-0">
            <div className="sticky top-4">
              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden mb-4">
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={videoData.snippet.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {/* Fullscreen button overlay */}
                  <button
                    onClick={handleFullscreen}
                    className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-md transition-all duration-200"
                    title={
                      isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Video Title */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {videoData.snippet.title}
              </h1>
              {/* Channel Info & Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                      {videoData.snippet.channelTitle.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {videoData.snippet.channelTitle}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      • {videoData.snippet.channelId}
                    </div>
                  </div>
                </div>
                {/* Video Stats */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-300">
                    {videoData.statistics?.viewCount} views
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {new Date(
                      videoData.snippet.publishedAt
                    ).toLocaleDateString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    👍 {videoData.statistics?.likeCount}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    💬 {videoData.statistics?.commentCount}
                  </span>
                </div>
              </div>
              {/* Video Description */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-md p-4 text-sm text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line">
                {videoData.snippet.description}
              </div>
            </div>
          </div>
          {/* Right: Scrollable Related Videos */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Videos
              </h2>
              <RelatedVideos
                channelId={videoData.snippet.channelId}
                excludeVideoId={videoId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
