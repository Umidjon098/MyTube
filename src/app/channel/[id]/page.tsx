"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { useChannelVideos, useChannelDetails } from "@/hooks/useYouTube";
import { YouTubeVideo } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { VideoCardSkeleton } from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";
import Link from "next/link";

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const channelId = params.id as string;
  const toast = useToast();

  const {
    data: channelDetails,
    isLoading: isLoadingChannel,
    error: channelError,
    refetch: refetchChannel,
  } = useChannelDetails(channelId, !!channelId);
  const {
    data: videosData,
    isLoading: isLoadingVideos,
    error: videosError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchVideos,
  } = useChannelVideos(channelId, !!channelId);

  const handleVideoClick = (video: YouTubeVideo) => {
    router.push(`/watch/${video.id}`);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Mock data for development
  const mockChannel = {
    id: channelId,
    title: "Sample Channel",
    description:
      "This is a sample channel description for development purposes.",
    thumbnail: "https://via.placeholder.com/88x88/666666/FFFFFF?text=CH",
    subscriberCount: "1000000",
    videoCount: "500",
  };

  const mockVideos = [
    {
      id: "dQw4w9WgXcQ",
      title:
        "Sample Video 1 - This is a very long video title that might wrap to multiple lines",
      description:
        "This is a sample video description for development purposes.",
      thumbnail: "https://via.placeholder.com/320x180/666666/FFFFFF?text=VIDEO",
      channelTitle: mockChannel.title,
      channelId: channelId,
      publishedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "9bZkp7q19f0",
      title: "Sample Video 2 - Another interesting video title",
      description: "Another sample video description for development purposes.",
      thumbnail: "https://via.placeholder.com/320x180/666666/FFFFFF?text=VIDEO",
      channelTitle: mockChannel.title,
      channelId: channelId,
      publishedAt: "2024-01-10T15:30:00Z",
    },
    {
      id: "kJQP7kiw5Fk",
      title: "Sample Video 3 - Yet another video with a title",
      description:
        "Yet another sample video description for development purposes.",
      thumbnail: "https://via.placeholder.com/320x180/666666/FFFFFF?text=VIDEO",
      channelTitle: mockChannel.title,
      channelId: channelId,
      publishedAt: "2024-01-05T20:15:00Z",
    },
  ];

  const displayChannel = channelDetails || mockChannel;
  const allVideos =
    videosData?.pages.flatMap((page) => page.items) || mockVideos;

  if (isLoadingChannel || isLoadingVideos) {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/subscriptions"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subscriptions</span>
          </Link>
        </div>

        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <VideoCardSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (channelError || videosError) {
    const error = channelError || videosError;
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/subscriptions"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subscriptions</span>
          </Link>
        </div>
        <ErrorFallback
          error={error?.message || "Failed to load channel"}
          onRetry={() => {
            if (channelError) refetchChannel();
            if (videosError) refetchVideos();
            toast.info("Retrying...", "Attempting to reload channel data");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/subscriptions"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Subscriptions
        </Link>
      </div>

      {/* Channel Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start space-x-4">
          <Image
            src={displayChannel.thumbnail}
            alt={displayChannel.title}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {displayChannel.title}
            </h1>

            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
              {displayChannel.subscriberCount && (
                <span>
                  {parseInt(displayChannel.subscriberCount).toLocaleString()}{" "}
                  subscribers
                </span>
              )}
              {displayChannel.videoCount && (
                <span>
                  {parseInt(displayChannel.videoCount).toLocaleString()} videos
                </span>
              )}
            </div>

            {displayChannel.description && (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {displayChannel.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Latest Videos
        </h2>

        {isLoadingVideos ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={handleVideoClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Loading...
              </>
            ) : (
              "Load More Videos"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
