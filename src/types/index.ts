// YouTube API Types
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount?: string;
  videoCount?: string;
}

export interface YouTubeSubscription {
  id: string;
  channelId: string;
  channel: YouTubeChannel;
  publishedAt: string;
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeSubscriptionsResponse {
  items: YouTubeSubscription[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface VideoCardProps {
  video: YouTubeVideo;
  onClick?: (video: YouTubeVideo) => void;
}

export interface ChannelCardProps {
  channel: YouTubeChannel;
  onClick?: (channel: YouTubeChannel) => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
