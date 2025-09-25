"use client";

import { useState, useEffect } from "react";
import { Network } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
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
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

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
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Network className="h-5 w-5" />
          🦀 Rust WASM Đồ Thị
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-indigo-50 dark:bg-indigo-950/50 p-6 rounded-lg mb-6 border-l-4 border-indigo-500">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">🕸️ Đồ Thị là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Đồ Thị (Graph)</strong> là tập hợp các đỉnh (vertex/node) được kết nối bởi các cạnh (edge).
            Mô tả mối quan hệ giữa các đối tượng: mạng xã hội, bản đồ đường, internet...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-card p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">📝 Thành phần:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• <strong>Vertex (Đỉnh):</strong> Các nút</li>
                <li>• <strong>Edge (Cạnh):</strong> Kết nối</li>
                <li>• <strong>Weight:</strong> Trọng số cạnh</li>
                <li>• <strong>Path:</strong> Đường đi</li>
              </ul>
            </div>
            <div className="bg-card p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">🎯 Ứng dụng:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Mạng xã hội (Facebook)</li>
                <li>• GPS, bản đồ đường</li>
                <li>• Internet, mạng máy tính</li>
                <li>• Game, AI pathfinding</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 dark:bg-teal-950/50 p-6 rounded-lg mb-6 border-l-4 border-teal-500">
          <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">🔄 Loại Đồ Thị</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Directed (Có hướng):</strong> A → B (một chiều)
              <br/><span className="text-gray-600 dark:text-gray-400">VD: Follow Twitter, đường một chiều</span>
            </div>
            <div>
              <strong>Undirected (Vô hướng):</strong> A ↔ B (hai chiều)
              <br/><span className="text-gray-600 dark:text-gray-400">VD: Kết bạn Facebook, đường hai chiều</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Các Loại Đồ Thị:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    subgraph "Có Hướng"
                        A1[A] --> B1[B]
                        B1 --> C1[C]
                        C1 --> A1
                    end

                    subgraph "Vô Hướng"
                        A2[A] --- B2[B]
                        B2 --- C2[C]
                        A2 --- C2
                    end

                    subgraph "Có Trọng Số"
                        A3[A] -->|5| B3[B]
                        B3 -->|3| C3[C]
                        A3 -->|8| C3
                    end

                    style A1 fill:#4CAF50,color:#fff
                    style A2 fill:#2196F3,color:#fff
                    style A3 fill:#FF9800,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Điều Khiển Đồ Thị:</h4>

            {/* Graph Type Selection */}
            <div className="mb-4 p-3 bg-card rounded border">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={isDirected}
                  onChange={(e) => setIsDirected(e.target.checked)}
                  className="rounded"
                />
                <span className="text-purple-600 dark:text-purple-400">
                  {isDirected ? "Đồ Thị Có Hướng (Directed)" : "Đồ Thị Vô Hướng (Undirected)"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Graph Building */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Xây Dựng Đồ Thị</h5>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fromVertex}
                    onChange={(e) => setFromVertex(e.target.value)}
                    placeholder="Từ đỉnh"
                    className="px-3 py-2 border rounded dark:bg-background dark:border-border flex-1 text-sm"
                  />
                  <input
                    type="number"
                    value={toVertex}
                    onChange={(e) => setToVertex(e.target.value)}
                    placeholder="Đến đỉnh"
                    className="px-3 py-2 border rounded dark:bg-background dark:border-border flex-1 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={addVertex}
                    disabled={!wasmReady}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
                  >
                    + Đỉnh
                  </button>
                  <button
                    onClick={addEdge}
                    disabled={!wasmReady}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
                  >
                    + Cạnh
                  </button>
                  <button
                    onClick={clearGraph}
                    disabled={!wasmReady}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>

              {/* Graph Traversal */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Duyệt Đồ Thị</h5>
                <input
                  type="number"
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  placeholder="Đỉnh bắt đầu duyệt"
                  className="px-3 py-2 border rounded dark:bg-background dark:border-border w-full text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={runBFS}
                    disabled={!wasmReady}
                    className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
                  >
                    🔍 BFS
                  </button>
                  <button
                    onClick={runDFS}
                    disabled={!wasmReady}
                    className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
                  >
                    🔍 DFS
                  </button>
                </div>
              </div>
            </div>

            {result && (
              <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-950/50 rounded border border-orange-200 dark:border-orange-800">
                <strong>Kết quả:</strong> {result}
              </div>
            )}

            {/* Visual Graph Display */}
            <div className="bg-card p-4 rounded border">
              <h5 className="font-medium mb-3">🦀 Biểu Diễn Đồ Thị</h5>
              <div className="min-h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                {verticesDisplay.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-gray-500 text-sm">
                    Đồ thị trống - hãy thêm đỉnh và cạnh
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Graph Statistics */}
                    <div className="flex gap-4 text-sm bg-muted/50 p-2 rounded">
                      <span className="font-medium">Đỉnh: <span className="text-blue-600 dark:text-blue-400">{verticesDisplay.length}</span></span>
                      <span className="font-medium">Cạnh: <span className="text-green-600 dark:text-green-400">{graphDisplay.length}</span></span>
                      <span className="font-medium">Loại: <span className="text-purple-600 dark:text-purple-400">{isDirected ? "Có hướng" : "Vô hướng"}</span></span>
                    </div>

                    {/* Vertices Display */}
                    <div>
                      <div className="text-sm font-medium mb-2">Đỉnh:</div>
                      <div className="flex flex-wrap gap-2">
                        {verticesDisplay.map((vertex, index) => (
                          <div key={index} className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {vertex}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Edges Display */}
                    {graphDisplay.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Cạnh:</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {graphDisplay.map((edge, index) => (
                            <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                {edge.from}
                              </span>
                              <span className="text-muted-foreground">
                                {isDirected ? "→" : "↔"}
                              </span>
                              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                {edge.to}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Loại Đồ Thị:</h4>
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

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Cài Đặt:</h4>

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveLanguageTab("rust")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "rust"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    Rust
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("cpp")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "cpp"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    C++
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("python")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "python"
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    Python
                  </button>
                </nav>
              </div>
            </div>

            {/* Language-specific Code */}
            {activeLanguageTab === "rust" && (
              <RustCodeEditor
                code={`use std::collections::{HashMap, HashSet, VecDeque};

#[derive(Debug)]
struct Graph<T> {
    adjacency_list: HashMap<T, Vec<T>>,
    is_directed: bool,
}

impl<T: Clone + Eq + std::hash::Hash> Graph<T> {
    fn new(directed: bool) -> Self {
        Graph {
            adjacency_list: HashMap::new(),
            is_directed: directed,
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

        // Nếu là đồ thị vô hướng, thêm cạnh ngược
        if !self.is_directed {
            self.adjacency_list
                .entry(to)
                .or_insert(Vec::new())
                .push(from);
        }
    }

    fn get_neighbors(&self, vertex: &T) -> Option<&Vec<T>> {
        self.adjacency_list.get(vertex)
    }

    // BFS Traversal
    fn bfs(&self, start: &T) -> Vec<T> {
        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();
        let mut result = Vec::new();

        queue.push_back(start.clone());
        visited.insert(start.clone());

        while let Some(vertex) = queue.pop_front() {
            result.push(vertex.clone());

            if let Some(neighbors) = self.get_neighbors(&vertex) {
                for neighbor in neighbors {
                    if !visited.contains(neighbor) {
                        visited.insert(neighbor.clone());
                        queue.push_back(neighbor.clone());
                    }
                }
            }
        }
        result
    }

    // DFS Traversal (recursive)
    fn dfs(&self, start: &T) -> Vec<T> {
        let mut visited = HashSet::new();
        let mut result = Vec::new();
        self.dfs_helper(start, &mut visited, &mut result);
        result
    }

    fn dfs_helper(&self, vertex: &T, visited: &mut HashSet<T>, result: &mut Vec<T>) {
        visited.insert(vertex.clone());
        result.push(vertex.clone());

        if let Some(neighbors) = self.get_neighbors(vertex) {
            for neighbor in neighbors {
                if !visited.contains(neighbor) {
                    self.dfs_helper(neighbor, visited, result);
                }
            }
        }
    }
}`}
                height="400px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <unordered_map>
#include <vector>
#include <queue>
#include <unordered_set>
#include <stack>
#include <iostream>

template<typename T>
class Graph {
private:
    std::unordered_map<T, std::vector<T>> adjacencyList;
    bool isDirected;

public:
    Graph(bool directed = false) : isDirected(directed) {}

    void addVertex(const T& vertex) {
        if (adjacencyList.find(vertex) == adjacencyList.end()) {
            adjacencyList[vertex] = std::vector<T>();
        }
    }

    void addEdge(const T& from, const T& to) {
        addVertex(from);
        addVertex(to);

        adjacencyList[from].push_back(to);

        // Nếu là đồ thị vô hướng, thêm cạnh ngược
        if (!isDirected) {
            adjacencyList[to].push_back(from);
        }
    }

    std::vector<T> getNeighbors(const T& vertex) const {
        auto it = adjacencyList.find(vertex);
        if (it != adjacencyList.end()) {
            return it->second;
        }
        return std::vector<T>();
    }

    // BFS Traversal
    std::vector<T> bfs(const T& start) const {
        std::vector<T> result;
        std::unordered_set<T> visited;
        std::queue<T> queue;

        queue.push(start);
        visited.insert(start);

        while (!queue.empty()) {
            T vertex = queue.front();
            queue.pop();
            result.push_back(vertex);

            auto neighbors = getNeighbors(vertex);
            for (const auto& neighbor : neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return result;
    }

    // DFS Traversal (iterative)
    std::vector<T> dfs(const T& start) const {
        std::vector<T> result;
        std::unordered_set<T> visited;
        std::stack<T> stack;

        stack.push(start);

        while (!stack.empty()) {
            T vertex = stack.top();
            stack.pop();

            if (visited.find(vertex) == visited.end()) {
                visited.insert(vertex);
                result.push_back(vertex);

                auto neighbors = getNeighbors(vertex);
                // Thêm ngược lại để giữ thứ tự gốc
                for (auto it = neighbors.rbegin(); it != neighbors.rend(); ++it) {
                    if (visited.find(*it) == visited.end()) {
                        stack.push(*it);
                    }
                }
            }
        }
        return result;
    }

    void printGraph() const {
        for (const auto& pair : adjacencyList) {
            std::cout << pair.first << ": ";
            for (const auto& neighbor : pair.second) {
                std::cout << neighbor << " ";
            }
            std::cout << std::endl;
        }
    }

    size_t vertexCount() const {
        return adjacencyList.size();
    }

    size_t edgeCount() const {
        size_t count = 0;
        for (const auto& pair : adjacencyList) {
            count += pair.second.size();
        }
        return isDirected ? count : count / 2;
    }
};`}
                height="400px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`from collections import defaultdict, deque

class Graph:
    def __init__(self, directed=False):
        """Khởi tạo đồ thị"""
        self.adjacency_list = defaultdict(list)
        self.is_directed = directed
        self.vertices = set()

    def add_vertex(self, vertex):
        """Thêm đỉnh vào đồ thị"""
        self.vertices.add(vertex)
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []

    def add_edge(self, from_vertex, to_vertex):
        """Thêm cạnh vào đồ thị"""
        self.add_vertex(from_vertex)
        self.add_vertex(to_vertex)

        self.adjacency_list[from_vertex].append(to_vertex)

        # Nếu là đồ thị vô hướng, thêm cạnh ngược
        if not self.is_directed:
            self.adjacency_list[to_vertex].append(from_vertex)

    def get_neighbors(self, vertex):
        """Lấy danh sách các đỉnh kề của một đỉnh"""
        return self.adjacency_list.get(vertex, [])

    def bfs(self, start_vertex):
        """Duyệt theo chiều rộng (BFS)"""
        if start_vertex not in self.vertices:
            return []

        visited = set()
        queue = deque([start_vertex])
        result = []

        visited.add(start_vertex)

        while queue:
            vertex = queue.popleft()
            result.append(vertex)

            for neighbor in self.get_neighbors(vertex):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        return result

    def dfs(self, start_vertex):
        """Duyệt theo chiều sâu (DFS) - phương pháp đệ quy"""
        if start_vertex not in self.vertices:
            return []

        visited = set()
        result = []

        def dfs_helper(vertex):
            visited.add(vertex)
            result.append(vertex)

            for neighbor in self.get_neighbors(vertex):
                if neighbor not in visited:
                    dfs_helper(neighbor)

        dfs_helper(start_vertex)
        return result

    def dfs_iterative(self, start_vertex):
        """Duyệt theo chiều sâu (DFS) - phương pháp lặp"""
        if start_vertex not in self.vertices:
            return []

        visited = set()
        stack = [start_vertex]
        result = []

        while stack:
            vertex = stack.pop()

            if vertex not in visited:
                visited.add(vertex)
                result.append(vertex)

                # Thêm các đỉnh kề vào stack (ngược lại để giữ thứ tự)
                neighbors = self.get_neighbors(vertex)
                for neighbor in reversed(neighbors):
                    if neighbor not in visited:
                        stack.append(neighbor)

        return result

    def has_path(self, start, end):
        """Kiểm tra xem có đường đi từ start đến end không"""
        if start not in self.vertices or end not in self.vertices:
            return False

        visited = set()
        queue = deque([start])

        while queue:
            vertex = queue.popleft()
            if vertex == end:
                return True

            if vertex not in visited:
                visited.add(vertex)
                for neighbor in self.get_neighbors(vertex):
                    if neighbor not in visited:
                        queue.append(neighbor)

        return False

    def print_graph(self):
        """In đồ thị"""
        for vertex in self.vertices:
            neighbors = self.get_neighbors(vertex)
            print(f"{vertex}: {neighbors}")

    def vertex_count(self):
        """Số đỉnh"""
        return len(self.vertices)

    def edge_count(self):
        """Số cạnh"""
        count = sum(len(neighbors) for neighbors in self.adjacency_list.values())
        return count if self.is_directed else count // 2

# Sử dụng:
# graph = Graph(directed=False)
# graph.add_edge(1, 2)
# graph.add_edge(2, 3)
# graph.add_edge(3, 4)
# print("BFS:", graph.bfs(1))
# print("DFS:", graph.dfs(1))`}
                height="400px"
              />
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-semibold mb-2">Độ Phức Tạp:</h4>
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