# Quick Share Server

The backend redirection service for Quick Share - an Express.js server that handles URL redirects and content proxying.

## Overview

This is the server component of Quick Share, responsible for handling short URL redirects and proxying content from Supabase storage. It provides a lightweight, efficient service that translates short URLs into their corresponding long URLs and serves files.

## Features

- URL redirection with database lookup
- Supabase content proxying
- Custom landing page for invalid/missing slugs
- Static file serving
- CORS enabled for cross-origin requests
- PostgreSQL database integration via Prisma

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Database ORM**: Prisma Client
- **Database**: PostgreSQL

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (shared with dashboard)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables by creating a `.env` file:
```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3001
```

3. Generate Prisma client:
```bash
npx prisma generate
```

The database schema should already exist from the dashboard setup. If not, push the schema:
```bash
npx prisma db push
```

## Running the Server

### Development
```bash
node server.mjs
```

### Production
```bash
NODE_ENV=production node server.mjs
```

The server will start on the configured PORT (default: 3001 or as specified in environment).

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static files
├── server.mjs           # Main server application
├── vercel.json         # Vercel deployment config
└── package.json        # Dependencies and scripts
```

## API Endpoints

### GET /

Landing page route that displays a welcome message.

**Response:**
- HTML page with welcome message and branding

### GET /:slug

Redirect route that handles short URL lookups.

**Parameters:**
- `slug` (string) - The short URL identifier

**Behavior:**
1. Looks up the slug in the database
2. If found:
   - For Supabase URLs: Proxies the content with original headers
   - For other URLs: Performs a 302 redirect
3. If not found: Returns 404 error page

**Response Codes:**
- `200` - Successful proxy (Supabase content)
- `302` - Redirect to target URL
- `400` - Missing slug parameter
- `404` - Slug not found in database
- `500` - Server error

**Examples:**
```bash
# Redirect example
GET /abc123
-> 302 Redirect to https://example.com

# Supabase proxy example
GET /file456
-> 200 with proxied file content
```

## Database Schema

The server uses the same PostgreSQL database as the dashboard:

```prisma
model shortUrl {
  id        String   @id @default(cuid())
  shortUrl  String   @unique
  longUrl   String
  createdAt DateTime @default(now())
}
```

## Features in Detail

### URL Redirection

When a request is made to `/:slug`:
1. The server queries the database for the matching `shortUrl`
2. If found, it retrieves the corresponding `longUrl`
3. For non-Supabase URLs, it sends a 302 redirect
4. For Supabase URLs, it proxies the content

### Supabase Content Proxying

The server includes special handling for Supabase URLs:
- Detects URLs with `.supabase.co` hostname
- Proxies the request using Node.js http/https modules
- Preserves original response headers
- Streams content directly to the client
- Handles errors gracefully

This allows serving files directly without exposing Supabase storage URLs.

### Static File Serving

The server serves static files from the `public/` directory:
- Place any static assets in `public/`
- Access them via `http://your-domain/filename`

### Error Handling

Custom error pages for:
- Invalid slugs
- Missing slugs
- Server errors
- Proxy failures

All error pages maintain consistent branding with the landing page.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `PORT` | Port number for the server | No | 3001 |

## Deployment

### Vercel (Recommended)

The server includes a `vercel.json` configuration for deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `server`
4. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
5. Deploy

The `vercel.json` configures:
- Entry point as `server.mjs`
- Routes for serverless function handling

### Other Platforms

Deploy to any Node.js hosting service:

**Railway:**
```bash
railway up
```

**Render:**
1. Connect your repository
2. Set build command: `npm install`
3. Set start command: `node server.mjs`
4. Add environment variables

**DigitalOcean App Platform:**
1. Create a new app from GitHub
2. Set run command: `node server.mjs`
3. Configure environment variables

**Traditional VPS (Ubuntu):**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repository-url>
cd server
npm install
npx prisma generate

# Run with PM2
npm install -g pm2
pm2 start server.mjs --name quickshare-server
pm2 save
pm2 startup
```

## Configuration

### CORS

CORS is enabled via the `cors` middleware. To configure:

```javascript
import cors from 'cors';

app.use(cors({
  origin: 'https://your-dashboard-domain.com',
  methods: ['GET'],
  credentials: true
}));
```

### Custom Domain

When using a custom domain:
1. Point your domain's DNS to your server
2. Set up SSL/TLS certificate (Let's Encrypt recommended)
3. Configure reverse proxy (Nginx/Caddy) if needed
4. Update dashboard to use your custom domain

## Monitoring

### Logging

Add logging for production:
```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

### Health Check

Add a health check endpoint:
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

## Performance Optimization

### Caching

Implement caching for database queries:
```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 });
```

### Database Connection Pooling

Prisma handles connection pooling automatically. Configure in schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 10
}
```

### Rate Limiting

Add rate limiting to prevent abuse:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## Security

### Best Practices

- Keep dependencies updated
- Use environment variables for secrets
- Enable HTTPS in production
- Implement rate limiting
- Validate and sanitize input
- Use security headers:

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### Database Security

- Use strong database passwords
- Restrict database access by IP
- Enable SSL for database connections
- Regular backups

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :3001
# Kill the process
kill -9 <PID>
```

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure firewall allows connections
- Test connection: `psql <DATABASE_URL>`

**Prisma errors:**
```bash
# Regenerate client
npx prisma generate

# Reset database (caution: deletes data)
npx prisma migrate reset
```

**Module errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development

### Hot Reload

Use nodemon for development:
```bash
npm install -D nodemon
npx nodemon server.mjs
```

### Testing

Test the server:
```bash
# Test landing page
curl http://localhost:3001

# Test redirect (replace abc123 with actual slug)
curl -I http://localhost:3001/abc123
```

### Debugging

Enable debug logging:
```bash
DEBUG=* node server.mjs
```

## Contributing

Contributions welcome! Please:
1. Follow existing code style
2. Add error handling for new features
3. Test thoroughly before submitting
4. Update documentation

## Support

For issues or questions:
- Check the troubleshooting section
- Review the main project README
- Open an issue on GitHub

## License

MIT License - see main project README for details.
