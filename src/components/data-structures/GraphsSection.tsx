"use client";

import { useState, useEffect } from "react";
import { Network } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

interface Edge {
  from: number;
  to: number;
  weight?: number;
}

export function GraphsSection() {
  const [rustGraph, setRustGraph] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [graphDisplay, setGraphDisplay] = useState<Edge[]>([]);
  const [verticesDisplay, setVerticesDisplay] = useState<number[]>([]);
  const [fromVertex, setFromVertex] = useState("");
  const [toVertex, setToVertex] = useState("");
  const [isDirected, setIsDirected] = useState(false);
  const [startVertex, setStartVertex] = useState("");
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newGraph = wasmInstance.dataStructures.createGraph(isDirected);
        setRustGraph(newGraph);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Graph đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, [isDirected]);

  // Update display from Rust graph
  const updateDisplayFromRustGraph = () => {
    if (rustGraph) {
      try {
        const vertices = Array.from(rustGraph.get_vertices()) as number[];
        setVerticesDisplay(vertices);

        // Manually construct edges from graph structure
        const edges: Edge[] = [];
        for (const vertex of vertices) {
          const neighbors = Array.from(rustGraph.get_neighbors(vertex)) as number[];
          for (const neighbor of neighbors) {
            // Only add each edge once for undirected graphs
            if (isDirected || vertex <= neighbor) {
              edges.push({ from: vertex, to: neighbor });
            }
          }
        }
        setGraphDisplay(edges);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const addEdge = () => {
    const from = parseInt(fromVertex);
    const to = parseInt(toVertex);

    if (!isNaN(from) && !isNaN(to)) {
      if (wasmReady && rustGraph) {
        try {
          rustGraph.add_edge(from, to);
          const edgeCount = rustGraph.edge_count();
          setResult(`🦀 Đã thêm cạnh từ ${from} đến ${to}. Số cạnh: ${edgeCount}`);
          updateDisplayFromRustGraph();
          setFromVertex("");
          setToVertex("");
        } catch (error) {
          setResult("❌ Rust WASM addEdge failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const addVertex = () => {
    const vertex = parseInt(fromVertex);
    if (!isNaN(vertex)) {
      if (wasmReady && rustGraph) {
        try {
          rustGraph.add_vertex(vertex);
          const vertexCount = rustGraph.vertex_count();
          setResult(`🦀 Đã thêm đỉnh ${vertex}. Số đỉnh: ${vertexCount}`);
          updateDisplayFromRustGraph();
          setFromVertex("");
        } catch (error) {
          setResult("❌ Rust WASM addVertex failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const clearGraph = () => {
    if (wasmReady && rustGraph) {
      try {
        // Clear graph by removing all vertices
        const vertices = Array.from(rustGraph.get_vertices());
        for (const vertex of vertices) {
          rustGraph.remove_vertex(vertex);
        }
        setResult("🦀 Đã xóa toàn bộ đồ thị");
        updateDisplayFromRustGraph();
      } catch (error) {
        setResult("❌ Rust WASM clear failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const runBFS = () => {
    const start = parseInt(startVertex);
    if (!isNaN(start)) {
      if (wasmReady && rustGraph) {
        try {
          const traversalResult = Array.from(rustGraph.bfs_traversal(start));
          setResult(`🦀 BFS từ đỉnh ${start}: ${traversalResult.join(" → ")}`);
        } catch (error) {
          setResult("❌ Rust WASM BFS failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const runDFS = () => {
    const start = parseInt(startVertex);
    if (!isNaN(start)) {
      if (wasmReady && rustGraph) {
        try {
          const traversalResult = Array.from(rustGraph.dfs_traversal(start));
          setResult(`🦀 DFS từ đỉnh ${start}: ${traversalResult.join(" → ")}`);
        } catch (error) {
          setResult("❌ Rust WASM DFS failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Network className="h-5 w-5" />
          🦀 Rust WASM Đồ Thị
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác Đồ thị sử dụng Rust WASM. Đồ thị được tối ưu hóa là tập hợp các đỉnh (nút) được kết nối bởi các cạnh, hỗ trợ BFS, DFS và các thuật toán duyệt đồ thị hiệu quả.
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
                    disabled={!wasmReady}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1 disabled:opacity-50"
                  >
                    🦀 Thêm cạnh
                  </button>
                  <button
                    onClick={addVertex}
                    disabled={!wasmReady}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1 disabled:opacity-50"
                  >
                    🦀 Thêm đỉnh
                  </button>
                  <button
                    onClick={clearGraph}
                    disabled={!wasmReady}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-1 disabled:opacity-50"
                  >
                    🧹 Xóa hết
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
                    disabled={!wasmReady}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex-1 disabled:opacity-50"
                  >
                    🦀 BFS
                  </button>
                  <button
                    onClick={runDFS}
                    disabled={!wasmReady}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex-1 disabled:opacity-50"
                  >
                    🦀 DFS
                  </button>
                </div>
              </div>
            </div>

            {result && (
              <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong> {result}
              </div>
            )}

            <div className="space-y-2">
              <div>
                <strong>🦀 Đỉnh:</strong> {verticesDisplay.length > 0 ? verticesDisplay.join(", ") : "Không có"}
              </div>
              <div>
                <strong>🦀 Cạnh:</strong>{" "}
                {graphDisplay.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {graphDisplay.map((edge, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded text-xs">
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
            <RustCodeEditor
              code={`use std::collections::HashMap;

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
              height="350px"
            />
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