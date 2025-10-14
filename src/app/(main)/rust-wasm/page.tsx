import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Video, ArrowRight } from "lucide-react";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";

export const metadata: Metadata = {
  title: "Media Studio - VieVlog",
  description: "Your creative workspace for image editing and video generation",
  keywords: ["media studio", "image editor", "video generator", "creative tools"],
  openGraph: {
    title: "Media Studio - VieVlog",
    description: "Your creative workspace for image editing and video generation",
    type: "website",
  },
};

export default function MediaStudioPage() {
  const tools = [
    {
      title: "🖼️ Image Editor",
      description: "Edit and enhance your images with powerful editing tools",
      href: "/media-studio/image-editor",
      icon: Camera,
      gradient: "from-purple-600 to-pink-600",
      hoverGradient: "hover:from-purple-700 hover:to-pink-700",
    },
    {
      title: "🎥 Video Generator",
      description: "Create beautiful videos from your photos with smooth transitions",
      href: "/media-studio/video-generator",
      icon: Video,
      gradient: "from-blue-600 to-cyan-600",
      hoverGradient: "hover:from-blue-700 hover:to-cyan-700",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Media Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your creative workspace for image editing and video generation. Choose your tool and start creating amazing content.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tool.gradient} ${tool.hoverGradient} p-8 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="relative z-10">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="rounded-full bg-white/20 p-3">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-bold">{tool.title}</h2>
                    </div>

                    <p className="mb-6 text-white/90 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>Open Tool</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Background decoration */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
                </Link>
              );
            })}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 rounded-xl border bg-card p-8 text-center">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              More Tools Coming Soon
            </h3>
            <p className="text-muted-foreground">
              We're constantly working on new creative tools to enhance your workflow.
              Stay tuned for more exciting features!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}