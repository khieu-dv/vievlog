"use client";

import { useState } from "react";
import {
  Binary,
  Layout,
  List,
  Network,
  Search,
  SortAsc,
  TreePine,
  Hash,
  Layers,
  ArrowRight,
  TrendingUp,
  Route,
  Layers2
} from "lucide-react";
import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { OverviewSection, ArraysSection, LinkedListsSection, TreesSection, GraphsSection, HashTableSection, StackSection, QueueSection, HeapSection } from "~/components/data-structures";
import { SortingSection, SearchingSection, ComplexitySection, DijkstraSection, DynamicProgrammingSection } from "~/components/algorithms";

interface TabProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

const tabs: TabProps[] = [
  {
    id: "overview",
    title: "Tổng quan",
    icon: Binary,
    content: null // Will be set dynamically with setActiveTab
  },
  {
    id: "arrays",
    title: "Mảng & Vector",
    icon: Layout,
    content: <ArraysSection />
  },
  {
    id: "linked-lists",
    title: "Danh Sách Liên Kết",
    icon: List,
    content: <LinkedListsSection />
  },
  {
    id: "trees",
    title: "Cây",
    icon: TreePine,
    content: <TreesSection />
  },
  {
    id: "graphs",
    title: "Đồ Thị",
    icon: Network,
    content: <GraphsSection />
  },
  {
    id: "hash-table",
    title: "Hash Table",
    icon: Hash,
    content: <HashTableSection />
  },
  {
    id: "stack",
    title: "Stack",
    icon: Layers,
    content: <StackSection />
  },
  {
    id: "queue",
    title: "Queue",
    icon: ArrowRight,
    content: <QueueSection />
  },
  {
    id: "heap",
    title: "Heap",
    icon: TrendingUp,
    content: <HeapSection />
  },
  {
    id: "sorting",
    title: "Sắp Xếp",
    icon: SortAsc,
    content: <SortingSection />
  },
  {
    id: "searching",
    title: "Tìm Kiếm",
    icon: Search,
    content: <SearchingSection />
  },
  {
    id: "dijkstra",
    title: "Dijkstra",
    icon: Route,
    content: <DijkstraSection />
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    icon: Layers2,
    content: <DynamicProgrammingSection />
  }
];

export default function DataStructuresPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-lg bg-primary/10 p-2">
              <Binary className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight">
            Cấu Trúc Dữ Liệu & Giải Thuật
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-2">
            Các ví dụ tương tác và cài đặt Rust cho các cấu trúc dữ liệu và giải thuật cơ bản.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-3 sm:space-x-6 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline sm:inline">{tab.title}</span>
                    <span className="xs:hidden sm:hidden">{tab.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {activeTab === "overview" ? (
            <OverviewSection setActiveTab={setActiveTab} />
          ) : (
            tabs.find(tab => tab.id === activeTab)?.content
          )}
        </div>

        {/* Performance Comparison */}
        <div>
          <ComplexitySection />
        </div>
      </div>

      <Footer />
    </div>
  );
}