"use client";

import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import DocsView from "~/components/features/posts/DocsView";

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <VieShareBanner />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col">
          {/* Main Content */}
          <main className="w-full">
            {/* Header Section */}
            <div className="mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Documentation Center
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive guides, tutorials, and resources to help you make the most of VieVlog platform.
                  Explore our learning materials organized by topic.
                </p>
              </div>
            </div>

            {/* Documentation Content */}
            <div className="relative">
              <DocsView />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}