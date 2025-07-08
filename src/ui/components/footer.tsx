"use client";

import { Facebook, Github, Youtube } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button } from "~/ui/primitives/button";
import { useTranslation } from "react-i18next";

export function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <footer className={cn("border-t bg-background text-foreground", className)}>
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Branding & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                VieClone
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Download videos quickly and easily with VieClone. Trusted by users worldwide.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/khieu.dv96" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </a>
              <a href="https://www.youtube.com/@vie-vlogs" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Button>
              </a>
              <a href="https://github.com/khieu-dv" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold">Quick Links</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/clone" className="hover:text-foreground">
                  Download
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VieClone. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
