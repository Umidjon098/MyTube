# MyTube - Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Configure environment variables (see below)

3. **Environment Variables in Vercel**
   Add these in your Vercel project settings:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://yourdomain.vercel.app/auth/callback
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Update Google OAuth Settings**
   - Go to Google Cloud Console
   - Update authorized redirect URIs to include your Vercel domain
   - Add: `https://yourdomain.vercel.app/auth/callback`

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Same as Vercel
4. **Redirects**: Create `_redirects` file for SPA routing

### Option 3: Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   
   COPY package.json package-lock.json* ./
   RUN npm ci --only=production
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**:
   ```bash
   docker build -t mytube .
   docker run -p 3000:3000 mytube
   ```

## 🔧 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] YouTube API quotas sufficient
- [ ] Build passes without errors
- [ ] Tests pass (if implemented)
- [ ] Performance optimized
- [ ] Security headers configured

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (optional)
2. **Configure DNS**
   - Point A record to your hosting provider
   - Configure CNAME for www subdomain

3. **Update Environment Variables**
   - Update `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`
   - Update Google OAuth settings

### SSL Certificate

Most hosting providers (Vercel, Netlify) provide automatic SSL certificates.

## 📊 Monitoring and Analytics

### Performance Monitoring

The app includes built-in performance monitoring:
- Page load time tracking
- API call duration logging
- Console warnings for slow operations

### Production Recommendations

1. **Enable Analytics**
   - Google Analytics
   - Vercel Analytics
   - Custom performance tracking

2. **Error Monitoring**
   - Sentry for error tracking
   - LogRocket for user session replay

3. **Uptime Monitoring**
   - Pingdom
   - UptimeRobot

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different API keys for development and production
- Regularly rotate API keys

### OAuth Security
- Use HTTPS in production
- Validate state parameters
- Implement CSRF protection

### API Security
- Rate limiting on API routes
- Input validation
- Proper error handling without exposing sensitive information

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Fails**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Check environment variables

2. **OAuth Not Working**
   - Verify redirect URIs match exactly
   - Check environment variables
   - Ensure HTTPS in production

3. **YouTube API Errors**
   - Check API quotas
   - Verify API key permissions
   - Check access token validity

### Performance Issues

1. **Slow Loading**
   - Check bundle size
   - Optimize images
   - Enable caching

2. **API Timeouts**
   - Implement retry logic
   - Add request timeouts
   - Cache API responses

## 📈 Scaling Considerations

### Database
- Consider adding a database for user preferences
- Cache YouTube API responses
- Store user subscription data

### CDN
- Use CDN for static assets
- Cache API responses at edge locations
- Optimize image delivery

### Monitoring
- Set up application monitoring
- Track user engagement
- Monitor API usage quotas
