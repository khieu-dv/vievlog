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

      {/* Main Layout - shadcn/ui inspired */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Header Section - more minimal like shadcn */}
          <div className="py-6 border-b">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                Documentation
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-7">
                Comprehensive guides and resources to help you make the most of VieVlog platform.
              </p>
            </div>
          </div>

          {/* Documentation Content */}
          <div className="py-6">
            <DocsView />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}