#include "graphs.h"
#include <stdexcept>
#include <sstream>
#include <algorithm>

namespace DataStructures {

    Graph::Graph() : is_directed(false) {}

    Graph::Graph(bool directed) : is_directed(directed) {}

    void Graph::dfs_recursive(int vertex, std::unordered_set<int>& visited, std::vector<int>& result) const {
        visited.insert(vertex);
        result.push_back(vertex);

        if (adjacency_list.find(vertex) != adjacency_list.end()) {
            for (const auto& neighbor : adjacency_list.at(vertex)) {
                if (visited.find(neighbor.first) == visited.end()) {
                    dfs_recursive(neighbor.first, visited, result);
                }
            }
        }
    }

    void Graph::add_vertex(int vertex) {
        vertices.insert(vertex);
        if (adjacency_list.find(vertex) == adjacency_list.end()) {
            adjacency_list[vertex] = std::unordered_map<int, int>();
        }
    }

    void Graph::remove_vertex(int vertex) {
        if (vertices.find(vertex) == vertices.end()) {
            return;
        }

        vertices.erase(vertex);

        for (auto& adj : adjacency_list) {
            adj.second.erase(vertex);
        }

        adjacency_list.erase(vertex);
    }

    void Graph::add_edge(int from, int to, int weight) {
        add_vertex(from);
        add_vertex(to);

        adjacency_list[from][to] = weight;

        if (!is_directed) {
            adjacency_list[to][from] = weight;
        }
    }

    void Graph::remove_edge(int from, int to) {
        if (adjacency_list.find(from) != adjacency_list.end()) {
            adjacency_list[from].erase(to);
        }

        if (!is_directed && adjacency_list.find(to) != adjacency_list.end()) {
            adjacency_list[to].erase(from);
        }
    }

    size_t Graph::vertex_count() const {
        return vertices.size();
    }

    size_t Graph::edge_count() const {
        size_t count = 0;
        for (const auto& vertex : adjacency_list) {
            count += vertex.second.size();
        }
        return is_directed ? count : count / 2;
    }

    bool Graph::has_vertex(int vertex) const {
        return vertices.find(vertex) != vertices.end();
    }

    bool Graph::has_edge(int from, int to) const {
        auto it = adjacency_list.find(from);
        if (it != adjacency_list.end()) {
            return it->second.find(to) != it->second.end();
        }
        return false;
    }

    int Graph::get_edge_weight(int from, int to) const {
        if (!has_edge(from, to)) {
            throw std::runtime_error("Edge does not exist");
        }
        return adjacency_list.at(from).at(to);
    }

    bool Graph::empty() const {
        return vertices.empty();
    }

    void Graph::clear() {
        vertices.clear();
        adjacency_list.clear();
    }

    std::vector<int> Graph::depth_first_search(int start) const {
        if (!has_vertex(start)) {
            throw std::runtime_error("Start vertex does not exist");
        }

        std::unordered_set<int> visited;
        std::vector<int> result;
        dfs_recursive(start, visited, result);
        return result;
    }

    std::vector<int> Graph::breadth_first_search(int start) const {
        if (!has_vertex(start)) {
            throw std::runtime_error("Start vertex does not exist");
        }

        std::vector<int> result;
        std::unordered_set<int> visited;
        std::queue<int> queue;

        queue.push(start);
        visited.insert(start);

        while (!queue.empty()) {
            int current = queue.front();
            queue.pop();
            result.push_back(current);

            if (adjacency_list.find(current) != adjacency_list.end()) {
                for (const auto& neighbor : adjacency_list.at(current)) {
                    if (visited.find(neighbor.first) == visited.end()) {
                        visited.insert(neighbor.first);
                        queue.push(neighbor.first);
                    }
                }
            }
        }

        return result;
    }

