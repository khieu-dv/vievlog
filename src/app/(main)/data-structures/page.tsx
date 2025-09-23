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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Binary className="h-8 w-8 text-blue-500" />
            Cấu Trúc Dữ Liệu & Giải Thuật
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Các ví dụ tương tác và cài đặt Rust cho các cấu trúc dữ liệu và giải thuật cơ bản.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "overview" ? (
            <OverviewSection setActiveTab={setActiveTab} />
          ) : (
            tabs.find(tab => tab.id === activeTab)?.content
          )}
        </div>

        {/* Performance Comparison */}
        <ComplexitySection />
      </div>

      <Footer />
    </div>
  );
}