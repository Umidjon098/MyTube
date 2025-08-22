'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';
import { VideoCard } from '@/components/VideoCard';
import { useVideoSearch } from '@/hooks/useYouTube';
import { YouTubeVideo } from '@/types';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { ErrorFallback, EmptyState } from '@/components/ErrorFallback';
import { VideoCardSkeleton } from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useVideoSearch(searchQuery, searchQuery.length > 0);
  const toast = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleVideoClick = (video: YouTubeVideo) => {
    router.push(`/watch/${video.id}`);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Mock data for development
  const mockVideos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
      description: 'The official music video for "Never Gonna Give You Up" by Rick Astley',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      channelTitle: 'Rick Astley',
      channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      publishedAt: '2009-10-25T07:12:57Z',
    },
    {
      id: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
      description: 'PSY - &apos;GANGNAM STYLE(강남스타일)&apos; M/V',
      thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg',
      channelTitle: 'officialpsy',
      channelId: 'UCrDkAvwZ2-2H0dZJc-mGpXg',
      publishedAt: '2012-07-15T07:12:57Z',
    },
  ];

  const allVideos = data?.pages.flatMap(page => page.items) || mockVideos;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Videos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Find the videos you&apos;re looking for on YouTube
        </p>
        
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for videos..."
          className="max-w-2xl"
        />
      </div>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Search results for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {isLoading && searchQuery ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <VideoCardSkeleton count={8} />
        </div>
      ) : error ? (
        <ErrorFallback 
          error={error.message || 'Failed to search videos'} 
          onRetry={() => {
            refetch();
            toast.info('Retrying search...', `Searching again for "${searchQuery}"`);
          }}
          showHomeButton={false}
        />
      ) : allVideos.length === 0 && searchQuery ? (
        <EmptyState
          icon={SearchIcon}
          title="No videos found"
          description="Try adjusting your search terms or browse popular videos instead."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={handleVideoClick}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 text-center">
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
                  'Load More Videos'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {!searchQuery && (
        <div className="mt-12 text-center">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start searching
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search term above to find videos on YouTube
          </p>
        </div>
      )}
    </div>
  );
}
