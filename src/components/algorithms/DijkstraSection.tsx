"use client";

import { useState, useEffect } from "react";
import { Route } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface DijkstraResult {
  distances: number[];
  previous: (number | null)[];
  visited: boolean[];
  path: number[];
}

export function DijkstraSection() {
  const [rustGraph, setRustGraph] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [nodes, setNodes] = useState(5);
  const [edgesDisplay, setEdgesDisplay] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 8 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 4, weight: 2 },
  ]);
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(4);
  const [result, setResult] = useState("");
  const [pathResult, setPathResult] = useState<number[]>([]);
  const [distanceResult, setDistanceResult] = useState<number[]>([]);
  const [newEdge, setNewEdge] = useState({ from: 0, to: 1, weight: 1 });
  const [wasm, setWasm] = useState<any>(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newGraph = wasmInstance.dataStructures.createWeightedGraph(true);

        // Initialize with default edges
        edgesDisplay.forEach(edge => {
          newGraph.add_edge(edge.from, edge.to, edge.weight);
        });

        setRustGraph(newGraph);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Dijkstra Algorithm đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  // Update display from Rust graph
  const updateDisplayFromRustGraph = () => {
    if (rustGraph) {
      try {
        const edges = Array.from(rustGraph.get_edges()) as Edge[];
        setEdgesDisplay(edges);
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };

  const addEdge = () => {
    if (newEdge.from >= 0 && newEdge.from < nodes &&
        newEdge.to >= 0 && newEdge.to < nodes &&
        newEdge.from !== newEdge.to &&
        newEdge.weight > 0) {

      if (wasmReady && rustGraph) {
        try {
          rustGraph.add_edge(newEdge.from, newEdge.to, newEdge.weight);
          const edges = Array.from(rustGraph.get_edges());
          const edgeCount = edges.length;
          setResult(`🦀 Đã thêm cạnh từ ${newEdge.from} đến ${newEdge.to} (trọng số ${newEdge.weight}). Tổng cạnh: ${edgeCount}`);
          updateDisplayFromRustGraph();
        } catch (error) {
          setResult("❌ Rust WASM addEdge failed: " + error);
        }
      } else {
        setResult("❌ WASM chưa sẵn sàng");
      }
    }
  };

  const removeEdge = (index: number) => {
    const edgeToRemove = edgesDisplay[index];
    if (wasmReady && rustGraph && edgeToRemove) {
      try {
        // WeightedGraph doesn't have remove_edge method, need to rebuild
        const newGraph = wasm.dataStructures.createWeightedGraph(true);
        const updatedEdges = edgesDisplay.filter((_, i) => i !== index);
        updatedEdges.forEach(edge => {
          newGraph.add_edge(edge.from, edge.to, edge.weight);
        });
        setRustGraph(newGraph);
        setEdgesDisplay(updatedEdges);
        const edges = Array.from(rustGraph.get_edges());
        const edgeCount = edges.length;
        setResult(`🦀 Đã xóa cạnh từ ${edgeToRemove.from} đến ${edgeToRemove.to}. Tổng cạnh: ${edgeCount}`);
        updateDisplayFromRustGraph();
      } catch (error) {
        setResult("❌ Rust WASM removeEdge failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const dijkstra = () => {
    if (startNode < 0 || startNode >= nodes || endNode < 0 || endNode >= nodes) {
      setResult("❌ Đỉnh bắt đầu hoặc kết thúc không hợp lệ");
      return;
    }

    if (wasmReady && rustGraph) {
      try {
        // dijkstra() returns distances from start to all vertices
        const dijkstraResult = rustGraph.dijkstra(startNode);
        const distanceArray = Array.from(dijkstraResult) as number[];

        // Use shortest_path_with_weights for getting the actual path
        const pathResult = rustGraph.shortest_path_with_weights(startNode, endNode);
        const path = pathResult.length > 0 ? Array.from(pathResult[0]) as number[] : [];
        const totalDistance = pathResult.length > 1 ? pathResult[1] : Infinity;

        setPathResult(path);
        setDistanceResult(distanceArray);

        if (path.length > 0) {
          setResult(`🦀 Đường đi ngắn nhất từ ${startNode} đến ${endNode}: ${path.join(" → ")} (tổng khoảng cách: ${totalDistance})`);
        } else {
          setResult(`🦀 Không có đường đi từ node ${startNode} đến node ${endNode}`);
        }
      } catch (error) {
        setResult("❌ Rust WASM Dijkstra failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const generateMermaidGraph = () => {
    let mermaidCode = "graph TD\n";

    // Add nodes
    for (let i = 0; i < nodes; i++) {
      const isStart = i === startNode;
      const isEnd = i === endNode;
      const isInPath = pathResult.includes(i) || false;

      let nodeStyle = "";
      if (isStart) nodeStyle = "fill:#4CAF50,color:#fff";
      else if (isEnd) nodeStyle = "fill:#F44336,color:#fff";
      else if (isInPath) nodeStyle = "fill:#FF9800,color:#fff";
      else nodeStyle = "fill:#2196F3,color:#fff";

      mermaidCode += `    ${i}[Node ${i}]\n`;
      mermaidCode += `    style ${i} ${nodeStyle}\n`;
    }

    // Add edges
    edgesDisplay.forEach(edge => {
      const isInPath = pathResult.includes(edge.from) && pathResult.includes(edge.to) &&
                     Math.abs(pathResult.indexOf(edge.from) - pathResult.indexOf(edge.to)) === 1;

      if (isInPath) {
        mermaidCode += `    ${edge.from} -.->|${edge.weight}| ${edge.to}\n`;
        mermaidCode += `    linkStyle ${edgesDisplay.indexOf(edge)} stroke:#FF9800,stroke-width:4px\n`;
      } else {
        mermaidCode += `    ${edge.from} -->|${edge.weight}| ${edge.to}\n`;
      }
    });

    return mermaidCode;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Route className="h-5 w-5" />
          🦀 Rust WASM Thuật Toán Dijkstra
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-4 border-l-4 border-emerald-500">
          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">🗺️ Thuật toán Dijkstra là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Thuật toán Dijkstra</strong> tìm đường đi ngắn nhất từ một điểm xuất phát đến tất cả các điểm khác trong đồ thị có trọng số không âm.
            Được phát minh bởi Edsger Dijkstra năm 1956.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">🎯 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Google Maps, GPS</li>
                <li>• Định tuyến mạng Internet</li>
                <li>• Game: AI tìm đường</li>
                <li>• Hệ thống giao thông</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">💡 Ý tưởng chính:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Bắt đầu từ node gốc</li>
                <li>• Luôn chọn node gần nhất</li>
                <li>• Cập nhật khoảng cách</li>
                <li>• Lặp đến khi hoàn thành</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg mb-4 border-l-4 border-sky-500">
          <h4 className="font-semibold text-sky-800 dark:text-sky-300 mb-2">⚙️ Cách hoạt động:</h4>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              Bước 1: Đặt khoảng cách = 0 cho node gốc, ∞ cho các node khác
            </span>
            <br/>
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
              Bước 2: Chọn node chưa thăm có khoảng cách nhỏ nhất
            </span>
            <br/>
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
              Bước 3: Cập nhật khoảng cách đến các node láng giềng
            </span>
            <br/>
            <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
              Bước 4: Lặp cho đến khi tất cả node được thăm
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cấu Hình Đồ Thị:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Số node:</label>
                <input
                  type="number"
                  value={nodes}
                  onChange={(e) => {
                    const newNodes = parseInt(e.target.value);
                    if (newNodes >= 2 && newNodes <= 10) {
                      setNodes(newNodes);
                      setEdgesDisplay(edgesDisplay.filter(e => e.from < newNodes && e.to < newNodes));
                      setResult("");
                      setPathResult([]);
                      setDistanceResult([]);
                    }
                  }}
                  min="2"
                  max="10"
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Node bắt đầu:</label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                >
                  {Array.from({ length: nodes }, (_, i) => (
                    <option key={i} value={i}>Node {i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Node kết thúc:</label>
                <select
                  value={endNode}
                  onChange={(e) => setEndNode(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                >
                  {Array.from({ length: nodes }, (_, i) => (
                    <option key={i} value={i}>Node {i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Quản Lý Cạnh:</h4>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <input
                type="number"
                value={newEdge.from}
                onChange={(e) => setNewEdge({ ...newEdge, from: parseInt(e.target.value) || 0 })}
                placeholder="Từ node"
                min="0"
                max={nodes - 1}
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <input
                type="number"
                value={newEdge.to}
                onChange={(e) => setNewEdge({ ...newEdge, to: parseInt(e.target.value) || 0 })}
                placeholder="Đến node"
                min="0"
                max={nodes - 1}
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <input
                type="number"
                value={newEdge.weight}
                onChange={(e) => setNewEdge({ ...newEdge, weight: parseInt(e.target.value) || 1 })}
                placeholder="Trọng số"
                min="1"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={addEdge}
                disabled={!wasmReady}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                🦀 Thêm Cạnh
              </button>
            </div>

            <div className="max-h-32 overflow-y-auto">
              <h5 className="font-medium mb-2">Danh Sách Cạnh:</h5>
              {edgesDisplay.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có cạnh nào</p>
              ) : (
                <div className="space-y-1">
                  {edgesDisplay.map((edge, index) => (
                    <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 px-3 py-2 rounded">
                      <span className="text-sm">
                        🦀 Node {edge.from} → Node {edge.to} (trọng số: {edge.weight})
                      </span>
                      <button
                        onClick={() => removeEdge(index)}
                        disabled={!wasmReady}
                        className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thực Hiện Dijkstra:</h4>
            <button
              onClick={dijkstra}
              disabled={!wasmReady}
              className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              🦀 Tìm Đường Đi Ngắn Nhất
            </button>

            {result && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong>Kết quả:</strong> {result}
                {pathResult.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p><strong>🦀 Đường đi:</strong> {pathResult.join(" → ")}</p>
                    {distanceResult.length > 0 && (
                      <div className="mt-1">
                        <strong>🦀 Khoảng cách từ node {startNode}:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {distanceResult.map((dist, i) => (
                            <span key={i} className="px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded text-xs">
                              Node {i}: {dist === Infinity ? "∞" : dist}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Trực Quan Hóa Đồ Thị:</h4>
            <MermaidDiagram
              chart={generateMermaidGraph()}
              className="mb-4"
            />
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Node bắt đầu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Node kết thúc</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>Đường đi ngắn nhất</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Thuật Toán Dijkstra:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    START([Bắt đầu]) --> INIT[Khởi tạo khoảng cách]
                    INIT --> SET_SOURCE[Đặt khoảng cách node nguồn = 0]
                    SET_SOURCE --> MAIN_LOOP{Còn node chưa thăm?}

                    MAIN_LOOP -->|Có| FIND_MIN[Tìm node chưa thăm có khoảng cách min]
                    FIND_MIN --> MARK_VISITED[Đánh dấu node đã thăm]
                    MARK_VISITED --> UPDATE_NEIGHBORS[Cập nhật khoảng cách các node lân cận]
                    UPDATE_NEIGHBORS --> CHECK_RELAXATION{Có thể giảm khoảng cách?}

                    CHECK_RELAXATION -->|Có| RELAX[Cập nhật khoảng cách và previous]
                    CHECK_RELAXATION -->|Không| NEXT_NEIGHBOR[Xét node lân cận tiếp theo]
                    RELAX --> NEXT_NEIGHBOR
                    NEXT_NEIGHBOR --> MAIN_LOOP

                    MAIN_LOOP -->|Không| BUILD_PATH[Xây dựng đường đi từ previous array]
                    BUILD_PATH --> END([Kết thúc])

                    style START fill:#4CAF50,color:#fff
                    style END fill:#F44336,color:#fff
                    style FIND_MIN fill:#2196F3,color:#fff
                    style RELAX fill:#FF9800,color:#fff
              `}
              className="mb-4"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Độ Phức Tạp và Ứng Dụng:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Độ Phức Tạp:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Thời gian:</strong> O((V + E) log V) với priority queue</li>
                  <li>• <strong>Thời gian:</strong> O(V²) với array đơn giản</li>
                  <li>• <strong>Không gian:</strong> O(V)</li>
                  <li>• <strong>V:</strong> số đỉnh, <strong>E:</strong> số cạnh</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Ứng Dụng:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• GPS navigation và routing</li>
                  <li>• Network routing protocols</li>
                  <li>• Social network analysis</li>
                  <li>• Flight connections</li>
                  <li>• Game pathfinding</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-4">Cài Đặt:</h4>

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="border-b border-gray-200 dark:border-gray-600">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveLanguageTab("rust")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "rust"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Rust
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("cpp")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "cpp"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    C++
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("python")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "python"
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
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
                code={`use std::collections::{BinaryHeap, HashMap};
use std::cmp::Ordering;

#[derive(Debug, Clone, Eq, PartialEq)]
struct State {
    cost: usize,
    position: usize,
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost) // Min-heap
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

#[derive(Debug, Clone)]
pub struct Graph {
    adj_list: HashMap<usize, Vec<(usize, usize)>>, // node -> [(neighbor, weight)]
}

impl Graph {
    pub fn new() -> Self {
        Graph {
            adj_list: HashMap::new(),
        }
    }

    pub fn add_edge(&mut self, from: usize, to: usize, weight: usize) {
        self.adj_list.entry(from).or_insert_with(Vec::new).push((to, weight));
        // Chú ý: Đồ thị có hướng hoặc không?
        // self.adj_list.entry(to).or_insert_with(Vec::new).push((from, weight));
    }

    pub fn dijkstra(&self, start: usize) -> (HashMap<usize, usize>, HashMap<usize, Option<usize>>) {
        let mut distances = HashMap::new();
        let mut previous = HashMap::new();
        let mut heap = BinaryHeap::new();

        // Khởi tạo
        for &node in self.adj_list.keys() {
            distances.insert(node, usize::MAX);
            previous.insert(node, None);
        }
        distances.insert(start, 0);
        heap.push(State { cost: 0, position: start });

        while let Some(State { cost, position }) = heap.pop() {
            // Bỏ qua nếu đã tìm được đường đi tốt hơn
            if cost > *distances.get(&position).unwrap_or(&usize::MAX) {
                continue;
            }

            // Xét các node lân cận
            if let Some(neighbors) = self.adj_list.get(&position) {
                for &(neighbor, weight) in neighbors {
                    let new_cost = cost + weight;

                    if new_cost < *distances.get(&neighbor).unwrap_or(&usize::MAX) {
                        distances.insert(neighbor, new_cost);
                        previous.insert(neighbor, Some(position));
                        heap.push(State { cost: new_cost, position: neighbor });
                    }
                }
            }
        }

        (distances, previous)
    }

    pub fn get_shortest_path(&self, start: usize, end: usize) -> Option<(Vec<usize>, usize)> {
        let (distances, previous) = self.dijkstra(start);

        if let Some(&total_cost) = distances.get(&end) {
            if total_cost == usize::MAX {
                return None; // Không có đường đi
            }

            let mut path = Vec::new();
            let mut current = Some(end);

            while let Some(node) = current {
                path.push(node);
                current = *previous.get(&node)?;
            }

            path.reverse();
            Some((path, total_cost))
        } else {
            None
        }
    }

    // Phân tích thờ phức tạp
    pub fn analyze_complexity(&self) {
        let num_vertices = self.adj_list.len();
        let num_edges: usize = self.adj_list.values().map(|v| v.len()).sum();

        println!("Số đỉnh (V): {}", num_vertices);
        println!("Số cạnh (E): {}", num_edges);
        println!("Thời gian: O((V + E) log V) = O(({} + {}) log {})",
                 num_vertices, num_edges, num_vertices);
        println!("Không gian: O(V) = O({})", num_vertices);
    }
}

// A* Algorithm - mở rộng của Dijkstra với heuristic
fn a_star_search(graph: &Graph, start: usize, goal: usize, heuristic: fn(usize, usize) -> usize)
    -> Option<(Vec<usize>, usize)> {
    use std::collections::BinaryHeap;

    #[derive(Eq, PartialEq)]
    struct AStarState {
        f_cost: usize, // g + h
        g_cost: usize, // actual cost
        position: usize,
    }

    impl Ord for AStarState {
        fn cmp(&self, other: &Self) -> Ordering {
            other.f_cost.cmp(&self.f_cost)
        }
    }

    impl PartialOrd for AStarState {
        fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
            Some(self.cmp(other))
        }
    }

    let mut open_set = BinaryHeap::new();
    let mut came_from = HashMap::new();
    let mut g_score = HashMap::new();

    g_score.insert(start, 0);
    open_set.push(AStarState {
        f_cost: heuristic(start, goal),
        g_cost: 0,
        position: start,
    });

    while let Some(current) = open_set.pop() {
        if current.position == goal {
            // Reconstruct path
            let mut path = vec![goal];
            let mut current_node = goal;

            while let Some(&prev) = came_from.get(&current_node) {
                path.push(prev);
                current_node = prev;
            }

            path.reverse();
            return Some((path, current.g_cost));
        }

        if let Some(neighbors) = graph.adj_list.get(&current.position) {
            for &(neighbor, weight) in neighbors {
                let tentative_g = current.g_cost + weight;

                if tentative_g < *g_score.get(&neighbor).unwrap_or(&usize::MAX) {
                    came_from.insert(neighbor, current.position);
                    g_score.insert(neighbor, tentative_g);
                    let f_score = tentative_g + heuristic(neighbor, goal);

                    open_set.push(AStarState {
                        f_cost: f_score,
                        g_cost: tentative_g,
                        position: neighbor,
                    });
                }
            }
        }
    }

    None
}

// Sử dụng
fn main() {
    let mut graph = Graph::new();

    // Thêm các cạnh
    graph.add_edge(0, 1, 4);
    graph.add_edge(0, 2, 2);
    graph.add_edge(1, 2, 1);
    graph.add_edge(1, 3, 5);
    graph.add_edge(2, 3, 8);
    graph.add_edge(2, 4, 10);
    graph.add_edge(3, 4, 2);

    // Phân tích đồ thị
    graph.analyze_complexity();

    // Tìm đường đi ngắn nhất từ 0 đến 4
    if let Some((path, cost)) = graph.get_shortest_path(0, 4) {
        println!("Đường đi ngắn nhất: {:?}", path);
        println!("Tổng chi phí: {}", cost);
    } else {
        println!("Không có đường đi");
    }

    // Tìm khoảng cách ngắn nhất từ node 0 đến tất cả node khác
    let (distances, _) = graph.dijkstra(0);
    println!("\nKhoảng cách từ node 0:");
    for (node, distance) in distances {
        println!("  Đến node {}: {}", node,
                if distance == usize::MAX { "∞".to_string() } else { distance.to_string() });
    }

    // Ví dụ với A* (hàm heuristic đơn giản)
    let manhattan_heuristic = |a: usize, b: usize| {
        // Đây chỉ là ví dụ, thực tế cần tọa độ thực
        (a as i32 - b as i32).abs() as usize
    };

    if let Some((astar_path, astar_cost)) = a_star_search(&graph, 0, 4, manhattan_heuristic) {
        println!("\nA* path: {:?}, cost: {}", astar_path, astar_cost);
    }
}`}
                height="500px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <limits>
#include <algorithm>

const int INF = std::numeric_limits<int>::max();

struct Edge {
    int to;
    int weight;

    Edge(int t, int w) : to(t), weight(w) {}
};

struct State {
    int cost;
    int node;

    State(int c, int n) : cost(c), node(n) {}

    // Đối với priority_queue, cần operator> để tạo min-heap
    bool operator>(const State& other) const {
        return cost > other.cost;
    }
};

class Graph {
private:
    std::unordered_map<int, std::vector<Edge>> adj_list;

public:
    void addEdge(int from, int to, int weight) {
        adj_list[from].emplace_back(to, weight);
        // Nếu là đồ thị vô hướng
        // adj_list[to].emplace_back(from, weight);
    }

    std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>>
    dijkstra(int start) {
        std::unordered_map<int, int> distances;
        std::unordered_map<int, int> previous;
        std::priority_queue<State, std::vector<State>, std::greater<State>> pq;

        // Khởi tạo khoảng cách
        for (const auto& pair : adj_list) {
            distances[pair.first] = INF;
            previous[pair.first] = -1;
            // Cũng cần khởi tạo cho các node đích
            for (const auto& edge : pair.second) {
                if (distances.find(edge.to) == distances.end()) {
                    distances[edge.to] = INF;
                    previous[edge.to] = -1;
                }
            }
        }

        distances[start] = 0;
        pq.push(State(0, start));

        while (!pq.empty()) {
            State current = pq.top();
            pq.pop();

            // Bỏ qua nếu đã tìm được đường đi tốt hơn
            if (current.cost > distances[current.node]) {
                continue;
            }

            // Xét các node lân cận
            if (adj_list.find(current.node) != adj_list.end()) {
                for (const auto& edge : adj_list[current.node]) {
                    int new_cost = current.cost + edge.weight;

                    if (new_cost < distances[edge.to]) {
                        distances[edge.to] = new_cost;
                        previous[edge.to] = current.node;
                        pq.push(State(new_cost, edge.to));
                    }
                }
            }
        }

        return {distances, previous};
    }

    std::pair<std::vector<int>, int> getShortestPath(int start, int end) {
        auto [distances, previous] = dijkstra(start);

        if (distances[end] == INF) {
            return {{}, INF}; // Không có đường đi
        }

        std::vector<int> path;
        int current = end;

        while (current != -1) {
            path.push_back(current);
            current = previous[current];
        }

        std::reverse(path.begin(), path.end());
        return {path, distances[end]};
    }

    void analyzeComplexity() const {
        int num_vertices = adj_list.size();
        int num_edges = 0;

        for (const auto& pair : adj_list) {
            num_edges += pair.second.size();
        }

        std::cout << "Số đỉnh (V): " << num_vertices << std::endl;
        std::cout << "Số cạnh (E): " << num_edges << std::endl;
        std::cout << "Thời gian: O((V + E) log V) = O(("
                  << num_vertices << " + " << num_edges << ") log "
                  << num_vertices << ")" << std::endl;
        std::cout << "Không gian: O(V) = O(" << num_vertices << ")" << std::endl;
    }

    void printGraph() const {
        std::cout << "\nCấu trúc đồ thị:" << std::endl;
        for (const auto& pair : adj_list) {
            std::cout << "Node " << pair.first << ": ";
            for (const auto& edge : pair.second) {
                std::cout << "->" << edge.to << "(" << edge.weight << ") ";
            }
            std::cout << std::endl;
        }
    }
};

// A* Algorithm
struct AStarState {
    int f_cost; // g + h
    int g_cost; // actual cost
    int node;

    AStarState(int f, int g, int n) : f_cost(f), g_cost(g), node(n) {}

    bool operator>(const AStarState& other) const {
        return f_cost > other.f_cost;
    }
};

std::pair<std::vector<int>, int> aStarSearch(
    const Graph& graph,
    int start,
    int goal,
    std::function<int(int, int)> heuristic
) {
    std::priority_queue<AStarState, std::vector<AStarState>, std::greater<AStarState>> open_set;
    std::unordered_map<int, int> came_from;
    std::unordered_map<int, int> g_score;

    g_score[start] = 0;
    open_set.push(AStarState(heuristic(start, goal), 0, start));

    while (!open_set.empty()) {
        AStarState current = open_set.top();
        open_set.pop();

        if (current.node == goal) {
            // Reconstruct path
            std::vector<int> path = {goal};
            int current_node = goal;

            while (came_from.find(current_node) != came_from.end()) {
                current_node = came_from[current_node];
                path.push_back(current_node);
            }

            std::reverse(path.begin(), path.end());
            return {path, current.g_cost};
        }

        // Xử lý các node lân cận (cần truy cập adj_list)
        // Đây là ví dụ đơn giản, thực tế cần method public hoặc friend class
    }

    return {{}, INF};
}

// Biến thể Dijkstra cho đồ thị dạng ma trận
std::vector<int> dijkstraMatrix(const std::vector<std::vector<int>>& graph, int start) {
    int n = graph.size();
    std::vector<int> dist(n, INF);
    std::vector<bool> visited(n, false);

    dist[start] = 0;

    for (int count = 0; count < n - 1; count++) {
        // Tìm node chưa thăm có khoảng cách nhỏ nhất
        int min_dist = INF;
        int u = -1;

        for (int v = 0; v < n; v++) {
            if (!visited[v] && dist[v] < min_dist) {
                min_dist = dist[v];
                u = v;
            }
        }

        if (u == -1) break; // Không còn node nào đến được

        visited[u] = true;

        // Cập nhật khoảng cách các node lân cận
        for (int v = 0; v < n; v++) {
            if (!visited[v] && graph[u][v] != 0 &&
                dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    return dist;
}

int main() {
    Graph graph;

    // Thêm các cạnh
    graph.addEdge(0, 1, 4);
    graph.addEdge(0, 2, 2);
    graph.addEdge(1, 2, 1);
    graph.addEdge(1, 3, 5);
    graph.addEdge(2, 3, 8);
    graph.addEdge(2, 4, 10);
    graph.addEdge(3, 4, 2);

    // In cấu trúc đồ thị
    graph.printGraph();

    // Phân tích độ phức tạp
    std::cout << "\nPhân tích độ phức tạp:" << std::endl;
    graph.analyzeComplexity();

    // Tìm đường đi ngắn nhất từ 0 đến 4
    auto [path, cost] = graph.getShortestPath(0, 4);

    if (cost != INF) {
        std::cout << "\nĐường đi ngắn nhất từ 0 đến 4: ";
        for (int i = 0; i < path.size(); i++) {
            std::cout << path[i];
            if (i < path.size() - 1) std::cout << " -> ";
        }
        std::cout << "\nTổng chi phí: " << cost << std::endl;
    } else {
        std::cout << "\nKhông có đường đi từ 0 đến 4" << std::endl;
    }

    // Tìm khoảng cách ngắn nhất từ node 0 đến tất cả node khác
    auto [distances, previous] = graph.dijkstra(0);
    std::cout << "\nKhoảng cách ngắn nhất từ node 0:" << std::endl;
    for (const auto& pair : distances) {
        std::cout << "  Đến node " << pair.first << ": ";
        if (pair.second == INF) {
            std::cout << "∞" << std::endl;
        } else {
            std::cout << pair.second << std::endl;
        }
    }

    // Ví dụ với ma trận kề (cho đồ thị nhỏ)
    std::cout << "\nVí dụ với ma trận kề (Dijkstra phiên bản O(V²)):" << std::endl;
    std::vector<std::vector<int>> matrix = {
        {0, 4, 2, 0, 0},
        {0, 0, 1, 5, 0},
        {0, 0, 0, 8, 10},
        {0, 0, 0, 0, 2},
        {0, 0, 0, 0, 0}
    };

    auto matrix_distances = dijkstraMatrix(matrix, 0);
    for (int i = 0; i < matrix_distances.size(); i++) {
        std::cout << "  Đến node " << i << ": ";
        if (matrix_distances[i] == INF) {
            std::cout << "∞" << std::endl;
        } else {
            std::cout << matrix_distances[i] << std::endl;
        }
    }

    return 0;
}`}
                height="500px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`import heapq
from collections import defaultdict, deque
from typing import Dict, List, Tuple, Optional, Set
import math

class Graph:
    def __init__(self):
        self.adj_list = defaultdict(list)  # node -> [(neighbor, weight)]

    def add_edge(self, from_node: int, to_node: int, weight: int):
        """Thêm cạnh vào đồ thị"""
        self.adj_list[from_node].append((to_node, weight))
        # Nếu là đồ thị vô hướng
        # self.adj_list[to_node].append((from_node, weight))

    def dijkstra(self, start: int) -> Tuple[Dict[int, int], Dict[int, Optional[int]]]:
        """Thuật toán Dijkstra trả về distances và previous nodes"""
        distances = defaultdict(lambda: float('inf'))
        previous = {}
        heap = [(0, start)]  # (distance, node)
        visited = set()

        distances[start] = 0

        while heap:
            current_dist, current_node = heapq.heappop(heap)

            # Bỏ qua nếu đã thăm
            if current_node in visited:
                continue

            visited.add(current_node)

            # Xét các node lân cận
            for neighbor, weight in self.adj_list[current_node]:
                if neighbor not in visited:
                    new_distance = current_dist + weight

                    if new_distance < distances[neighbor]:
                        distances[neighbor] = new_distance
                        previous[neighbor] = current_node
                        heapq.heappush(heap, (new_distance, neighbor))

        return dict(distances), previous

    def get_shortest_path(self, start: int, end: int) -> Optional[Tuple[List[int], int]]:
        """Tìm đường đi ngắn nhất giữa hai node"""
        distances, previous = self.dijkstra(start)

        if end not in distances or distances[end] == float('inf'):
            return None  # Không có đường đi

        # Xây dựng đường đi
        path = []
        current = end

        while current is not None:
            path.append(current)
            current = previous.get(current)

        path.reverse()
        return path, distances[end]

    def analyze_complexity(self):
        """Phân tích độ phức tạp của đồ thị"""
        num_vertices = len(self.adj_list)
        num_edges = sum(len(neighbors) for neighbors in self.adj_list.values())

        print(f"Số đỉnh (V): {num_vertices}")
        print(f"Số cạnh (E): {num_edges}")
        print(f"Thời gian: O((V + E) log V) = O(({num_vertices} + {num_edges}) log {num_vertices})")
        print(f"Không gian: O(V) = O({num_vertices})")

    def print_graph(self):
        """In cấu trúc đồ thị"""
        print("\nCấu trúc đồ thị:")
        for node, neighbors in self.adj_list.items():
            edges = " ".join([f"->{neighbor}({weight})" for neighbor, weight in neighbors])
            print(f"Node {node}: {edges}")

def dijkstra_simple(graph: Dict[int, List[Tuple[int, int]]], start: int) -> Dict[int, int]:
    """Phiên bản đơn giản của Dijkstra"""
    distances = {node: float('inf') for node in graph.keys()}
    distances[start] = 0
    unvisited = set(graph.keys())

    while unvisited:
        # Tìm node chưa thăm có khoảng cách nhỏ nhất
        current = min(unvisited, key=lambda x: distances[x])

        if distances[current] == float('inf'):
            break  # Không còn node nào đến được

        unvisited.remove(current)

        # Cập nhật khoảng cách các node lân cận
        for neighbor, weight in graph.get(current, []):
            if neighbor in unvisited:
                new_distance = distances[current] + weight
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance

    return distances

def a_star_search(graph: Dict[int, List[Tuple[int, int]]],
                  start: int,
                  goal: int,
                  heuristic) -> Optional[Tuple[List[int], int]]:
    """Thuật toán A* - mở rộng của Dijkstra với heuristic"""
    open_set = [(0, start)]  # (f_score, node)
    came_from = {}
    g_score = defaultdict(lambda: float('inf'))
    g_score[start] = 0
    f_score = defaultdict(lambda: float('inf'))
    f_score[start] = heuristic(start, goal)

    open_set_hash = {start}

    while open_set:
        current = heapq.heappop(open_set)[1]
        open_set_hash.discard(current)

        if current == goal:
            # Xây dựng đường đi
            path = [goal]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            path.reverse()
            return path, g_score[goal]

        for neighbor, weight in graph.get(current, []):
            tentative_g = g_score[current] + weight

            if tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + heuristic(neighbor, goal)

                if neighbor not in open_set_hash:
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
                    open_set_hash.add(neighbor)

    return None

def bellman_ford(graph: Dict[int, List[Tuple[int, int]]], start: int) -> Tuple[Dict[int, float], bool]:
    """Thuật toán Bellman-Ford - xử lý cạnh âm"""
    # Lấy tất cả các node
    all_nodes = set(graph.keys())
    for neighbors in graph.values():
        for neighbor, _ in neighbors:
            all_nodes.add(neighbor)

    distances = {node: float('inf') for node in all_nodes}
    distances[start] = 0

    # Thư giãn V-1 lần
    for _ in range(len(all_nodes) - 1):
        for node in graph:
            if distances[node] != float('inf'):
                for neighbor, weight in graph[node]:
                    new_dist = distances[node] + weight
                    if new_dist < distances[neighbor]:
                        distances[neighbor] = new_dist

    # Kiểm tra chu trình âm
    has_negative_cycle = False
    for node in graph:
        if distances[node] != float('inf'):
            for neighbor, weight in graph[node]:
                if distances[node] + weight < distances[neighbor]:
                    has_negative_cycle = True
                    break
        if has_negative_cycle:
            break

    return distances, has_negative_cycle

def floyd_warshall(graph: Dict[int, List[Tuple[int, int]]]) -> Dict[Tuple[int, int], float]:
    """Thuật toán Floyd-Warshall - tìm đường đi ngắn nhất giữa mọi cặp node"""
    # Lấy tất cả các node
    all_nodes = set(graph.keys())
    for neighbors in graph.values():
        for neighbor, _ in neighbors:
            all_nodes.add(neighbor)
    all_nodes = sorted(list(all_nodes))

    # Khởi tạo ma trận khoảng cách
    dist = {}
    for i in all_nodes:
        for j in all_nodes:
            if i == j:
                dist[(i, j)] = 0
            else:
                dist[(i, j)] = float('inf')

    # Điền các cạnh
    for node, neighbors in graph.items():
        for neighbor, weight in neighbors:
            dist[(node, neighbor)] = weight

    # Thuật toán Floyd-Warshall
    for k in all_nodes:
        for i in all_nodes:
            for j in all_nodes:
                if dist[(i, k)] + dist[(k, j)] < dist[(i, j)]:
                    dist[(i, j)] = dist[(i, k)] + dist[(k, j)]

    return dist

def visualize_shortest_path(graph: Graph, start: int, end: int):
    """Trực quan hóa đường đi ngắn nhất"""
    result = graph.get_shortest_path(start, end)
    if result is None:
        print(f"Không có đường đi từ {start} đến {end}")
        return

    path, total_cost = result
    print(f"Đường đi ngắn nhất từ {start} đến {end}:")
    print(f"Path: {' -> '.join(map(str, path))}")
    print(f"Tổng chi phí: {total_cost}")

    # Hiển thị từng bước
    print("\nChi tiết từng bước:")
    for i in range(len(path) - 1):
        current = path[i]
        next_node = path[i + 1]

        # Tìm trọng số cạnh
        for neighbor, weight in graph.adj_list[current]:
            if neighbor == next_node:
                print(f"  Bước {i + 1}: {current} -> {next_node} (chi phí: {weight})")
                break

# Ví dụ sử dụng
if __name__ == "__main__":
    # Tạo đồ thị
    graph = Graph()

    # Thêm các cạnh
    edges = [
        (0, 1, 4),
        (0, 2, 2),
        (1, 2, 1),
        (1, 3, 5),
        (2, 3, 8),
        (2, 4, 10),
        (3, 4, 2)
    ]

    for from_node, to_node, weight in edges:
        graph.add_edge(from_node, to_node, weight)

    # In thông tin đồ thị
    graph.print_graph()
    print("\nPhân tích độ phức tạp:")
    graph.analyze_complexity()

    # Tìm đường đi ngắn nhất từ 0 đến 4
    print("\n" + "="*50)
    visualize_shortest_path(graph, 0, 4)

    # Tìm khoảng cách từ node 0 đến tất cả node khác
    distances, previous = graph.dijkstra(0)
    print("\n" + "="*50)
    print("Khoảng cách ngắn nhất từ node 0:")
    for node, distance in sorted(distances.items()):
        if distance == float('inf'):
            print(f"  Đến node {node}: ∞")
        else:
            print(f"  Đến node {node}: {distance}")

    # So sánh với phiên bản đơn giản
    print("\n" + "="*50)
    print("So sánh với Dijkstra đơn giản (không dùng heap):")

    # Chuyển đổi sang định dạng dictionary
    graph_dict = {node: neighbors for node, neighbors in graph.adj_list.items()}
    simple_distances = dijkstra_simple(graph_dict, 0)

    for node, distance in sorted(simple_distances.items()):
        if distance == float('inf'):
            print(f"  Đến node {node}: ∞")
        else:
            print(f"  Đến node {node}: {distance}")

    # Ví dụ với Bellman-Ford (cho đồ thị có cạnh âm)
    print("\n" + "="*50)
    print("Ví dụ Bellman-Ford (cho đồ thị có cạnh âm):")

    # Tạo đồ thị với cạnh âm
    negative_graph = {
        0: [(1, 4), (2, 2)],
        1: [(2, -3), (3, 2)],
        2: [(3, 4), (4, 2)],
        3: [(4, -1)],
        4: []
    }

    bf_distances, has_neg_cycle = bellman_ford(negative_graph, 0)
    print(f"Có chu trình âm: {has_neg_cycle}")
    for node, distance in sorted(bf_distances.items()):
        if distance == float('inf'):
            print(f"  Đến node {node}: ∞")
        else:
            print(f"  Đến node {node}: {distance}")

    # Ví dụ A* với heuristic đơn giản
    print("\n" + "="*50)
    print("Ví dụ A* với heuristic Manhattan:")

    def manhattan_heuristic(node1, node2):
        # Đây chỉ là ví dụ, thực tế cần tọa độ thật
        return abs(node1 - node2)

    astar_result = a_star_search(graph_dict, 0, 4, manhattan_heuristic)
    if astar_result:
        path, cost = astar_result
        print(f"A* path: {' -> '.join(map(str, path))}")
        print(f"A* cost: {cost}")
    else:
        print("A* không tìm thấy đường đi")

    # Sử dụng heap module của Python
    print("\n" + "="*50)
    print("Dijkstra với heapq của Python:")

    def dijkstra_with_heapq(graph_dict, start):
        distances = {node: float('inf') for node in graph_dict}
        distances[start] = 0
        heap = [(0, start)]
        visited = set()

        while heap:
            current_dist, current_node = heapq.heappop(heap)

            if current_node in visited:
                continue

            visited.add(current_node)

            for neighbor, weight in graph_dict.get(current_node, []):
                if neighbor not in visited:
                    new_dist = current_dist + weight
                    if new_dist < distances[neighbor]:
                        distances[neighbor] = new_dist
                        heapq.heappush(heap, (new_dist, neighbor))

        return distances

    heapq_distances = dijkstra_with_heapq(graph_dict, 0)
    for node, distance in sorted(heapq_distances.items()):
        if distance == float('inf'):
            print(f"  Đến node {node}: ∞")
        else:
            print(f"  Đến node {node}: {distance}")`}
                height="500px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}