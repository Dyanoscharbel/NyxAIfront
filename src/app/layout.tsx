import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExoPlanet AI - Exoplanet Classification",
  description: "Exoplanet classification application using NASA Kepler mission data with advanced AI technology",
  keywords: "exoplanets, NASA, Kepler, artificial intelligence, classification, space, astronomy",
  authors: [{ name: "ExoPlanet AI Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined') {
                  const theme = localStorage.getItem('theme') || 'dark';
                  const locale = localStorage.getItem('locale') || 'fr';
                  document.documentElement.className = theme;
                  document.documentElement.lang = locale;
                }
              } catch (e) {
                document.documentElement.className = 'dark';
                document.documentElement.lang = 'fr';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
