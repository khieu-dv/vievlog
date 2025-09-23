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
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      tabId: "arrays"
    },
    {
      name: "Linked Lists",
      icon: Binary,
      description: "Danh sách liên kết động với insertion/deletion hiệu quả",
      complexity: "O(1) chèn/xóa",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      tabId: "linked-lists"
    },
    {
      name: "Trees",
      icon: TreePine,
      description: "Cấu trúc phân cấp cho tìm kiếm và sắp xếp hiệu quả",
      complexity: "O(log n) tìm kiếm",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      tabId: "trees"
    },
    {
      name: "Graphs",
      icon: Network,
      description: "Mô hình mối quan hệ phức tạp giữa các đối tượng",
      complexity: "Tùy thuộc thuật toán",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      tabId: "graphs"
    },
    {
      name: "Hash Tables",
      icon: Hash,
      description: "Tra cứu cực nhanh với key-value mapping",
      complexity: "O(1) tra cứu",
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      tabId: "hash-table"
    },
    {
      name: "Stacks & Queues",
      icon: Layers2,
      description: "LIFO và FIFO data structures cho xử lý tuần tự",
      complexity: "O(1) push/pop",
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
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
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
          <Binary className="h-4 w-4" />
          Computer Science Fundamentals
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Cấu Trúc Dữ Liệu & Giải Thuật
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Khám phá nền tảng của khoa học máy tính với các ví dụ tương tác và triển khai bằng Rust.
          Từ các cấu trúc dữ liệu cơ bản đến các thuật toán phức tạp.
        </p>
      </div>

      {/* Why Learn DSA */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Tại sao học DSA?
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2 mt-1">
                <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Tối ưu hiệu suất</h4>
                <p className="text-sm text-muted-foreground">
                  Giảm thời gian chạy từ O(n²) xuống O(n log n) hoặc O(1)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2 mt-1">
                <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Tư duy thuật toán</h4>
                <p className="text-sm text-muted-foreground">
                  Phát triển khả năng giải quyết vấn đề phức tạp
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-2 mt-1">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium">Phỏng vấn kỹ thuật</h4>
                <p className="text-sm text-muted-foreground">
                  Chuẩn bị cho các câu hỏi coding interview
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-2 mt-1">
                <Network className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium">Hệ thống phức tạp</h4>
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
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TreePine className="h-5 w-5 text-green-500" />
          Cấu Trúc Dữ Liệu
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dataStructures.map((ds, index) => {
            const Icon = ds.icon;
            return (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                onClick={() => setActiveTab(ds.tabId)}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${ds.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{ds.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {ds.description}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs font-mono">
                        <Clock className="h-3 w-3" />
                        {ds.complexity}
                      </span>
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
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <SortAsc className="h-5 w-5 text-blue-500" />
          Giải Thuật
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {algorithms.map((algo, index) => {
            const Icon = algo.icon;
            return (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 cursor-pointer hover:shadow-md transition-all hover:scale-105"
                onClick={() => setActiveTab(algo.tabId)}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{algo.name}</h4>
                    <p className="text-muted-foreground mt-1 mb-3">
                      {algo.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {algo.complexity}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {algo.examples.map((example, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
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
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Route className="h-5 w-5 text-blue-500" />
          Lộ trình học tập
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mx-auto mb-2">1</div>
            <h4 className="font-medium text-sm">Cơ bản</h4>
            <p className="text-xs text-muted-foreground">Arrays, Linked Lists</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mx-auto mb-2">2</div>
            <h4 className="font-medium text-sm">Trung cấp</h4>
            <p className="text-xs text-muted-foreground">Trees, Stacks, Queues</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mx-auto mb-2">3</div>
            <h4 className="font-medium text-sm">Nâng cao</h4>
            <p className="text-xs text-muted-foreground">Graphs, Hash Tables</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mx-auto mb-2">4</div>
            <h4 className="font-medium text-sm">Chuyên sâu</h4>
            <p className="text-xs text-muted-foreground">Algorithms, DP</p>
          </div>
        </div>
      </div>
    </div>
  );
}