    std::vector<int> Graph::topological_sort() const {
        if (!is_directed) {
            throw std::runtime_error("Topological sort is only valid for directed graphs");
        }

        std::unordered_map<int, int> in_degree;
        for (int vertex : vertices) {
            in_degree[vertex] = 0;
        }

        for (const auto& vertex : adjacency_list) {
            for (const auto& neighbor : vertex.second) {
                in_degree[neighbor.first]++;
            }
        }

        std::queue<int> queue;
        for (const auto& vertex : in_degree) {
            if (vertex.second == 0) {
                queue.push(vertex.first);
            }
        }

        std::vector<int> result;
        while (!queue.empty()) {
            int current = queue.front();
            queue.pop();
            result.push_back(current);

            if (adjacency_list.find(current) != adjacency_list.end()) {
                for (const auto& neighbor : adjacency_list.at(current)) {
                    in_degree[neighbor.first]--;
                    if (in_degree[neighbor.first] == 0) {
                        queue.push(neighbor.first);
                    }
                }
            }
        }

        if (result.size() != vertices.size()) {
            throw std::runtime_error("Graph has a cycle, topological sort not possible");
        }

        return result;
    }

    std::vector<int> Graph::shortest_path_dijkstra(int start, int end) const {
        auto distances = shortest_distances_dijkstra(start);

        if (distances.find(end) == distances.end() ||
            distances[end] == std::numeric_limits<int>::max()) {
            return {};
        }

        std::vector<int> path;
        std::unordered_map<int, int> previous;

        std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>,
                          std::greater<std::pair<int, int>>> pq;

        std::unordered_map<int, int> dist;
        for (int vertex : vertices) {
            dist[vertex] = std::numeric_limits<int>::max();
        }
        dist[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            int current_dist = pq.top().first;
            int current = pq.top().second;
            pq.pop();

            if (current_dist > dist[current]) continue;

            if (adjacency_list.find(current) != adjacency_list.end()) {
                for (const auto& neighbor : adjacency_list.at(current)) {
                    int new_dist = dist[current] + neighbor.second;
                    if (new_dist < dist[neighbor.first]) {
                        dist[neighbor.first] = new_dist;
                        previous[neighbor.first] = current;
                        pq.push({new_dist, neighbor.first});
                    }
                }
            }
        }

        int current = end;
        while (current != start) {
            path.push_back(current);
            current = previous[current];
        }
        path.push_back(start);

        std::reverse(path.begin(), path.end());
        return path;
    }

    std::unordered_map<int, int> Graph::shortest_distances_dijkstra(int start) const {
        if (!has_vertex(start)) {
            throw std::runtime_error("Start vertex does not exist");
        }

        std::unordered_map<int, int> distances;
        std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>,
                          std::greater<std::pair<int, int>>> pq;

        for (int vertex : vertices) {
            distances[vertex] = std::numeric_limits<int>::max();
        }
        distances[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            int current_dist = pq.top().first;
            int current = pq.top().second;
            pq.pop();

            if (current_dist > distances[current]) continue;

            if (adjacency_list.find(current) != adjacency_list.end()) {
                for (const auto& neighbor : adjacency_list.at(current)) {
                    int new_dist = distances[current] + neighbor.second;
                    if (new_dist < distances[neighbor.first]) {
                        distances[neighbor.first] = new_dist;
                        pq.push({new_dist, neighbor.first});
                    }
                }
            }
        }

        return distances;
    }

