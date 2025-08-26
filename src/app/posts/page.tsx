"use client";

import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { VieShareBanner } from "~/components/common/VieShareBanner";
import DocsView from "~/components/features/posts/DocsView";

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      {/* <VieShareBanner /> */}

      {/* Main Layout - Apple Style */}
      <div className="max-w-7xl mx-auto sm:px-6">
        <div className="flex flex-col">
          {/* Header Section - Apple minimal style */}
          <div className="pt-16 pb-12 text-center px-4 sm:px-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
              Documentation
            </h1>
            <p className="text-xl font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to master programming.<br />
              Beautiful guides, thoughtfully crafted.
            </p>
          </div>

          {/* Documentation Content */}
          <div className="pb-20">
            <DocsView />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}