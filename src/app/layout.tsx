import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "~/ui/components/theme-provider";
import Providers from "./components/providers/Providers";
import I18nProvider from "./components/providers/i18nProvider"; // Import file mới
import DevToolsDetector from './components/DevToolsDetector';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VieVlog",
  description: "VieVlog",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider> {/* Đưa vào đây để tránh lỗi Server Component */}
            <Providers>
              {children}
              {/* <DevToolsDetector /> */}
            </Providers>
          </I18nProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
