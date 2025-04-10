"use client";

import * as React from "react";
import axios from "axios";
import { Header } from "~/ui/components/header";
import Flow from "../components/Flow";

export default function TopiksPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <Flow/>
        
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} VieTopik. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
