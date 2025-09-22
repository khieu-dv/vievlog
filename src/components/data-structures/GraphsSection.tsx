"use client";

import { useState } from "react";
import { Network } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

interface Edge {
  from: number;
  to: number;
  weight?: number;
}

class Graph {
  private adjacencyList: Map<number, number[]> = new Map();
  private edges: Edge[] = [];

  addVertex(vertex: number): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(from: number, to: number, isDirected: boolean = false): void {
    this.addVertex(from);
    this.addVertex(to);

    this.adjacencyList.get(from)!.push(to);
    this.edges.push({ from, to });

    if (!isDirected) {
      this.adjacencyList.get(to)!.push(from);
    }
  }

  getVertices(): number[] {
    return Array.from(this.adjacencyList.keys()).sort((a, b) => a - b);
  }

  getNeighbors(vertex: number): number[] {
    return this.adjacencyList.get(vertex) || [];
  }

  getEdges(): Edge[] {
    return this.edges;
  }

  clear(): void {
    this.adjacencyList.clear();
    this.edges = [];
  }

  // BFS traversal
  bfs(startVertex: number): number[] {
    if (!this.adjacencyList.has(startVertex)) return [];

    const visited = new Set<number>();
    const queue: number[] = [startVertex];
    const result: number[] = [];

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);

        const neighbors = this.getNeighbors(vertex);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }

    return result;
  }

  // DFS traversal
  dfs(startVertex: number): number[] {
    if (!this.adjacencyList.has(startVertex)) return [];

    const visited = new Set<number>();
    const result: number[] = [];

    const dfsHelper = (vertex: number) => {
      visited.add(vertex);
      result.push(vertex);

      const neighbors = this.getNeighbors(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };

    dfsHelper(startVertex);
    return result;
  }
}