    bool Graph::has_cycle() const {
        if (is_directed) {
            std::unordered_set<int> visited;
            std::unordered_set<int> rec_stack;

            for (int vertex : vertices) {
                if (visited.find(vertex) == visited.end()) {
                    std::function<bool(int)> dfs = [&](int v) -> bool {
                        visited.insert(v);
                        rec_stack.insert(v);

                        if (adjacency_list.find(v) != adjacency_list.end()) {
                            for (const auto& neighbor : adjacency_list.at(v)) {
                                if (rec_stack.find(neighbor.first) != rec_stack.end()) {
                                    return true;
                                }
                                if (visited.find(neighbor.first) == visited.end() && dfs(neighbor.first)) {
                                    return true;
                                }
                            }
                        }

                        rec_stack.erase(v);
                        return false;
                    };

                    if (dfs(vertex)) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            std::unordered_set<int> visited;

            for (int vertex : vertices) {
                if (visited.find(vertex) == visited.end()) {
                    std::function<bool(int, int)> dfs = [&](int v, int parent) -> bool {
                        visited.insert(v);

                        if (adjacency_list.find(v) != adjacency_list.end()) {
                            for (const auto& neighbor : adjacency_list.at(v)) {
                                if (neighbor.first == parent) continue;
                                if (visited.find(neighbor.first) != visited.end()) {
                                    return true;
                                }
                                if (dfs(neighbor.first, v)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    if (dfs(vertex, -1)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    bool Graph::is_connected() const {
        if (vertices.empty()) return true;

        int start = *vertices.begin();
        auto visited = breadth_first_search(start);
        return visited.size() == vertices.size();
    }

    std::vector<std::vector<int>> Graph::connected_components() const {
        std::vector<std::vector<int>> components;
        std::unordered_set<int> visited;

        for (int vertex : vertices) {
            if (visited.find(vertex) == visited.end()) {
                auto component = breadth_first_search(vertex);
                for (int v : component) {
                    visited.insert(v);
                }
                components.push_back(component);
            }
        }

        return components;
    }

    std::vector<int> Graph::get_vertices() const {
        return std::vector<int>(vertices.begin(), vertices.end());
    }

    std::vector<Edge> Graph::get_edges() const {
        std::vector<Edge> edges;
        std::unordered_set<std::string> seen;

        for (const auto& vertex : adjacency_list) {
            for (const auto& neighbor : vertex.second) {
                std::string edge_key = std::to_string(std::min(vertex.first, neighbor.first)) +
                                     "-" + std::to_string(std::max(vertex.first, neighbor.first));

                if (is_directed || seen.find(edge_key) == seen.end()) {
                    edges.emplace_back(vertex.first, neighbor.first, neighbor.second);
                    if (!is_directed) {
                        seen.insert(edge_key);
                    }
                }
            }
        }

        return edges;
    }

    std::vector<int> Graph::get_neighbors(int vertex) const {
        if (!has_vertex(vertex)) {
            throw std::runtime_error("Vertex does not exist");
        }

        std::vector<int> neighbors;
        if (adjacency_list.find(vertex) != adjacency_list.end()) {
            for (const auto& neighbor : adjacency_list.at(vertex)) {
                neighbors.push_back(neighbor.first);
            }
        }
        return neighbors;
    }

    int Graph::get_degree(int vertex) const {
        if (!has_vertex(vertex)) {
            throw std::runtime_error("Vertex does not exist");
        }

        int degree = 0;
        if (adjacency_list.find(vertex) != adjacency_list.end()) {
            degree = adjacency_list.at(vertex).size();
        }

        if (!is_directed) {
            for (const auto& v : adjacency_list) {
                if (v.second.find(vertex) != v.second.end()) {
                    degree++;
                }
            }
        }

        return degree;
    }

    std::string Graph::to_string() const {
        std::ostringstream oss;
        oss << (is_directed ? "Directed" : "Undirected") << " Graph:\n";
        oss << "Vertices: " << vertex_count() << ", Edges: " << edge_count() << "\n";

        if (vertices.empty()) {
            oss << "Empty graph";
            return oss.str();
        }

        for (int vertex : vertices) {
            oss << vertex << " -> [";
            if (adjacency_list.find(vertex) != adjacency_list.end()) {
                bool first = true;
                for (const auto& neighbor : adjacency_list.at(vertex)) {
                    if (!first) oss << ", ";
                    oss << neighbor.first << "(" << neighbor.second << ")";
                    first = false;
                }
            }
            oss << "]\n";
        }

        return oss.str();
    }

    Graph Graph::copy() const {
        Graph new_graph(is_directed);
        new_graph.vertices = this->vertices;
        new_graph.adjacency_list = this->adjacency_list;
        return new_graph;
    }

    Graph Graph::get_transpose() const {
        if (!is_directed) {
            throw std::runtime_error("Transpose is only valid for directed graphs");
        }

        Graph transpose(true);

        for (int vertex : vertices) {
            transpose.add_vertex(vertex);
        }

        for (const auto& vertex : adjacency_list) {
            for (const auto& neighbor : vertex.second) {
                transpose.add_edge(neighbor.first, vertex.first, neighbor.second);
            }
        }

        return transpose;
    }

    bool Graph::is_directed_graph() const {
        return is_directed;
    }
}