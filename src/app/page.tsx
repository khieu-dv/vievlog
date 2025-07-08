"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Footer } from "~/ui/components/footer";
import { Header } from "~/ui/components/header";
import { Button } from "~/ui/primitives/button";
import { ContactButton } from "./components/contact-button";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                The Ultimate Tool for Downloading Videos Anywhere
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
                Whether it's a music video, a tutorial, or an entire playlist, our video downloader gives you complete control over your media. Save content from platforms like YouTube, TikTok, Vimeo, and more – all in one sleek and powerful desktop app.
              </p>

              <div className="mt-10 flex justify-center">
                <Link href="/clone">
                  <Button size="lg" className="h-12 gap-1.5 px-8">
                    Download Now – It's Free! <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <ul className="mt-6 space-y-3 text-left text-muted-foreground text-base">
                <li>🎯 Download videos, audio, or playlists with a single click</li>
                <li>📂 Customize output name and folder with ease</li>
                <li>🚀 Lightning-fast performance powered by yt-dlp and ffmpeg</li>
                <li>🧠 Smart detection of playlists and video types</li>
                <li>🕓 Built-in queue and history tracking for better workflow</li>
                <li>💡 Lightweight, clean interface that’s easy for anyone to use</li>
                <li>🔒 100% offline – your downloads stay private and secure</li>
              </ul>
            </div>


          </div>
        </section>
      </main>
      <Footer />
      <ContactButton />
    </>
  );
}
