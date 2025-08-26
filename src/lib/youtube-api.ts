// ...existing code...
import {
  YouTubeChannel,
  YouTubeSearchResponse,
  YouTubeSubscriptionsResponse,
} from "@/types";

// Google API response types
interface GoogleSubscriptionItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    resourceId: {
      channelId: string;
    };
    publishedAt: string;
    thumbnails?: {
      default?: { url: string };
    };
  };
}

interface GoogleSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    thumbnails?: {
      medium?: { url: string };
    };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    dislikeCount?: string;
    favoriteCount?: string;
    commentCount?: string;
  };
}

interface GoogleChannelItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails?: {
      default?: { url: string };
    };
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
  };
}

interface GoogleApiResponse<T> {
  items: T[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export class YouTubeAPI {
  private apiKey: string;
  private accessToken: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(apiKey: string, accessToken: string) {
    this.apiKey = apiKey;
    this.accessToken = accessToken;
  }

  private getCacheKey(
    endpoint: string,
    params: Record<string, string>
  ): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, string>
  ): Promise<T> {
    // Check cache first
    const cacheKey = this.getCacheKey(endpoint, params);
    const cachedData = this.getFromCache<T>(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${endpoint}`);
      return cachedData;
    }

    const url = new URL(`${YOUTUBE_API_BASE_URL}${endpoint}`);

    // Add API key and access token to params
    const queryParams = {
      ...params,
      key: this.apiKey,
      access_token: this.accessToken,
    };

    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const startTime = performance.now();
      const response = await fetch(url.toString());
      const endTime = performance.now();

      console.log(
        `API call to ${endpoint} took ${Math.round(endTime - startTime)}ms`
      );

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Cache the response
      this.setCache(cacheKey, data);

      return data as T;
    } catch (error) {
      console.error("YouTube API request failed:", error);
      throw error;
    }
  }

  // Get user's subscriptions
  async getSubscriptions(
    maxResults: number = 50,
    pageToken?: string
  ): Promise<YouTubeSubscriptionsResponse> {
    const params: Record<string, string> = {
      part: "snippet,contentDetails",
      mine: "true",
      maxResults: maxResults.toString(),
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await this.makeRequest<
      GoogleApiResponse<GoogleSubscriptionItem>
    >("/subscriptions", params);

    // Transform the response to match our types
    const transformedResponse: YouTubeSubscriptionsResponse = {
      items: response.items.map((item: GoogleSubscriptionItem) => ({
        id: item.id,
        channelId: item.snippet.resourceId.channelId,
        publishedAt: item.snippet.publishedAt,
        channel: {
          id: item.snippet.resourceId.channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.default?.url || "",
        },
      })),
      nextPageToken: response.nextPageToken,
      pageInfo: response.pageInfo,
    };

    return transformedResponse;
  }

  // Get videos from a specific channel
  async getChannelVideos(
    channelId: string,
    maxResults: number = 50,
    pageToken?: string
  ): Promise<YouTubeSearchResponse> {
    const params: Record<string, string> = {
      part: "snippet",
      channelId,
      order: "date",
      type: "video",
      maxResults: maxResults.toString(),
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await this.makeRequest<
      GoogleApiResponse<GoogleSearchItem>
    >("/search", params);

    // Transform the response to match our types
    const transformedResponse: YouTubeSearchResponse = {
      items: response.items.map((item: GoogleSearchItem) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: response.nextPageToken,
      pageInfo: response.pageInfo,
    };

    return transformedResponse;
  }

  // Search for videos
  async searchVideos(
    query: string,
    maxResults: number = 50,
    pageToken?: string
  ): Promise<YouTubeSearchResponse> {
    const params: Record<string, string> = {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: maxResults.toString(),
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await this.makeRequest<
      GoogleApiResponse<GoogleSearchItem>
    >("/search", params);

    // Transform the response to match our types
    const transformedResponse: YouTubeSearchResponse = {
      items: response.items.map((item: GoogleSearchItem) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
      })),
      nextPageToken: response.nextPageToken,
      pageInfo: response.pageInfo,
    };

    return transformedResponse;
  }

  // Get channel details
  async getChannelDetails(channelId: string): Promise<YouTubeChannel> {
    const params: Record<string, string> = {
      part: "snippet,statistics",
      id: channelId,
    };

    const response = await this.makeRequest<
      GoogleApiResponse<GoogleChannelItem>
    >("/channels", params);

    if (!response.items || response.items.length === 0) {
      throw new Error("Channel not found");
    }

    const channel = response.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails?.default?.url || "",
      subscriberCount: channel.statistics?.subscriberCount,
      videoCount: channel.statistics?.videoCount,
    };
  }

  // Get video details by ID
  async getVideoDetails(videoId: string): Promise<GoogleSearchItem> {
    const params: Record<string, string> = {
      part: "snippet,statistics",
      id: videoId,
    };
    const response = await this.makeRequest<
      GoogleApiResponse<GoogleSearchItem>
    >("/videos", params);
    if (!response.items || response.items.length === 0)
      throw new Error("Video not found");
    return response.items[0];
  }
}

// Create a singleton instance
let youtubeAPIInstance: YouTubeAPI | null = null;

export const createYouTubeAPI = (
  apiKey: string,
  accessToken: string
): YouTubeAPI => {
  if (!youtubeAPIInstance) {
    youtubeAPIInstance = new YouTubeAPI(apiKey, accessToken);
  }
  return youtubeAPIInstance;
};

export const getYouTubeAPI = (): YouTubeAPI | null => {
  return youtubeAPIInstance;
};
