import { useQuery } from "@tanstack/react-query";
import { getYouTubeAPI } from "@/lib/youtube-api";

export const useVideoDetails = (videoId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["video-details", videoId],
    queryFn: async () => {
      const api = getYouTubeAPI();
      if (!api) throw new Error("YouTube API not initialized");
      return api.getVideoDetails(videoId);
    },
    enabled: enabled && !!videoId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
