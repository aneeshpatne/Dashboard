# Dashboard - Full-Stack Web Application

A modern, full-featured dashboard application built with Next.js, featuring user authentication, URL shortening, file sharing capabilities, and a clean, responsive UI.

## 🚀 Features

- **Authentication System**: Complete user authentication with Supabase Auth
  - Sign up / Sign in
  - Password reset functionality
  - Protected routes and middleware
- **URL Shortener**: Create and manage shortened URLs
  - Custom short URL creation
  - URL management dashboard
  - Real-time search and filtering
- **File Sharing**: Secure file sharing capabilities
  - Upload and share files
  - Real-time collaboration features
- **Modern UI/UX**: Beautiful, responsive design
  - Dark/Light theme support
  - Tailwind CSS styling
  - Radix UI components
  - Lucide React icons

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **next-themes** - Theme switching

### Backend

- **Supabase** - Authentication and real-time database
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Express.js** - Server framework (separate server)

### Development Tools

- **Prettier** - Code formatting
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Project Structure

```
Dashboard/
├── app/                    # Next.js App Router
│   ├── (auth-pages)/      # Authentication pages
│   ├── api/               # API routes
│   ├── auth/              # Auth callbacks
│   ├── dashboard/         # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   └── tutorial/         # Tutorial components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── utils/                # Utility functions
server/                   # Express.js backend server
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Dashboard
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd Dashboard
   npm install

   # Backend server
   cd ../server
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the `Dashboard` directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Database Setup**

   ```bash
   # Run Prisma migrations
   cd Dashboard
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**

   ```bash
   # Frontend (Next.js)
   cd Dashboard
   npm run dev

   # Backend server (in another terminal)
   cd server
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Authentication

1. Navigate to `/sign-up` to create a new account
2. Use `/sign-in` to log into existing accounts
3. Access `/forgot-password` to reset passwords

### Dashboard Features

1. **Main Dashboard**: Overview of available features
2. **URL Shortener**: Create and manage shortened URLs
3. **File Sharing**: Upload and share files securely
4. **Account Management**: Update passwords and profile settings

## 🔧 API Endpoints

### URL Management

- `GET /api/url` - Retrieve all user URLs
- `POST /api/url` - Create/update short URLs
- `GET /api/url/[slug]` - Redirect to original URL

### Authentication

- `POST /auth/callback` - Supabase auth callback

## 🎨 UI Components

The application uses a modern component library built with:

- **Radix UI** for accessible primitives
- **Tailwind CSS** for styling
- **CVA (Class Variance Authority)** for component variants
- **Lucide React** for icons

Key components include:

- Buttons with multiple variants
- Form inputs and labels
- Dropdown menus
- Checkboxes
- Badge components
- Theme switcher

## 🗄️ Database Schema

The application uses Prisma with PostgreSQL:

```prisma
model shortUrl {
  id        String   @id @default(cuid())
  shortUrl  String   @unique
  longUrl   String
  createdAt DateTime @default(now())
}
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Backend

The Express.js server can be deployed to any Node.js hosting platform:

- Railway
- Render
- DigitalOcean App Platform
- AWS/Google Cloud
