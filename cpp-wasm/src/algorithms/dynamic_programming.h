#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <string>
#include <unordered_map>

namespace Algorithms {
    class DynamicProgramming {
    public:
        // Classic DP problems
        static int fibonacci(int n);
        static int fibonacci_memoized(int n);
        static std::vector<int> fibonacci_sequence(int n);

        static int factorial(int n);
        static std::vector<std::vector<int>> pascal_triangle(int rows);

        // String problems
        static int longest_common_subsequence(const std::string& str1, const std::string& str2);
        static int edit_distance(const std::string& str1, const std::string& str2);
        static int longest_increasing_subsequence(const std::vector<int>& arr);
        static bool is_subsequence(const std::string& s, const std::string& t);

        // Array problems
        static int maximum_subarray_sum(const std::vector<int>& arr);
        static int maximum_product_subarray(const std::vector<int>& arr);
        static int coin_change(const std::vector<int>& coins, int amount);
        static int coin_change_ways(const std::vector<int>& coins, int amount);

        // Knapsack problems
        static int knapsack_01(const std::vector<int>& weights, const std::vector<int>& values, int capacity);
        static int knapsack_unbounded(const std::vector<int>& weights, const std::vector<int>& values, int capacity);

        // Path problems
        static int unique_paths(int m, int n);
        static int unique_paths_with_obstacles(const std::vector<std::vector<int>>& grid);
        static int minimum_path_sum(const std::vector<std::vector<int>>& grid);

        // Utility functions
        static std::string get_algorithm_info(const std::string& algorithm_name);

    private:
        // Helper functions with memoization
        static int fibonacci_memo_helper(int n, std::unordered_map<int, int>& memo);
        static int lcs_helper(const std::string& str1, const std::string& str2, int i, int j, std::vector<std::vector<int>>& memo);
        static int edit_distance_helper(const std::string& str1, const std::string& str2, int i, int j, std::vector<std::vector<int>>& memo);
    };
}