# Quick Share Dashboard

The frontend application for Quick Share - a modern web dashboard for URL shortening and file sharing built with Next.js.

## Overview

This is the dashboard component of Quick Share, providing a user-friendly interface for managing shortened URLs and sharing files. It features authentication, a modern UI with dark mode, and seamless integration with Supabase for storage and authentication.

## Features

- User authentication (login, signup, password reset)
- URL shortening with custom slug support
- File sharing with Supabase storage
- Responsive design with mobile support
- Dark mode / Light mode toggle
- Real-time data synchronization
- Server-side rendering with Next.js App Router

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Database ORM**: Prisma Client
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Theme**: next-themes
- **Icons**: lucide-react

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database
- Supabase project

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables by creating a `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
dashboard/
├── app/                    # Next.js app directory
│   ├── (auth-pages)/      # Authentication pages group
│   ├── api/               # API routes
│   ├── auth/              # Auth-related routes
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── filesharing/   # File sharing feature
│   │   └── page.tsx       # Main dashboard page
│   ├── actions.ts         # Server actions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Library code and configurations
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── utils/                # Utility functions
├── middleware.ts         # Next.js middleware (auth)
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API
3. Copy the Project URL and anon/public key
4. Add these to your `.env.local` file
5. Set up storage buckets for file sharing
6. Configure authentication providers as needed

### Database Setup

The application uses PostgreSQL via Prisma. The schema includes:

- `shortUrl` model for storing URL mappings

To modify the schema:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Run `npx prisma generate` to update the client

### Authentication

Authentication is handled by Supabase Auth with middleware protection. The middleware (`middleware.ts`) protects routes that require authentication.

Protected routes:
- `/dashboard` - Main dashboard
- `/dashboard/filesharing` - File sharing interface

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL from Project Settings > API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `dashboard`
4. Add environment variables in the Vercel dashboard
5. Deploy

The project includes optimized configuration for Vercel deployment.

### Other Platforms

The dashboard can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

Ensure you set the correct build command (`npm run build`) and output directory (`.next`).

## Features Guide

### URL Management

The main dashboard provides:
- List of all shortened URLs
- Create new short URLs with custom slugs
- View creation dates and analytics
- Copy short URLs to clipboard
- Delete URLs

### File Sharing

The file sharing feature allows:
- Upload files to Supabase storage
- Generate shareable links
- View upload history
- Download shared files

## Styling

The application uses Tailwind CSS with a custom configuration:
- Custom color palette
- Dark mode support via next-themes
- Responsive breakpoints
- Custom animations via tailwindcss-animate
- Utility classes via tailwind-merge and clsx

Modify `tailwind.config.ts` to customize the theme.

## Components

The project uses Radix UI primitives for accessible, unstyled components:
- Checkbox
- Dropdown Menu
- Label
- Slot

Custom components are built on top of these primitives in the `components/` directory.

## Troubleshooting

### Build Errors

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Prisma errors:**
```bash
npx prisma generate
```

### Runtime Errors

**Supabase connection issues:**
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure NEXT_PUBLIC_ prefix for client-side variables

**Database connection errors:**
- Verify DATABASE_URL format
- Check PostgreSQL server is running
- Ensure database exists and is accessible

**Authentication issues:**
- Clear browser cookies and local storage
- Verify Supabase Auth is enabled
- Check middleware configuration

## Development Best Practices

- Use TypeScript for type safety
- Follow React Server Components patterns
- Leverage Server Actions for mutations
- Implement proper error boundaries
- Use loading states for async operations
- Optimize images with next/image
- Enable ESLint and follow conventions

## Performance Optimization

- Images are optimized via Next.js Image component
- Server-side rendering for initial page loads
- Client-side navigation for subsequent routes
- Code splitting via dynamic imports
- CSS optimization via Tailwind purge

## Security

- Environment variables are validated
- Authentication is required for protected routes
- CORS is configured on the server
- Supabase Row Level Security (RLS) should be enabled
- Input validation on forms
- HTTPS enforced in production

## Contributing

Contributions are welcome! Please:
1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## Support

For issues or questions:
- Check existing documentation
- Review troubleshooting section
- Open an issue on GitHub

## License

MIT License - see main project README for details.
