import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Home } from "lucide-react";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Dashboard",
  description: "Main Dashboard protected by Supabase Auth",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 backdrop-blur-lg bg-background/80">
              <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                  <HeaderAuth />
                  <ThemeSwitcher />
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="container py-6 md:py-10">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
