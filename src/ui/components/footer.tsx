import { Facebook, Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import { Button } from "~/ui/primitives/button";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                VieVlog
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for everything tech. Premium lessions at
              competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/khieu.dv96" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </a>
              <a href="https://www.youtube.com/@vie-vlogs" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Youtube className="h-4 w-4" />
                  <span className="sr-only">YouTube</span>
                </Button>
              </a>

              <a href="https://github.com/khieu-dv" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>

            </div>

          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Post</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/posts"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Khóa Học Golang
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dự Án Gin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Video</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/videos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Tiktok Video
                </Link>
              </li>

            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Chat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/chat"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Chat with us
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Chat with your friends
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VieVlog. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/" className="hover:text-foreground">
                Cookies
              </Link>
              <Link href="/" className="hover:text-foreground">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
