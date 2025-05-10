"use client";

import { Suspense } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getFlowById } from "../../../lib/flowService";
import FlowDiagram from "../../components/FlowHtml";
import { Header } from "~/ui/components/header";
import { useMemo } from "react";

export default function FlowDetailPage() {
  const { id } = useParams<{ id: string }>();
  // convert id to number
  const idNumber = useMemo(() => {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      notFound();
    }
    return idNum;
  }, [id]);



  return (

    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <Link
            href="/diagrams"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to All Grammar Diagram
          </Link>


          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <Suspense
              fallback={
                <div className="h-[600px] flex items-center justify-center">
                  Loading diagram...
                </div>
              }
            >
              <FlowDiagram category={idNumber} />
            </Suspense>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} VieVlog. All rights reserved.
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Made with ❤️ by VieVlog
          </p>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}