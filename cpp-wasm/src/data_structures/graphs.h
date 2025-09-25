#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <queue>
#include <stack>
#include <limits>

namespace DataStructures {
    struct Edge {
        int from;
        int to;
        int weight;

        Edge(int f, int t, int w = 1) : from(f), to(t), weight(w) {}
    };

    class Graph {
    private:
        bool is_directed;
        std::unordered_map<int, std::unordered_map<int, int>> adjacency_list;
        std::unordered_set<int> vertices;

        void dfs_recursive(int vertex, std::unordered_set<int>& visited, std::vector<int>& result) const;

    public:
        // Constructors
        Graph();
        Graph(bool directed);

        // Core operations
        void add_vertex(int vertex);
        void remove_vertex(int vertex);
        void add_edge(int from, int to, int weight = 1);
        void remove_edge(int from, int to);

        // Properties
        size_t vertex_count() const;
        size_t edge_count() const;
        bool has_vertex(int vertex) const;
        bool has_edge(int from, int to) const;
        int get_edge_weight(int from, int to) const;
        bool empty() const;
        void clear();

        // Traversals
        std::vector<int> depth_first_search(int start) const;
        std::vector<int> breadth_first_search(int start) const;
        std::vector<int> topological_sort() const;

        // Graph algorithms
        std::vector<int> shortest_path_dijkstra(int start, int end) const;
        std::unordered_map<int, int> shortest_distances_dijkstra(int start) const;
        bool has_cycle() const;
        bool is_connected() const;
        std::vector<std::vector<int>> connected_components() const;

        // Utility
        std::vector<int> get_vertices() const;
        std::vector<Edge> get_edges() const;
        std::vector<int> get_neighbors(int vertex) const;
        int get_degree(int vertex) const;
        std::string to_string() const;

        // Advanced operations
        Graph copy() const;
        Graph get_transpose() const;
        bool is_directed_graph() const;
    };
}