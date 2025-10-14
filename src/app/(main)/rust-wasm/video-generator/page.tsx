import type { Metadata } from "next";
import { VideoGenerator } from "~/components/features/video-generator";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";

export const metadata: Metadata = {
  title: "Video Generator - Create Beautiful Videos from Images",
  description: "Generate stunning videos with smooth transitions from your photos. Upload 2-10 images and create professional-looking videos with customizable effects.",
  keywords: ["video generator", "image to video", "slideshow", "transitions", "video creation"],
  openGraph: {
    title: "Video Generator - Create Beautiful Videos from Images",
    description: "Generate stunning videos with smooth transitions from your photos",
    type: "website",
  },
};

export default function VideoGeneratorPage() {
  return (

    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4">
        <VideoGenerator />
      </main>
      <Footer />
    </div>

  );
}