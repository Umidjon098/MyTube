# MyTube - Private Edition

A private web application that allows you to sign in with Google and access your YouTube subscriptions, watch videos from subscribed channels, and search for videos on YouTube.

## Features

- 🔐 **Google OAuth 2.0 Authentication** - Secure sign-in with your Google account
- 📺 **YouTube Subscriptions** - View all your subscribed channels
- 🎥 **Channel Videos** - Browse videos from specific channels
- 🔍 **Video Search** - Search for any YouTube video
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🚀 **Modern Tech Stack** - Built with Next.js 14, TypeScript, and TailwindCSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React 18
- **Styling**: TailwindCSS
- **State Management**: React Query (TanStack Query)
- **Authentication**: Google OAuth 2.0
- **API**: YouTube Data API v3
- **Icons**: Lucide React

## Prerequisites

Before running this project, you'll need:

1. **Node.js 18+** and npm
2. **Google Cloud Console** account with YouTube Data API v3 enabled
3. **Google OAuth 2.0** credentials

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd MyTube
npm install
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: MyTube
   - User support email: your-email@domain.com
   - Developer contact information: your-email@domain.com
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`
   - Note down your **Client ID** and **Client Secret**

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# YouTube API Configuration
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Note**: The `NEXT_PUBLIC_` prefix makes variables available in the browser. Only use it for non-sensitive data.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── auth/google/   # OAuth endpoints
│   ├── auth/              # Authentication pages
│   ├── channel/           # Channel videos page
│   ├── search/            # Video search page
│   ├── subscriptions/     # Subscriptions page
│   └── watch/             # Video player page
├── components/             # Reusable UI components
├── contexts/               # React contexts (Auth)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
└── types/                  # TypeScript type definitions
```

## Authentication Flow

1. User clicks "Sign In with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/auth/callback` with authorization code
5. Backend exchanges code for access/refresh tokens
6. User is authenticated and can access YouTube data

## API Endpoints

- `POST /api/auth/google/callback` - Exchange OAuth code for tokens
- `POST /api/auth/google/refresh` - Refresh expired access token

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create new page in `src/app/`
2. Add components in `src/components/`
3. Create hooks in `src/hooks/`
4. Add types in `src/types/`

## Security Considerations

- OAuth tokens are stored securely in localStorage
- Client secrets are never exposed to the browser
- All API calls are made server-side for sensitive operations
- State parameter prevents CSRF attacks

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

1. Build the project: `npm run build`
2. Start the server: `npm run start`
3. Set environment variables on your hosting platform

## Troubleshooting

### Common Issues

1. **"OAuth configuration error"**
   - Check that all environment variables are set correctly
   - Verify Google OAuth credentials are valid

2. **"YouTube API error"**
   - Ensure YouTube Data API v3 is enabled
   - Check your API key is valid and has quota remaining

3. **Authentication not working**
   - Verify redirect URI matches exactly in Google Console
   - Check browser console for errors

### Getting Help

- Check the browser console for error messages
- Verify all environment variables are set
- Ensure Google Cloud Console configuration is correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for personal use only. Please respect YouTube's Terms of Service and API usage limits.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review Google Cloud Console documentation
- Check YouTube Data API v3 documentation
