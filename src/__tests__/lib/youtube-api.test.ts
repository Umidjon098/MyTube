import { YouTubeAPI } from '@/lib/youtube-api';

// Mock fetch globally
global.fetch = jest.fn();

describe('YouTubeAPI', () => {
  let api: YouTubeAPI;
  const mockApiKey = 'test-api-key';
  const mockAccessToken = 'test-access-token';

  beforeEach(() => {
    api = new YouTubeAPI(mockApiKey, mockAccessToken);
    jest.clearAllMocks();
  });

  describe('getSubscriptions', () => {
    it('should fetch subscriptions successfully', async () => {
      const mockResponse = {
        items: [
          {
            id: 'sub1',
            snippet: {
              title: 'Test Channel',
              description: 'Test Description',
              resourceId: { channelId: 'channel1' },
              publishedAt: '2023-01-01T00:00:00Z',
              thumbnails: { default: { url: 'https://example.com/thumb.jpg' } }
            }
          }
        ],
        nextPageToken: 'next-token',
        pageInfo: { totalResults: 1, resultsPerPage: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getSubscriptions();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('subscriptions')
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0].channel.title).toBe('Test Channel');
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(api.getSubscriptions()).rejects.toThrow('YouTube API error: 400 Bad Request');
    });
  });

  describe('searchVideos', () => {
    it('should search videos successfully', async () => {
      const mockResponse = {
        items: [
          {
            id: { videoId: 'video1' },
            snippet: {
              title: 'Test Video',
              description: 'Test Description',
              channelTitle: 'Test Channel',
              channelId: 'channel1',
              publishedAt: '2023-01-01T00:00:00Z',
              thumbnails: { medium: { url: 'https://example.com/thumb.jpg' } }
            }
          }
        ],
        nextPageToken: 'next-token',
        pageInfo: { totalResults: 1, resultsPerPage: 1 }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.searchVideos('test query');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search')
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe('Test Video');
    });
  });

  describe('getChannelDetails', () => {
    it('should fetch channel details successfully', async () => {
      const mockResponse = {
        items: [
          {
            id: 'channel1',
            snippet: {
              title: 'Test Channel',
              description: 'Test Description',
              thumbnails: { default: { url: 'https://example.com/thumb.jpg' } }
            },
            statistics: {
              subscriberCount: '1000000',
              videoCount: '500'
            }
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getChannelDetails('channel1');

      expect(result.title).toBe('Test Channel');
      expect(result.subscriberCount).toBe('1000000');
    });

    it('should throw error when channel not found', async () => {
      const mockResponse = { items: [] };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await expect(api.getChannelDetails('nonexistent')).rejects.toThrow('Channel not found');
    });
  });
});
