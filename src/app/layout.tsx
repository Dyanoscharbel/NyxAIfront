import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
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
  title: "Exoscope - Exoplanet Classification",
  description: "Exoplanet classification application using NASA Kepler mission data with advanced AI technology",
  keywords: "exoplanets, NASA, Kepler, artificial intelligence, classification, space, astronomy",
  authors: [{ name: "Exoscope Team" }],
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
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined') {
                  const theme = localStorage.getItem('theme') || 'light';
                  const locale = localStorage.getItem('locale') || 'en';
                  document.documentElement.className = theme;
                  document.documentElement.lang = locale;
                }
              } catch (e) {
                document.documentElement.className = 'light';
                document.documentElement.lang = 'en';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
