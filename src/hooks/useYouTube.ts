import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { createYouTubeAPI, getYouTubeAPI } from "@/lib/youtube-api";
import { useAuth } from "@/contexts/AuthContext";

// Hook for fetching user subscriptions
export const useSubscriptions = (enabled: boolean = true) => {
  const { tokens, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["subscriptions", tokens?.accessToken],
    queryFn: async () => {
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }

      // Initialize YouTube API with tokens
      const api = createYouTubeAPI(
        process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "",
        tokens.accessToken
      );

      return api.getSubscriptions();
    },
    enabled: enabled && isAuthenticated && !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for auth errors
      if (failureCount >= 3) return false;
      if (error.message.includes("401") || error.message.includes("403"))
        return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching channel videos with infinite scroll
export const useChannelVideos = (
  channelId: string,
  enabled: boolean = true
) => {
  const { tokens, isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: ["channel-videos", channelId, tokens?.accessToken],
    queryFn: async ({ pageParam }) => {
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }

      const api = getYouTubeAPI();
      if (!api) {
        throw new Error("YouTube API not initialized");
      }

      return api.getChannelVideos(channelId, 20, pageParam);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: enabled && isAuthenticated && !!tokens?.accessToken && !!channelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message.includes("401") || error.message.includes("403"))
        return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for searching videos with infinite scroll
export const useVideoSearch = (query: string, enabled: boolean = true) => {
  const { tokens, isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: ["video-search", query, tokens?.accessToken],
    queryFn: async ({ pageParam }) => {
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }

      const api = getYouTubeAPI();
      if (!api) {
        throw new Error("YouTube API not initialized");
      }

      return api.searchVideos(query, 20, pageParam);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled:
      enabled && isAuthenticated && !!tokens?.accessToken && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message.includes("401") || error.message.includes("403"))
        return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching channel details
export const useChannelDetails = (
  channelId: string,
  enabled: boolean = true
) => {
  const { tokens, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["channel-details", channelId, tokens?.accessToken],
    queryFn: async () => {
      if (!tokens?.accessToken) {
        throw new Error("No access token available");
      }

      const api = getYouTubeAPI();
      if (!api) {
        throw new Error("YouTube API not initialized");
      }

      return api.getChannelDetails(channelId);
    },
    enabled: enabled && isAuthenticated && !!tokens?.accessToken && !!channelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message.includes("401") || error.message.includes("403"))
        return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => isAuthenticated,
    enabled: !isLoading,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
