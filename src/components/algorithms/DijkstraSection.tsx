"use client";

import { useState, useEffect } from "react";
import { Route } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
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

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newGraph = wasmInstance.dataStructures.createWeightedGraph(true);

        // Initialize with default edges
        edgesDisplay.forEach(edge => {
          newGraph.addEdge(edge.from, edge.to, edge.weight);
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
        const edges = Array.from(rustGraph.getEdges()) as Edge[];
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
          rustGraph.addEdge(newEdge.from, newEdge.to, newEdge.weight);
          const edgeCount = rustGraph.edgeCount();
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
        rustGraph.removeEdge(edgeToRemove.from, edgeToRemove.to);
        const edgeCount = rustGraph.edgeCount();
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
        const dijkstraResult = rustGraph.dijkstra(startNode, endNode);
        const path = Array.from(dijkstraResult.path) as number[];
        const distances = Array.from(dijkstraResult.distances) as number[];

        setPathResult(path);
        setDistanceResult(distances);

        if (path.length > 0) {
          const totalDistance = distances[endNode];
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
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác Thuật toán Dijkstra sử dụng Rust WASM. Dijkstra được tối ưu hóa tìm đường đi ngắn nhất từ một node nguồn đến tất cả các node khác trong đồ thị có trọng số không âm với độ phức tạp O((V+E)logV).
        </p>

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
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
            <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`use std::collections::{BinaryHeap, HashMap};
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
        self.adj_list.entry(to).or_insert_with(Vec::new).push((from, weight));
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

    // Tìm đường đi ngắn nhất từ 0 đến 4
    if let Some((path, cost)) = graph.get_shortest_path(0, 4) {
        println!("Đường đi ngắn nhất: {:?}", path);
        println!("Tổng chi phí: {}", cost);
    } else {
        println!("Không có đường đi");
    }

    // Tìm khoảng cách ngắn nhất từ node 0 đến tất cả node khác
    let (distances, _) = graph.dijkstra(0);
    for (node, distance) in distances {
        println!("Khoảng cách từ 0 đến {}: {}", node,
                if distance == usize::MAX { "∞".to_string() } else { distance.to_string() });
    }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}