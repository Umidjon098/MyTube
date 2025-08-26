"use client";

import React, { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChannelVideos } from "@/hooks/useYouTube";
import { VideoCard } from "@/components/VideoCard";

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
        if (idx === videos.length - 1) {
          return (
            <div ref={lastVideoRef} key={video.id}>
              <VideoCard video={video} onClick={handleVideoClick} />
            </div>
          );
        }
        return (
          <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
        );
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
