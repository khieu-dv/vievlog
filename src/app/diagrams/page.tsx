"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFlows } from "../../lib/flowService"; // Import đúng đường dẫn
import { Header } from "~/ui/components/header";
import { useTranslation } from "react-i18next";
import { ContactButton } from "../components/contact-button";


interface FlowItem {
  id: number;
  title: string;
  description: string;
}

interface FlowListProps {
  flows: FlowItem[];
}

export default function FlowList() {
  const [flows, setFlows] = useState<FlowItem[] | null>(null);
  const pathname = usePathname();
  const isTopLevelPath = pathname === "/topiks";
  const { t } = useTranslation();

  useEffect(() => {
    getFlows().then(setFlows); // Lấy dữ liệu từ API
  }, []);

  return (

    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">

          <h2 className="text-2xl font-bold">{t("content.metadata.grammar")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flows && flows.map((flow) => (
              <Link href={`/grammars/${flow.id}`} key={flow.id}>
                <div
                  className="p-4 rounded-lg border cursor-pointer transition-all
                border-gray-200 hover:border-blue-300 hover:bg-blue-50 
                dark:border-gray-700 dark:hover:bg-blue-900/20"
                >
                  <h3 className="font-semibold mb-2">{flow.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{flow.description}</p>
                </div>
              </Link>
            ))}
          </div>



        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} VieVlog. All rights reserved.
          </p>
        </div>
      </footer>
      <ContactButton />
    </div>

  );
}