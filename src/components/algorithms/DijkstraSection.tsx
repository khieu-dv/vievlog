"use client";

import { useState } from "react";
import { Route } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";

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
  const [nodes, setNodes] = useState(5);
  const [edges, setEdges] = useState<Edge[]>([
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
  const [result, setResult] = useState<DijkstraResult | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const [newEdge, setNewEdge] = useState({ from: 0, to: 1, weight: 1 });

  const addEdge = () => {
    if (newEdge.from >= 0 && newEdge.from < nodes &&
        newEdge.to >= 0 && newEdge.to < nodes &&
        newEdge.from !== newEdge.to &&
        newEdge.weight > 0) {

      // Check if edge already exists
      const exists = edges.some(e =>
        (e.from === newEdge.from && e.to === newEdge.to) ||
        (e.from === newEdge.to && e.to === newEdge.from)
      );

      if (!exists) {
        setEdges([...edges, { ...newEdge }]);
      }
    }
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const dijkstra = () => {
    if (startNode < 0 || startNode >= nodes || endNode < 0 || endNode >= nodes) {
      return;
    }

    const distances = Array(nodes).fill(Infinity);
    const previous = Array(nodes).fill(null);
    const visited = Array(nodes).fill(false);
    const stepsList: string[] = [];

    distances[startNode] = 0;
    stepsList.push(`Khởi tạo: node ${startNode} có khoảng cách 0, các node khác có khoảng cách ∞`);

    // Build adjacency list
    const adjList: { [key: number]: { node: number; weight: number }[] } = {};
    for (let i = 0; i < nodes; i++) {
      adjList[i] = [];
    }

    edges.forEach(edge => {
      adjList[edge.from].push({ node: edge.to, weight: edge.weight });
      adjList[edge.to].push({ node: edge.from, weight: edge.weight });
    });

    for (let count = 0; count < nodes; count++) {
      // Find minimum distance node
      let minDistance = Infinity;
      let minNode = -1;

      for (let i = 0; i < nodes; i++) {
        if (!visited[i] && distances[i] < minDistance) {
          minDistance = distances[i];
          minNode = i;
        }
      }

      if (minNode === -1) break;

      visited[minNode] = true;
      stepsList.push(`Bước ${count + 1}: Chọn node ${minNode} (khoảng cách: ${distances[minNode]})`);

      // Update distances to neighbors
      adjList[minNode].forEach(({ node: neighbor, weight }) => {
        if (!visited[neighbor]) {
          const newDistance = distances[minNode] + weight;
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = minNode;
            stepsList.push(`  Cập nhật: node ${neighbor} khoảng cách ${distances[neighbor]} → ${newDistance} qua node ${minNode}`);
          }
        }
      });
    }

    // Build path
    const path: number[] = [];
    let current = endNode;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    if (path[0] !== startNode) {
      stepsList.push(`Không có đường đi từ node ${startNode} đến node ${endNode}`);
      setResult({
        distances,
        previous,
        visited,
        path: []
      });
    } else {
      stepsList.push(`Đường đi ngắn nhất từ ${startNode} đến ${endNode}: ${path.join(" → ")} (tổng khoảng cách: ${distances[endNode]})`);
      setResult({
        distances,
        previous,
        visited,
        path
      });
    }

    setSteps(stepsList);
  };

  const generateMermaidGraph = () => {
    let mermaidCode = "graph TD\n";

    // Add nodes
    for (let i = 0; i < nodes; i++) {
      const isStart = i === startNode;
      const isEnd = i === endNode;
      const isInPath = result?.path.includes(i) || false;

      let nodeStyle = "";
      if (isStart) nodeStyle = "fill:#4CAF50,color:#fff";
      else if (isEnd) nodeStyle = "fill:#F44336,color:#fff";
      else if (isInPath) nodeStyle = "fill:#FF9800,color:#fff";
      else nodeStyle = "fill:#2196F3,color:#fff";

      mermaidCode += `    ${i}[Node ${i}]\n`;
      mermaidCode += `    style ${i} ${nodeStyle}\n`;
    }

    // Add edges
    edges.forEach(edge => {
      const isInPath = result?.path.includes(edge.from) && result?.path.includes(edge.to) &&
                     Math.abs(result.path.indexOf(edge.from) - result.path.indexOf(edge.to)) === 1;

      if (isInPath) {
        mermaidCode += `    ${edge.from} -.->|${edge.weight}| ${edge.to}\n`;
        mermaidCode += `    linkStyle ${edges.indexOf(edge)} stroke:#FF9800,stroke-width:4px\n`;
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
          Thuật Toán Dijkstra
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Thuật toán Dijkstra tìm đường đi ngắn nhất từ một node nguồn đến tất cả các node khác trong đồ thị có trọng số không âm.
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
                      setEdges(edges.filter(e => e.from < newNodes && e.to < newNodes));
                      setResult(null);
                      setSteps([]);
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
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Thêm Cạnh
              </button>
            </div>

            <div className="max-h-32 overflow-y-auto">
              <h5 className="font-medium mb-2">Danh Sách Cạnh:</h5>
              {edges.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có cạnh nào</p>
              ) : (
                <div className="space-y-1">
                  {edges.map((edge, index) => (
                    <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 px-3 py-2 rounded">
                      <span className="text-sm">
                        Node {edge.from} → Node {edge.to} (trọng số: {edge.weight})
                      </span>
                      <button
                        onClick={() => removeEdge(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
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
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tìm Đường Đi Ngắn Nhất
            </button>

            {result && (
              <div className="mt-4 space-y-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <h5 className="font-medium mb-2">Kết Quả:</h5>
                  <div className="text-sm space-y-1">
                    <p><strong>Khoảng cách từ node {startNode}:</strong></p>
                    {result.distances.map((dist, i) => (
                      <p key={i} className="ml-4">
                        Node {i}: {dist === Infinity ? "∞" : dist}
                      </p>
                    ))}
                    {result.path.length > 0 && (
                      <p><strong>Đường đi ngắn nhất:</strong> {result.path.join(" → ")} (tổng: {result.distances[endNode]})</p>
                    )}
                  </div>
                </div>

                {steps.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <h5 className="font-medium mb-2">Các Bước Thực Hiện:</h5>
                    <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                      {steps.map((step, index) => (
                        <p key={index}>{step}</p>
                      ))}
                    </div>
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