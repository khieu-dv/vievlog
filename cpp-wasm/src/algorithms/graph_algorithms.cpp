#include "graph_algorithms.h"
#include <queue>
#include <stack>
#include <unordered_set>
#include <algorithm>
#include <limits>

namespace Algorithms {

    PathResult GraphAlgorithms::dijkstra_shortest_path(const Graph& graph, int start, int end) {
        auto distances = dijkstra_all_distances(graph, start);

        if (distances.find(end) == distances.end() ||
            distances[end] == std::numeric_limits<int>::max()) {
            return PathResult({}, -1, false);
        }

        auto path = graph.shortest_path_dijkstra(start, end);
        return PathResult(path, distances[end], true);
    }

    std::unordered_map<int, int> GraphAlgorithms::dijkstra_all_distances(const Graph& graph, int start) {
        return graph.shortest_distances_dijkstra(start);
    }

    std::unordered_map<int, PathResult> GraphAlgorithms::floyd_warshall(const Graph& graph) {
        std::unordered_map<int, PathResult> all_pairs;
        auto vertices = graph.get_vertices();
        int n = vertices.size();

        if (n == 0) return all_pairs;

        std::unordered_map<int, int> vertex_to_index;
        for (int i = 0; i < n; i++) {
            vertex_to_index[vertices[i]] = i;
        }

        std::vector<std::vector<int>> dist(n, std::vector<int>(n, std::numeric_limits<int>::max()));
        std::vector<std::vector<int>> next(n, std::vector<int>(n, -1));

        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }

