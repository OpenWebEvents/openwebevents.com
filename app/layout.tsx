import { GeistSans } from "geist/font/sans";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import ModeToggle from "@/components/mode-toggle";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Open Web Events | Fostering Open-Source Community",
  description:
    "Open Web Events brings together enthusiasts, developers, and thought leaders to collaborate and drive the future of open-source technologies.",
  keywords: [
    "open-source",
    "web development",
    "community",
    "events",
    "conference",
  ],
  openGraph: {
    title: "Open Web Events | Fostering Open-Source Community",
    description:
      "Join our vibrant community centered around open-source initiatives and the open web.",
    url: "https://www.openwebevents.com",
    siteName: "Open Web Events",
    images: [
      {
        url: "https://www.openwebevents.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Web Events | Fostering Open-Source Community",
    description:
      "Join our vibrant community centered around open-source initiatives and the open web.",
    images: ["https://www.openwebevents.com/twitter-image.jpg"],
    creator: "@OpenWebEvents",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="container mx-auto p-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold hover:text-primary transition-colors"
              aria-label="Open Web Events - Home"
            >
              Open Web Events
            </Link>
            <ModeToggle />
          </header>
          <main className="bg-gradient-to-b from-background to-muted">
            {children}
          </main>
          <footer className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-muted-foreground">
              <div>
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://openwebevents.com"
                  className="text-primary hover:underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Web Events
                </a>
                . All rights reserved.
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <Link
                  href="/privacy-policy"
                  className="hover:underline hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/code-of-conduct"
                  className="hover:underline hover:text-primary transition-colors"
                >
                  Code of Conduct
                </Link>
              </div>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
