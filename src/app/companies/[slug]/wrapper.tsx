"use client";

import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";

interface Props {
  children: React.ReactNode;
}

export default function CompanyDetailWrapper({ children }: Props) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto sm:px-6">
        <div className="pt-8 pb-20">
          {children}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}