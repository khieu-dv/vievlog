"use client";

import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
