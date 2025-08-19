"use client";

import { ArrowLeft, Home, Search, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <FileQuestion className="h-16 w-16 text-slate-400 dark:text-slate-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">404</span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            {t('notFound.title')}
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {t('notFound.description')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                <Home className="h-4 w-4 mr-2" />
                {t('notFound.backToHome')}
              </Button>
            </Link>

            <Link href="/posts">
              <Button variant="outline" className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                {t('notFound.searchPosts')}
              </Button>
            </Link>

            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('notFound.goBack')}
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-4">
              {t('notFound.helpfulLinks')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/posts"
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                {t('notFound.programmingPosts')}
              </Link>
              <span className="text-slate-400">•</span>
              <Link
                href="/videos"
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                {t('notFound.videoTutorials')}
              </Link>
              <span className="text-slate-400">•</span>
              <Link
                href="/games"
                className="text-sm text-primary hover:text-primary/80 underline"
              >
                {t('notFound.programmingGames')}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}