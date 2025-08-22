import Link from 'next/link';
import { Users, Search, Play } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Your Subscriptions',
      description: 'View all your YouTube channel subscriptions in one place',
      icon: Users,
      href: '/subscriptions',
      color: 'bg-blue-500',
    },
    {
      title: 'Search Videos',
      description: 'Search for any YouTube video with our powerful search',
      icon: Search,
      href: '/search',
      color: 'bg-green-500',
    },
    {
      title: 'Watch Videos',
      description: 'Enjoy videos in a distraction-free environment',
      icon: Play,
      href: '/search',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to MyTube
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your private YouTube experience. Access your subscriptions, search videos, and watch without distractions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/subscriptions"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Users className="w-5 h-5 mr-2" />
            View Subscriptions
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Videos
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className={`inline-flex p-3 rounded-lg text-white mb-4 ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Getting Started */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Getting Started
        </h2>
        <div className="space-y-3 text-blue-800 dark:text-blue-200">
          <p>1. Sign in with your Google account to access your YouTube data</p>
          <p>2. View your subscribed channels on the Subscriptions page</p>
          <p>3. Click on any channel to see their latest videos</p>
          <p>4. Use the search function to find specific videos</p>
          <p>5. Enjoy watching videos in a clean, distraction-free interface</p>
        </div>
      </div>
    </div>
  );
}
