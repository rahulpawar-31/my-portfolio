import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";
import BackToTop from "@/components/BackToTop";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, GITHUB_URL, LINKEDIN_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Rahul — Next.js Developer",
  description: "Portfolio of Rahul, a Next.js developer building modern web applications. View my projects, skills and get in touch.",
  keywords: ["Next.js", "React", "Portfolio", "Full Stack Developer", "Rahul"],
  authors: [{ name: AUTHOR_NAME }],
  openGraph: {
    title: "Rahul — Next.js Developer",
    description: "Portfolio of Rahul, a Next.js developer building modern web applications.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul — Next.js Developer",
    description: "Portfolio of Rahul, a Next.js developer building modern web applications.",
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  url: SITE_URL,
  jobTitle: "Full Stack Developer",
  sameAs: [GITHUB_URL, LINKEDIN_URL],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <PageLoader />
            <CustomCursor />
            <Navbar />
            {children}
            <BackToTop />
          </MotionConfig>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
