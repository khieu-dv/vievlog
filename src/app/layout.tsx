import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/common/ThemeProvider";
import Providers from "../components/common/Providers";
import I18nProvider from "../components/common/I18nProvider";
// import ConditionalFloatingCodeEditor from "../components/common/ConditionalFloatingCodeEditor";
import { NavigationHandler } from "../components/common/NavigationHandler";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VieVlog - Advanced Programming Channel",
  description:
    "Welcome to the advanced programming channel! Here, I share practical knowledge and detailed tutorials on modern languages and frameworks such as Go, Rust, ReactJS, and Next.js. Suitable for both beginners and developers looking to enhance their skills.",
  keywords: [
    "programming",
    "VieVlog",
    "Go",
    "Rust",
    "ReactJS",
    "Next.js",
    "learn programming",
    "coding tutorials",
    "frontend",
    "backend",
    "fullstack development",
  ],
  authors: [{ name: "VieVlog" }],
  creator: "VieVlog",
  generator: "Next.js",
  metadataBase: new URL("https://vievlog.com"),
  openGraph: {
    title: "VieVlog - Advanced Programming Channel",
    description:
      "Practical insights & detailed tutorials on Go, Rust, ReactJS, and Next.js. Perfect for beginners and experienced developers alike.",
    url: "https://vievlog.com",
    siteName: "VieVlog",
    images: [
      {
        url: "https://vievlog.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VieVlog - Advanced Programming Channel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1PNDJK7RXF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1PNDJK7RXF');
            `,
          }}
        />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <Providers>
              <NavigationHandler />
              {children}
              {/* <ConditionalFloatingCodeEditor /> */}
              {/* <DevToolsDetector /> */}
            </Providers>
          </I18nProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