export function GraphsSection() {
  const [graph] = useState(new Graph());
  const [fromVertex, setFromVertex] = useState("");
  const [toVertex, setToVertex] = useState("");
  const [isDirected, setIsDirected] = useState(false);
  const [startVertex, setStartVertex] = useState("");
  const [traversalResult, setTraversalResult] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const addEdge = () => {
    const from = parseInt(fromVertex);
    const to = parseInt(toVertex);

    if (!isNaN(from) && !isNaN(to)) {
      graph.addEdge(from, to, isDirected);
      setFromVertex("");
      setToVertex("");
      setRefreshKey(prev => prev + 1); // Force re-render
    }
  };

  const clearGraph = () => {
    graph.clear();
    setTraversalResult("");
    setRefreshKey(prev => prev + 1);
  };

  const runBFS = () => {
    const start = parseInt(startVertex);
    if (!isNaN(start)) {
      const result = graph.bfs(start);
      setTraversalResult(`BFS từ đỉnh ${start}: ${result.join(" → ")}`);
    }
  };

  const runDFS = () => {
    const start = parseInt(startVertex);
    if (!isNaN(start)) {
      const result = graph.dfs(start);
      setTraversalResult(`DFS từ đỉnh ${start}: ${result.join(" → ")}`);
    }
  };

  const vertices = graph.getVertices();
  const edges = graph.getEdges();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Network className="h-5 w-5" />
          Đồ Thị
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Đồ thị là tập hợp các đỉnh (nút) được kết nối bởi các cạnh. Đồ thị có thể biểu diễn mạng lưới, mối quan hệ và nhiều vấn đề thực tế.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Các Loại Đồ Thị:</h4>
            <MermaidDiagram
              chart={`
                graph LR
                    subgraph "Đồ Thị Có Hướng"
                        A1[A] --> B1[B]
                        B1 --> C1[C]
                        C1 --> A1
                        A1 --> D1[D]
                    end

                    subgraph "Đồ Thị Vô Hướng"
                        A2[A] --- B2[B]
                        B2 --- C2[C]
                        C2 --- D2[D]
                        A2 --- D2
                        B2 --- D2
                    end

                    subgraph "Đồ Thị Có Trọng Số"
                        A3[A] -->|5| B3[B]
                        B3 -->|3| C3[C]
                        A3 -->|8| C3
                        C3 -->|2| D3[D]
                        A3 -->|7| D3
                    end

                    style A1 fill:#4CAF50,color:#fff
                    style A2 fill:#2196F3,color:#fff
                    style A3 fill:#FF9800,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Xây Dựng Đồ Thị:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fromVertex}
                    onChange={(e) => setFromVertex(e.target.value)}
                    placeholder="Từ đỉnh"
                    className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500 flex-1"
                  />
                  <input
                    type="number"
                    value={toVertex}
                    onChange={(e) => setToVertex(e.target.value)}
                    placeholder="Đến đỉnh"
                    className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500 flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isDirected}
                      onChange={(e) => setIsDirected(e.target.checked)}
                      className="rounded"
                    />
                    Có hướng
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addEdge}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
                  >
                    Thêm cạnh
                  </button>
                  <button
                    onClick={clearGraph}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-1"
                  >
                    Xóa hết
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="number"
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  placeholder="Đỉnh bắt đầu duyệt"
                  className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500 w-full"
                />
                <div className="flex gap-2">
                  <button
                    onClick={runBFS}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1"
                  >
                    BFS
                  </button>
                  <button
                    onClick={runDFS}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex-1"
                  >
                    DFS
                  </button>
                </div>
              </div>
            </div>

            {traversalResult && (
              <div className="mb-3 p-2 bg-gray-200 dark:bg-slate-600 rounded text-sm">
                {traversalResult}
              </div>
            )}

            <div className="space-y-2">
              <div>
                <strong>Đỉnh:</strong> {vertices.length > 0 ? vertices.join(", ") : "Không có"}
              </div>
              <div>
                <strong>Cạnh:</strong>{" "}
                {edges.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {edges.map((edge, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                        {edge.from} {isDirected ? "→" : "↔"} {edge.to}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Không có"
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Loại Đồ Thị:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Đồ Thị Có Hướng:</strong> Cạnh có hướng (A → B)
              </div>
              <div>
                <strong>Đồ Thị Vô Hướng:</strong> Cạnh hai chiều (A ↔ B)
              </div>
              <div>
                <strong>Đồ Thị Có Trọng Số:</strong> Cạnh có trọng số/chi phí
              </div>
              <div>
                <strong>Đồ Thị Không Trọng Số:</strong> Tất cả cạnh có trọng số bằng nhau
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`use std::collections::HashMap;

#[derive(Debug)]
struct Graph<T> {
    adjacency_list: HashMap<T, Vec<T>>,
}

impl<T: Clone + Eq + std::hash::Hash> Graph<T> {
    fn new() -> Self {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }

    fn add_vertex(&mut self, vertex: T) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    fn add_edge(&mut self, from: T, to: T) {
        self.adjacency_list
            .entry(from.clone())
            .or_insert(Vec::new())
            .push(to.clone());

        // Cho đồ thị vô hướng, thêm cạnh ngược
        self.adjacency_list
            .entry(to)
            .or_insert(Vec::new())
            .push(from);
    }

    fn get_neighbors(&self, vertex: &T) -> Option<&Vec<T>> {
        self.adjacency_list.get(vertex)
    }
}`}
            </pre>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Thêm đỉnh:</strong> O(1)
              </div>
              <div>
                <strong>Thêm cạnh:</strong> O(1)
              </div>
              <div>
                <strong>Tìm cạnh:</strong> O(degree)
              </div>
              <div>
                <strong>BFS/DFS:</strong> O(V + E)
              </div>
              <div>
                <strong>Bộ nhớ:</strong> O(V + E)
              </div>
              <div>
                <strong>Liệt kê neighbor:</strong> O(degree)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}