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
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
          <Binary className="h-4 w-4" />
          Computer Science Fundamentals
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Cấu Trúc Dữ Liệu & Giải Thuật
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-7">
            Khám phá nền tảng của khoa học máy tính với các ví dụ tương tác và triển khai bằng Rust.
            Từ các cấu trúc dữ liệu cơ bản đến các thuật toán phức tạp.
          </p>
        </div>
      </div>

      {/* Why Learn DSA */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Tại sao học DSA?
          </h3>
          <p className="text-muted-foreground">
            Các lợi ích cốt lõi khi nắm vững cấu trúc dữ liệu và giải thuật.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-medium">Tối ưu hiệu suất</div>
              <div className="text-sm text-muted-foreground">O(n²) → O(log n)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium">Tư duy thuật toán</div>
              <div className="text-sm text-muted-foreground">Problem solving</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="font-medium">Phỏng vấn kỹ thuật</div>
              <div className="text-sm text-muted-foreground">Coding interview</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Network className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="font-medium">Hệ thống phức tạp</div>
              <div className="text-sm text-muted-foreground">Scalable systems</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Structures Overview */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <TreePine className="h-5 w-5 text-emerald-500" />
            Cấu Trúc Dữ Liệu
          </h3>
          <p className="text-muted-foreground">
            Các cấu trúc dữ liệu cốt lõi với độ phức tạp thời gian tương ứng.
          </p>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {dataStructures.map((ds, index) => {
            const Icon = ds.icon;
            return (
              <button
                key={index}
                className="group flex flex-col items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-all"
                onClick={() => setActiveTab(ds.tabId)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="font-medium text-sm leading-none">{ds.name}</h4>
                  <div className="text-xs font-mono text-muted-foreground">
                    {ds.complexity}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Algorithms Overview */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <SortAsc className="h-5 w-5 text-blue-500" />
            Giải Thuật
          </h3>
          <p className="text-muted-foreground">
            Các thuật toán phổ biến với độ phức tạp và ví dụ ứng dụng.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {algorithms.map((algo, index) => {
            const Icon = algo.icon;
            return (
              <button
                key={index}
                className="group text-left p-6 rounded-lg border bg-card hover:bg-accent transition-all"
                onClick={() => setActiveTab(algo.tabId)}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{algo.name}</h4>
                      <div className="text-xs font-mono text-muted-foreground">
                        {algo.complexity}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {algo.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {algo.examples.map((example, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
                        {example}
                      </span>
                    ))}
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