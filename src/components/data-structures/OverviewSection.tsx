"use client";

import { Binary, TreePine, Network, Hash, Layers, SortAsc, Search, Route, Layers2, Clock, Zap, Brain } from "lucide-react";

interface OverviewSectionProps {
  setActiveTab: (tabId: string) => void;
}

export function OverviewSection({ setActiveTab }: OverviewSectionProps) {
  const dataStructures = [
    {
      name: "Arrays & Vectors",
      icon: Layers,
      description: "Cấu trúc dữ liệu tuyến tính cơ bản với truy cập ngẫu nhiên",
      complexity: "O(1) truy cập",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      tabId: "arrays"
    },
    {
      name: "Linked Lists",
      icon: Binary,
      description: "Danh sách liên kết động với insertion/deletion hiệu quả",
      complexity: "O(1) chèn/xóa",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
      tabId: "linked-lists"
    },
    {
      name: "Trees",
      icon: TreePine,
      description: "Cấu trúc phân cấp cho tìm kiếm và sắp xếp hiệu quả",
      complexity: "O(log n) tìm kiếm",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
      tabId: "trees"
    },
    {
      name: "Graphs",
      icon: Network,
      description: "Mô hình mối quan hệ phức tạp giữa các đối tượng",
      complexity: "Tùy thuộc thuật toán",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
      tabId: "graphs"
    },
    {
      name: "Hash Tables",
      icon: Hash,
      description: "Tra cứu cực nhanh với key-value mapping",
      complexity: "O(1) tra cứu",
      color: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
      tabId: "hash-table"
    },
    {
      name: "Stacks & Queues",
      icon: Layers2,
      description: "LIFO và FIFO data structures cho xử lý tuần tự",
      complexity: "O(1) push/pop",
      color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
      tabId: "stack"
    }
  ];

  const algorithms = [
    {
      name: "Sorting Algorithms",
      icon: SortAsc,
      description: "QuickSort, MergeSort, HeapSort cho sắp xếp dữ liệu",
      complexity: "O(n log n)",
      examples: ["Quick Sort", "Merge Sort", "Heap Sort"],
      tabId: "sorting"
    },
    {
      name: "Search Algorithms",
      icon: Search,
      description: "Binary Search, Linear Search cho tìm kiếm hiệu quả",
      complexity: "O(log n)",
      examples: ["Binary Search", "DFS", "BFS"],
      tabId: "searching"
    },
    {
      name: "Graph Algorithms",
      icon: Route,
      description: "Dijkstra, A*, Floyd-Warshall cho đường đi ngắn nhất",
      complexity: "O(V²) - O(V³)",
      examples: ["Dijkstra", "A*", "Floyd-Warshall"],
      tabId: "dijkstra"
    },
    {
      name: "Dynamic Programming",
      icon: Brain,
      description: "Tối ưu hóa bài toán với subproblems overlap",
      complexity: "Tùy bài toán",
      examples: ["Fibonacci", "Knapsack", "LCS"],
      tabId: "dynamic-programming"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary mb-3">
          <Binary className="h-3 w-3 sm:h-4 sm:w-4" />
          Computer Science Fundamentals
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3">
          Cấu Trúc Dữ Liệu & Giải Thuật
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-2">
          Khám phá nền tảng của khoa học máy tính với các ví dụ tương tác và triển khai bằng Rust.
          Từ các cấu trúc dữ liệu cơ bản đến các thuật toán phức tạp.
        </p>
      </div>

      {/* Why Learn DSA - Simplified */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Tại sao học DSA?
        </h3>
        <div className="grid gap-2 sm:gap-3 grid-cols-2 md:grid-cols-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Tối ưu hiệu suất</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Tư duy thuật toán</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Phỏng vấn kỹ thuật</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
            <Network className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Hệ thống phức tạp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Structures Overview - Simplified */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TreePine className="h-5 w-5 text-emerald-500" />
          Cấu Trúc Dữ Liệu
        </h3>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {dataStructures.map((ds, index) => {
            const Icon = ds.icon;
            return (
              <button
                key={index}
                className="group text-left p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer border"
                onClick={() => setActiveTab(ds.tabId)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`rounded-lg p-2 ${ds.color} transition-colors group-hover:scale-105`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-xs">{ds.name}</h4>
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      {ds.complexity}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Algorithms Overview - Simplified */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <SortAsc className="h-5 w-5 text-blue-500" />
          Giải Thuật
        </h3>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
          {algorithms.map((algo, index) => {
            const Icon = algo.icon;
            return (
              <button
                key={index}
                className="group text-left p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer border"
                onClick={() => setActiveTab(algo.tabId)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:scale-105 transition-transform">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-xs">{algo.name}</h4>
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      {algo.complexity}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}