# Quick Share

A full-stack web application for URL shortening and file sharing, featuring a modern Next.js dashboard and Express.js redirection service.

## Overview

Quick Share is a self-hosted platform that combines URL shortening with file sharing capabilities. The application consists of two main components:

- **Dashboard**: A Next.js web application for managing shortened URLs and sharing files
- **Server**: An Express.js service that handles URL redirects and serves files

## Features

- URL shortening with custom slugs
- File sharing with direct links
- User authentication and authorization
- Modern, responsive UI with dark mode support
- Real-time URL management dashboard
- Supabase integration for file storage
- PostgreSQL database with Prisma ORM

## Tech Stack

### Dashboard (Frontend)
- Next.js 14+ (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Supabase (Authentication & Storage)
- Prisma Client
- next-themes (Dark mode)

### Server (Backend)
- Express.js 5
- Prisma ORM
- PostgreSQL
- CORS enabled

## Project Structure

```
.
├── dashboard/          # Next.js frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── lib/           # Utility libraries
│   ├── prisma/        # Database schema
│   └── utils/         # Helper functions
├── server/            # Express.js backend service
│   ├── public/        # Static files
│   ├── prisma/        # Database schema
│   └── server.mjs     # Main server file
└── Files/             # File storage directory
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for authentication and storage)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Dashboard
```

### 2. Database Setup

Create a PostgreSQL database for your application. You'll need the connection string in the format:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 3. Dashboard Setup

Navigate to the dashboard directory and install dependencies:

```bash
cd dashboard
npm install
```

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd ../server
npm install
```

Create a `.env` file with your database connection:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Generate Prisma client:

```bash
npx prisma generate
```

## Running the Application

### Development Mode

**Dashboard:**
```bash
cd dashboard
npm run dev
```
The dashboard will be available at `http://localhost:3000`

**Server:**
```bash
cd server
node server.mjs
```
The server will run on its configured port (default: 3001 or as specified)

### Production Build

**Dashboard:**
```bash
cd dashboard
npm run build
npm start
```

**Server:**
```bash
cd server
node server.mjs
```

## Environment Variables

### Dashboard (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

### Server (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Server port (optional) | No |

## Database Schema

The application uses a shared PostgreSQL database with the following schema:

```prisma
model shortUrl {
  id        String   @id @default(cuid())
  shortUrl  String   @unique
  longUrl   String
  createdAt DateTime @default(now())
}
```

## Features Guide

### URL Shortening

1. Log in to the dashboard
2. Navigate to the URL management page
3. Enter your long URL and optional custom slug
4. Copy the generated short URL
5. The server will redirect visitors from the short URL to the long URL

### File Sharing

1. Log in to the dashboard
2. Navigate to the file sharing section
3. Upload your file to Supabase storage
4. Share the generated link with others

## Deployment

### Dashboard (Vercel)

The dashboard is configured for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `dashboard`
4. Add environment variables in Vercel dashboard
5. Deploy

### Server (Vercel)

The server is configured for Vercel deployment with a `vercel.json` configuration:

1. Push your code to GitHub
2. Import the project in Vercel (separate project)
3. Set the root directory to `server`
4. Add environment variables in Vercel dashboard
5. Deploy

Alternatively, deploy to any Node.js hosting provider (Railway, Render, DigitalOcean, etc.)

## API Endpoints

### Server Endpoints

- `GET /` - Landing page
- `GET /:slug` - Redirect to long URL or proxy Supabase content

## Development

### Available Scripts (Dashboard)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Available Scripts (Server)

- `node server.mjs` - Start server
- `npm run postinstall` - Generate Prisma client

## Security Considerations

- Keep your `.env` and `.env.local` files secure and never commit them
- Rotate Supabase keys regularly
- Use strong database passwords
- Enable Row Level Security (RLS) in Supabase
- Consider implementing rate limiting for production
- Use HTTPS in production

## Troubleshooting

### Common Issues

**Prisma Client not generated:**
```bash
npx prisma generate
```

**Database connection errors:**
- Verify your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall settings

**Supabase errors:**
- Verify your Supabase credentials
- Check project status in Supabase dashboard
- Ensure storage buckets are created and public

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
