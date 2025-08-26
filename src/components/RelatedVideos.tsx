"use client";

import React, { useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChannelVideos } from "@/hooks/useYouTube";
// ...existing code...

interface RelatedVideosProps {
  channelId: string;
  excludeVideoId?: string;
}

const RelatedVideos: React.FC<RelatedVideosProps> = ({
  channelId,
  excludeVideoId,
}) => {
  const router = useRouter();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useChannelVideos(channelId);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (status === "pending") return <div>Loading related videos...</div>;
  if (status === "error")
    return <div>Error loading related videos: {String(error)}</div>;

  const videos =
    data?.pages
      .flatMap((page) => page.items)
      .filter((v) => v.id !== excludeVideoId) || [];

  const handleVideoClick = (video: import("@/types").YouTubeVideo) => {
    router.push(`/watch/${video.id}`);
  };

  return (
    <div className="space-y-4">
      {videos.map((video, idx) => {
        const videoBox = (
          <div
            key={video.id}
            className="flex space-x-3 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition"
            onClick={() => handleVideoClick(video)}
          >
            <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 overflow-hidden relative">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                {video.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {video.channelTitle}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {video.viewCount ? `${video.viewCount} views • ` : ""}
                {video.publishedAt
                  ? new Date(video.publishedAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
        );
        if (idx === videos.length - 1) {
          return (
            <div ref={lastVideoRef} key={video.id}>
              {videoBox}
            </div>
          );
        }
        return videoBox;
      })}
      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && videos.length > 0 && (
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          No more videos
        </div>
      )}
    </div>
  );
};

export default RelatedVideos;
