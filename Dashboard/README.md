# URL Shortener Dashboard

A modern web dashboard built with Next.js for managing shortened URLs and much more.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- Vercel (Deployment)

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file with the following variables:

```bash
# Add your environment variables here
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure

- `app/` - Next.js app directory containing routes and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations
- `utils/` - Helper functions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