        auto edges = graph.get_edges();
        for (const auto& edge : edges) {
            int u = vertex_to_index[edge.from];
            int v = vertex_to_index[edge.to];
            dist[u][v] = edge.weight;
            next[u][v] = v;
        }

        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (dist[i][k] != std::numeric_limits<int>::max() &&
                        dist[k][j] != std::numeric_limits<int>::max() &&
                        dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = next[i][k];
                    }
                }
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j && dist[i][j] != std::numeric_limits<int>::max()) {
                    std::vector<int> path;
                    int current = i;
                    while (current != j) {
                        path.push_back(vertices[current]);
                        current = next[current][j];
                        if (current == -1) break;
                    }
                    if (current == j) {
                        path.push_back(vertices[j]);
                        std::string key = std::to_string(vertices[i]) + "-" + std::to_string(vertices[j]);
                        all_pairs[vertices[i] * 10000 + vertices[j]] = PathResult(path, dist[i][j], true);
                    }
                }
            }
        }

        return all_pairs;
    }

    PathResult GraphAlgorithms::bellman_ford(const Graph& graph, int start, int end) {
        auto vertices = graph.get_vertices();
        std::unordered_map<int, int> distance;
        std::unordered_map<int, int> predecessor;

        for (int vertex : vertices) {
            distance[vertex] = std::numeric_limits<int>::max();
        }
        distance[start] = 0;

        auto edges = graph.get_edges();

        for (int i = 0; i < vertices.size() - 1; i++) {
            for (const auto& edge : edges) {
                if (distance[edge.from] != std::numeric_limits<int>::max()) {
                    int new_dist = distance[edge.from] + edge.weight;
                    if (new_dist < distance[edge.to]) {
                        distance[edge.to] = new_dist;
                        predecessor[edge.to] = edge.from;
                    }
                }
            }
        }

        for (const auto& edge : edges) {
            if (distance[edge.from] != std::numeric_limits<int>::max() &&
                distance[edge.from] + edge.weight < distance[edge.to]) {
                return PathResult({}, -1, false);
            }
        }

        if (distance[end] == std::numeric_limits<int>::max()) {
            return PathResult({}, -1, false);
        }

        std::vector<int> path;
        int current = end;
        while (predecessor.find(current) != predecessor.end()) {
            path.push_back(current);
            current = predecessor[current];
        }
        path.push_back(start);
        std::reverse(path.begin(), path.end());

        return PathResult(path, distance[end], true);
    }

    void GraphAlgorithms::UnionFind::make_set(int x) {
        if (parent.find(x) == parent.end()) {
            parent[x] = x;
            rank[x] = 0;
        }
    }

    int GraphAlgorithms::UnionFind::find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    bool GraphAlgorithms::UnionFind::union_sets(int x, int y) {
        int root_x = find(x);
        int root_y = find(y);

        if (root_x == root_y) {
            return false;
        }

        if (rank[root_x] < rank[root_y]) {
            parent[root_x] = root_y;
        } else if (rank[root_x] > rank[root_y]) {
            parent[root_y] = root_x;
        } else {
            parent[root_y] = root_x;
            rank[root_x]++;
        }

        return true;
    }

    std::vector<MST_Edge> GraphAlgorithms::kruskal_mst(const Graph& graph) {
        std::vector<MST_Edge> mst;
        auto edges = graph.get_edges();
        auto vertices = graph.get_vertices();

        std::sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) {
            return a.weight < b.weight;
        });

        UnionFind uf;
        for (int vertex : vertices) {
            uf.make_set(vertex);
        }

        for (const auto& edge : edges) {
            if (uf.union_sets(edge.from, edge.to)) {
                mst.emplace_back(edge.from, edge.to, edge.weight);
                if (mst.size() == vertices.size() - 1) {
                    break;
                }
            }
        }

        return mst;
    }

    std::vector<MST_Edge> GraphAlgorithms::prim_mst(const Graph& graph, int start) {
        std::vector<MST_Edge> mst;
        auto vertices = graph.get_vertices();

        if (vertices.empty()) return mst;

        if (start == -1) {
            start = vertices[0];
        }

        std::unordered_set<int> in_mst;
        std::priority_queue<std::tuple<int, int, int>,
                          std::vector<std::tuple<int, int, int>>,
                          std::greater<std::tuple<int, int, int>>> pq;

        in_mst.insert(start);

        for (int neighbor : graph.get_neighbors(start)) {
            int weight = graph.get_edge_weight(start, neighbor);
            pq.push(std::make_tuple(weight, start, neighbor));
        }

        while (!pq.empty() && mst.size() < vertices.size() - 1) {
            auto [weight, from, to] = pq.top();
            pq.pop();

            if (in_mst.find(to) != in_mst.end()) {
                continue;
            }

            mst.emplace_back(from, to, weight);
            in_mst.insert(to);

            for (int neighbor : graph.get_neighbors(to)) {
                if (in_mst.find(neighbor) == in_mst.end()) {
                    int edge_weight = graph.get_edge_weight(to, neighbor);
                    pq.push(std::make_tuple(edge_weight, to, neighbor));
                }
            }
        }

        return mst;
    }

    std::vector<int> GraphAlgorithms::depth_first_search(const Graph& graph, int start) {
        return graph.depth_first_search(start);
    }

    std::vector<int> GraphAlgorithms::breadth_first_search(const Graph& graph, int start) {
        return graph.breadth_first_search(start);
    }

    std::vector<int> GraphAlgorithms::topological_sort(const Graph& graph) {
        return graph.topological_sort();
    }

    bool GraphAlgorithms::is_bipartite_util(const Graph& graph, int start, std::unordered_map<int, int>& color) {
        std::queue<int> queue;
        queue.push(start);
        color[start] = 0;

        while (!queue.empty()) {
            int current = queue.front();
            queue.pop();

            for (int neighbor : graph.get_neighbors(current)) {
                if (color.find(neighbor) == color.end()) {
                    color[neighbor] = 1 - color[current];
                    queue.push(neighbor);
                } else if (color[neighbor] == color[current]) {
                    return false;
                }
            }
        }

        return true;
    }

    bool GraphAlgorithms::is_bipartite(const Graph& graph) {
        auto vertices = graph.get_vertices();
        std::unordered_map<int, int> color;

        for (int vertex : vertices) {
            if (color.find(vertex) == color.end()) {
                if (!is_bipartite_util(graph, vertex, color)) {
                    return false;
                }
            }
        }

        return true;
    }

    bool GraphAlgorithms::has_cycle(const Graph& graph) {
        return graph.has_cycle();
    }

    bool GraphAlgorithms::is_connected(const Graph& graph) {
        return graph.is_connected();
    }

    std::vector<std::vector<int>> GraphAlgorithms::strongly_connected_components(const Graph& graph) {
        if (!graph.is_directed_graph()) {
            return graph.connected_components();
        }

        auto vertices = graph.get_vertices();
        std::unordered_set<int> visited;
        std::stack<int> stack;

        for (int vertex : vertices) {
            if (visited.find(vertex) == visited.end()) {
                dfs_scc(graph, vertex, visited, stack);
            }
        }

        Graph transpose = graph.get_transpose();
        visited.clear();
        std::vector<std::vector<int>> sccs;

        while (!stack.empty()) {
            int vertex = stack.top();
            stack.pop();

            if (visited.find(vertex) == visited.end()) {
                std::vector<int> component;
                dfs_scc_transpose(transpose, vertex, visited, component);
                sccs.push_back(component);
            }
        }

        return sccs;
    }

    void GraphAlgorithms::dfs_scc(const Graph& graph, int vertex, std::unordered_set<int>& visited, std::stack<int>& stack) {
        visited.insert(vertex);

        for (int neighbor : graph.get_neighbors(vertex)) {
            if (visited.find(neighbor) == visited.end()) {
                dfs_scc(graph, neighbor, visited, stack);
            }
        }

        stack.push(vertex);
    }

    void GraphAlgorithms::dfs_scc_transpose(const Graph& graph, int vertex, std::unordered_set<int>& visited, std::vector<int>& component) {
        visited.insert(vertex);
        component.push_back(vertex);

        for (int neighbor : graph.get_neighbors(vertex)) {
            if (visited.find(neighbor) == visited.end()) {
                dfs_scc_transpose(graph, neighbor, visited, component);
            }
        }
    }

    bool GraphAlgorithms::has_path(const Graph& graph, int start, int end) {
        auto reachable = graph.breadth_first_search(start);
        return std::find(reachable.begin(), reachable.end(), end) != reachable.end();
    }

    void GraphAlgorithms::all_paths_util(const Graph& graph, int current, int end, std::vector<int>& path, std::vector<std::vector<int>>& all_paths, std::unordered_set<int>& visited) {
        path.push_back(current);
        visited.insert(current);

        if (current == end) {
            all_paths.push_back(path);
        } else {
            for (int neighbor : graph.get_neighbors(current)) {
                if (visited.find(neighbor) == visited.end()) {
                    all_paths_util(graph, neighbor, end, path, all_paths, visited);
                }
            }
        }

        path.pop_back();
        visited.erase(current);
    }

    std::vector<std::vector<int>> GraphAlgorithms::all_paths(const Graph& graph, int start, int end) {
        std::vector<std::vector<int>> all_paths;
        std::vector<int> path;
        std::unordered_set<int> visited;

        all_paths_util(graph, start, end, path, all_paths, visited);
        return all_paths;
    }

    int GraphAlgorithms::shortest_distance(const Graph& graph, int start, int end) {
        auto distances = graph.shortest_distances_dijkstra(start);
        if (distances.find(end) != distances.end()) {
            return distances[end];
        }
        return -1;
    }

    std::string GraphAlgorithms::get_algorithm_info(const std::string& algorithm_name) {
        if (algorithm_name == "dijkstra") {
            return "Dijkstra's Algorithm - Time: O(V² + E), Space: O(V), Single-source shortest paths";
        } else if (algorithm_name == "floyd_warshall") {
            return "Floyd-Warshall Algorithm - Time: O(V³), Space: O(V²), All-pairs shortest paths";
        } else if (algorithm_name == "bellman_ford") {
            return "Bellman-Ford Algorithm - Time: O(VE), Space: O(V), Handles negative weights";
        } else if (algorithm_name == "kruskal") {
            return "Kruskal's Algorithm - Time: O(E log E), Space: O(V), Minimum spanning tree";
        } else if (algorithm_name == "prim") {
            return "Prim's Algorithm - Time: O(V²) or O(E log V), Space: O(V), Minimum spanning tree";
        } else if (algorithm_name == "dfs") {
            return "Depth-First Search - Time: O(V + E), Space: O(V), Graph traversal";
        } else if (algorithm_name == "bfs") {
            return "Breadth-First Search - Time: O(V + E), Space: O(V), Graph traversal";
        } else if (algorithm_name == "topological_sort") {
            return "Topological Sort - Time: O(V + E), Space: O(V), For DAGs only";
        } else {
            return "Unknown algorithm";
        }
    }
}