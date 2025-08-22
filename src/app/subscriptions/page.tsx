'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChannelCard } from '@/components/ChannelCard';
import { useSubscriptions } from '@/hooks/useYouTube';
import { useAuth } from '@/contexts/AuthContext';
import { YouTubeChannel } from '@/types';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ChannelCardSkeleton } from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';
import { usePagePerformance } from '@/hooks/usePerformance';

export default function SubscriptionsPage() {
  usePagePerformance('Subscriptions Page');
  
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { data: subscriptions, isLoading: subscriptionsLoading, error, refetch } = useSubscriptions(isAuthenticated);
  const toast = useToast();

  const handleChannelClick = (channel: YouTubeChannel) => {
    router.push(`/channel/${channel.id}`);
  };

  const handleLogin = async () => {
    await login();
  };

  // Mock data for development (when not authenticated)
  const mockSubscriptions = [
    {
      id: '1',
      channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
      channel: {
        id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
        title: 'PewDiePie',
        description: 'I make videos.',
        thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQvCw3qJryPJjhkuvf9c3qbVo5J8u47S9HwT15q=s176-c-k-c0x00ffffff-no-rj',
        subscriberCount: '111000000',
        videoCount: '4500',
      },
      publishedAt: '2020-01-01T00:00:00Z',
    },
    {
      id: '2',
      channelId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
      channel: {
        id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
        title: 'MrBeast',
        description: 'I make the best videos on YouTube!',
        thumbnail: 'https://yt3.googleusercontent.com/0AiCwdGLLpTVne88j_9ve7lQ9QPI28ZNuLBrV-yzl_CIj1E4E8YJqNaC8TzDgM6cpH9Nkq=s176-c-k-c0x00ffffff-no-rj',
        subscriberCount: '200000000',
        videoCount: '800',
      },
      publishedAt: '2020-01-01T00:00:00Z',
    },
  ];

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Sign in to view your subscriptions
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You need to sign in with your Google account to access your YouTube subscriptions.
        </p>
        <button 
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In with Google
        </button>
        
        {/* Show mock data for development */}
        <div className="mt-12">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Development Preview (Mock Data)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSubscriptions.map((subscription) => (
              <ChannelCard
                key={subscription.id}
                channel={subscription.channel}
                onClick={handleChannelClick}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching subscriptions
  if (subscriptionsLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your subscriptions...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChannelCardSkeleton count={6} />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Subscriptions
          </h1>
        </div>
        <ErrorFallback 
          error={error.message || 'Failed to load your subscriptions'} 
          onRetry={() => {
            refetch();
            toast.info('Retrying...', 'Attempting to reload your subscriptions');
          }}
        />
      </div>
    );
  }

  // Show real subscriptions data
  const displaySubscriptions = subscriptions?.items || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Subscriptions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {displaySubscriptions.length} channels you&apos;re subscribed to
        </p>
      </div>

      {displaySubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No subscriptions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            It looks like you don&apos;t have any YouTube channel subscriptions yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySubscriptions.map((subscription) => (
            <ChannelCard
              key={subscription.id}
              channel={subscription.channel}
              onClick={handleChannelClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
