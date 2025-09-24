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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
          <Binary className="h-4 w-4" />
          Computer Science Fundamentals
        </div>
        <h2 className="text-2xl font-bold mb-4">
          Cấu Trúc Dữ Liệu & Giải Thuật
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Khám phá nền tảng của khoa học máy tính với các ví dụ tương tác và triển khai bằng Rust.
          Từ các cấu trúc dữ liệu cơ bản đến các thuật toán phức tạp.
        </p>
      </div>

      {/* Why Learn DSA */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Tại sao học DSA?
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 p-2 mt-0.5">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Tối ưu hiệu suất</h4>
                <p className="text-sm text-muted-foreground">
                  Giảm thời gian chạy từ O(n²) xuống O(n log n) hoặc O(1)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-50 dark:bg-blue-950/50 p-2 mt-0.5">
                <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Tư duy thuật toán</h4>
                <p className="text-sm text-muted-foreground">
                  Phát triển khả năng giải quyết vấn đề phức tạp
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-50 dark:bg-purple-950/50 p-2 mt-0.5">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Phỏng vấn kỹ thuật</h4>
                <p className="text-sm text-muted-foreground">
                  Chuẩn bị cho các câu hỏi coding interview
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-50 dark:bg-orange-950/50 p-2 mt-0.5">
                <Network className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Hệ thống phức tạp</h4>
                <p className="text-sm text-muted-foreground">
                  Xây dựng ứng dụng quy mô lớn hiệu quả
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Structures Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <TreePine className="h-5 w-5 text-emerald-500" />
          Cấu Trúc Dữ Liệu
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dataStructures.map((ds, index) => {
            const Icon = ds.icon;
            return (
              <div
                key={index}
                className="group rounded-lg border bg-card p-4 hover:shadow-sm transition-all cursor-pointer hover:border-primary/20"
                onClick={() => setActiveTab(ds.tabId)}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2.5 ${ds.color} transition-colors group-hover:scale-105`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{ds.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {ds.description}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/60 rounded-md text-xs font-mono">
                      <Clock className="h-3 w-3" />
                      {ds.complexity}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Algorithms Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <SortAsc className="h-5 w-5 text-blue-500" />
          Giải Thuật
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {algorithms.map((algo, index) => {
            const Icon = algo.icon;
            return (
              <div
                key={index}
                className="group rounded-lg border bg-card p-5 cursor-pointer hover:shadow-sm transition-all hover:border-primary/20"
                onClick={() => setActiveTab(algo.tabId)}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-2">{algo.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {algo.description}
                    </p>
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono bg-muted/60 px-2 py-1 rounded-md">
                        {algo.complexity}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {algo.examples.map((example, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Path */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Route className="h-5 w-5 text-blue-500" />
          Lộ trình học tập
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold mx-auto mb-3">1</div>
            <h4 className="font-medium mb-1">Cơ bản</h4>
            <p className="text-xs text-muted-foreground">Arrays, Linked Lists</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold mx-auto mb-3">2</div>
            <h4 className="font-medium mb-1">Trung cấp</h4>
            <p className="text-xs text-muted-foreground">Trees, Stacks, Queues</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold mx-auto mb-3">3</div>
            <h4 className="font-medium mb-1">Nâng cao</h4>
            <p className="text-xs text-muted-foreground">Graphs, Hash Tables</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold mx-auto mb-3">4</div>
            <h4 className="font-medium mb-1">Chuyên sâu</h4>
            <p className="text-xs text-muted-foreground">Algorithms, DP</p>
          </div>
        </div>
      </div>
    </div>
  );
}