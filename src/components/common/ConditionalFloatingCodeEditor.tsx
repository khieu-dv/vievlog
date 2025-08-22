"use client";

import { usePathname } from "next/navigation";
import FloatingCodeEditor from "./FloatingCodeEditor";

export default function ConditionalFloatingCodeEditor() {
  const pathname = usePathname();

  if (pathname.startsWith("/games")) {
    return null;
  }

  return <FloatingCodeEditor />;
}
