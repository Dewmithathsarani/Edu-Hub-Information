import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Edu Hub | Premium Learning Platform for Sri Lankan A/L Students',
  description: 'Access curated study materials, participate in interactive quizzes, join study groups, and track your progress with our premium educational platform.',
  keywords: ['A/L', 'Sri Lanka', 'Education', 'Physics', 'Chemistry', 'Combined Maths', 'Biology', 'Past Papers', 'Quizzes'],
  openGraph: {
    title: 'Edu Hub - Premium A/L Learning Platform',
    description: 'Master your Advanced Level exams with interactive quizzes, past papers, and study groups.',
    type: 'website',
    locale: 'en_LK',
    siteName: 'Edu Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edu Hub - Premium A/L Learning Platform',
    description: 'Master your Advanced Level exams with interactive quizzes, past papers, and study groups.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Edu Hub",
              "description": "Premium Learning Platform for Sri Lankan A/L Students",
              "url": "https://eduhub.lk",
              "sameAs": [
                "https://facebook.com/eduhublk",
                "https://twitter.com/eduhublk"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
            <QueryProvider>
              {children}
              <Toaster position="top-right" />
            </QueryProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
