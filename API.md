# MyTube API Documentation

## 🔗 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/google/callback`

Exchange Google OAuth authorization code for access tokens.

**Request Body:**
```json
{
  "code": "google_authorization_code"
}
```

**Response:**
```json
{
  "access_token": "access_token_string",
  "refresh_token": "refresh_token_string",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "https://www.googleapis.com/auth/youtube.readonly"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

#### POST `/api/auth/google/refresh`

Refresh an expired access token using the refresh token.

**Request Body:**
```json
{
  "refresh_token": "refresh_token_string"
}
```

**Response:**
```json
{
  "access_token": "new_access_token_string",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## 🔌 YouTube Data API Integration

### YouTube API Client (`src/lib/youtube-api.ts`)

The `YouTubeAPI` class provides methods to interact with YouTube Data API v3.

#### Methods

##### `getSubscriptions(maxResults?, pageToken?)`
Fetch user's YouTube channel subscriptions.

**Parameters:**
- `maxResults` (optional): Number of results per page (default: 50)
- `pageToken` (optional): Token for pagination

**Returns:** `YouTubeSubscriptionsResponse`

##### `getChannelVideos(channelId, maxResults?, pageToken?)`
Fetch videos from a specific channel.

**Parameters:**
- `channelId`: YouTube channel ID
- `maxResults` (optional): Number of results per page (default: 50)
- `pageToken` (optional): Token for pagination

**Returns:** `YouTubeSearchResponse`

##### `searchVideos(query, maxResults?, pageToken?)`
Search for videos on YouTube.

**Parameters:**
- `query`: Search query string
- `maxResults` (optional): Number of results per page (default: 50)
- `pageToken` (optional): Token for pagination

**Returns:** `YouTubeSearchResponse`

##### `getChannelDetails(channelId)`
Get detailed information about a YouTube channel.

**Parameters:**
- `channelId`: YouTube channel ID

**Returns:** `YouTubeChannel`

### Performance Features

#### Caching
- In-memory cache with 5-minute TTL
- Automatic cache invalidation
- Cache key based on endpoint and parameters

#### Retry Logic
- Automatic retry for network errors (up to 3 attempts)
- Exponential backoff delay
- No retry for authentication errors (401/403)

#### Performance Monitoring
- Request duration logging
- Cache hit/miss tracking
- Slow request warnings (>2s)

## 🎣 React Query Hooks (`src/hooks/useYouTube.ts`)

### Available Hooks

#### `useSubscriptions(enabled?)`
Fetch user's YouTube subscriptions with caching.

**Parameters:**
- `enabled` (optional): Whether to enable the query (default: true)

**Returns:** React Query result with subscriptions data

#### `useChannelVideos(channelId, enabled?)`
Fetch videos from a specific channel with infinite scrolling.

**Parameters:**
- `channelId`: YouTube channel ID
- `enabled` (optional): Whether to enable the query (default: true)

**Returns:** React Query infinite query result

#### `useVideoSearch(query, enabled?)`
Search for videos with infinite scrolling.

**Parameters:**
- `query`: Search query string
- `enabled` (optional): Whether to enable the query (default: true)

**Returns:** React Query infinite query result

#### `useChannelDetails(channelId, enabled?)`
Get channel details with caching.

**Parameters:**
- `channelId`: YouTube channel ID
- `enabled` (optional): Whether to enable the query (default: true)

**Returns:** React Query result with channel data

#### `useIsAuthenticated()`
Check if user is authenticated.

**Returns:** Boolean indicating authentication status

### Query Configuration

All hooks include:
- **Stale Time**: 2-10 minutes depending on data type
- **Cache Time**: 5-30 minutes depending on data type
- **Retry Logic**: Smart retry with exponential backoff
- **Authentication**: Automatic token handling

## 🔐 Authentication Flow

### OAuth 2.0 Flow

1. **Initiate Login**
   - User clicks "Sign In with Google"
   - Generate random state parameter
   - Redirect to Google OAuth URL

2. **Handle Callback**
   - Google redirects to `/auth/callback`
   - Extract authorization code and state
   - Verify state parameter
   - Exchange code for tokens via `/api/auth/google/callback`

3. **Store Tokens**
   - Store access and refresh tokens in localStorage
   - Fetch user profile information
   - Update authentication context

4. **Token Refresh**
   - Automatic refresh when tokens expire
   - Use refresh token via `/api/auth/google/refresh`
   - Update stored tokens

### Security Features

- **State Parameter**: Prevents CSRF attacks
- **Token Expiration**: Automatic token refresh
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **Token Revocation**: Proper logout with token revocation

## 📱 Component Architecture

### Core Components

#### `Layout`
- Main application layout
- Navigation sidebar
- User authentication UI
- Toast notifications integration

#### `VideoCard`
- Displays video information
- Optimized images with Next.js Image
- Click handling for video playback

#### `ChannelCard`
- Displays channel information
- Subscriber and video counts
- Optimized avatar images

#### `SearchBar`
- Debounced search input
- Real-time search suggestions
- Keyboard navigation support

### Error Handling Components

#### `ErrorBoundary`
- Catches React errors
- Displays user-friendly error messages
- Development error details
- Retry and navigation options

#### `ErrorFallback`
- Reusable error display component
- Retry functionality
- Customizable error messages

#### `Toast System`
- Global notification system
- Success, error, warning, info types
- Auto-dismiss functionality
- Accessible design

### Loading Components

#### `LoadingSpinner`
- Configurable size and text
- Consistent loading states

#### `Skeleton Loaders`
- `VideoCardSkeleton`
- `ChannelCardSkeleton`
- Smooth loading transitions

## 🎨 Styling Architecture

### TailwindCSS Configuration
- Dark mode support
- Custom utilities
- Responsive design
- Performance optimized

### Component Styling
- Consistent design system
- Accessible color contrasts
- Smooth animations and transitions
- Mobile-first responsive design

## 🔧 Development Tools

### Testing
- Jest for unit testing
- React Testing Library for component testing
- Test utilities and mocks
- Coverage reporting

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)
- Husky for git hooks (optional)

### Performance
- Next.js Image optimization
- Bundle analysis
- Performance monitoring hooks
- API response caching

## 📊 Monitoring and Analytics

### Built-in Monitoring
- Page load performance tracking
- API call duration monitoring
- Error boundary logging
- Cache hit/miss tracking

### Production Monitoring (Recommended)
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- User analytics (Google Analytics)
- Uptime monitoring

## 🔄 API Rate Limits

### YouTube Data API v3 Quotas
- **Default Quota**: 10,000 units per day
- **Subscription List**: 1 unit per request
- **Video Search**: 100 units per request
- **Channel Details**: 1 unit per request

### Optimization Strategies
- Implement caching to reduce API calls
- Use pagination effectively
- Consider upgrading quota for production
- Monitor usage in Google Cloud Console

## 🛠️ Maintenance

### Regular Tasks
- Monitor API quotas
- Update dependencies
- Check security vulnerabilities
- Review performance metrics

### Backup Strategies
- Environment variable backup
- Database backup (if implemented)
- Code repository backup
- API key rotation plan
