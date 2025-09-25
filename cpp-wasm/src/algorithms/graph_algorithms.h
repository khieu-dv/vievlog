#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <unordered_map>
#include <string>
#include "../data_structures/graphs.h"

namespace Algorithms {
    using Graph = DataStructures::Graph;

    struct PathResult {
        std::vector<int> path;
        int distance;
        bool found;

        PathResult(const std::vector<int>& p = {}, int d = -1, bool f = false)
            : path(p), distance(d), found(f) {}
    };

    struct MST_Edge {
        int from;
        int to;
        int weight;

        MST_Edge(int f, int t, int w) : from(f), to(t), weight(w) {}
    };

    class GraphAlgorithms {
    public:
        // Shortest path algorithms
        static PathResult dijkstra_shortest_path(const Graph& graph, int start, int end);
        static std::unordered_map<int, int> dijkstra_all_distances(const Graph& graph, int start);
        static std::unordered_map<int, PathResult> floyd_warshall(const Graph& graph);
        static PathResult bellman_ford(const Graph& graph, int start, int end);

        // Minimum spanning tree
        static std::vector<MST_Edge> kruskal_mst(const Graph& graph);
        static std::vector<MST_Edge> prim_mst(const Graph& graph, int start = -1);

        // Graph traversal
        static std::vector<int> depth_first_search(const Graph& graph, int start);
        static std::vector<int> breadth_first_search(const Graph& graph, int start);
        static std::vector<int> topological_sort(const Graph& graph);

        // Graph properties
        static bool is_bipartite(const Graph& graph);
        static bool has_cycle(const Graph& graph);
        static bool is_connected(const Graph& graph);
        static std::vector<std::vector<int>> strongly_connected_components(const Graph& graph);

        // Path finding
        static bool has_path(const Graph& graph, int start, int end);
        static std::vector<std::vector<int>> all_paths(const Graph& graph, int start, int end);
        static int shortest_distance(const Graph& graph, int start, int end);

        // Utility functions
        static std::string get_algorithm_info(const std::string& algorithm_name);

    private:
        // Helper functions for Union-Find (for Kruskal's algorithm)
        class UnionFind {
        private:
            std::unordered_map<int, int> parent;
            std::unordered_map<int, int> rank;

        public:
            void make_set(int x);
            int find(int x);
            bool union_sets(int x, int y);
        };

        // Helper functions for various algorithms
        static void dfs_recursive(const Graph& graph, int vertex, std::unordered_set<int>& visited, std::vector<int>& result);
        static void dfs_scc(const Graph& graph, int vertex, std::unordered_set<int>& visited, std::stack<int>& stack);
        static void dfs_scc_transpose(const Graph& graph, int vertex, std::unordered_set<int>& visited, std::vector<int>& component);
        static bool is_bipartite_util(const Graph& graph, int start, std::unordered_map<int, int>& color);
        static void all_paths_util(const Graph& graph, int current, int end, std::vector<int>& path, std::vector<std::vector<int>>& all_paths, std::unordered_set<int>& visited);
    };
}