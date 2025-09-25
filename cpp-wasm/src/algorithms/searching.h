#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <string>

namespace Algorithms {
    struct SearchResult {
        int index;
        bool found;
        int comparisons;

        SearchResult(int idx = -1, bool f = false, int comp = 0)
            : index(idx), found(f), comparisons(comp) {}
    };

    class Searching {
    public:
        // Basic search algorithms
        static SearchResult linear_search(const std::vector<int>& arr, int target);
        static SearchResult binary_search(const std::vector<int>& sorted_arr, int target);
        static SearchResult jump_search(const std::vector<int>& sorted_arr, int target);
        static SearchResult interpolation_search(const std::vector<int>& sorted_arr, int target);
        static SearchResult exponential_search(const std::vector<int>& sorted_arr, int target);
        static SearchResult ternary_search(const std::vector<int>& sorted_arr, int target);

        // Multiple occurrences
        static std::vector<int> find_all_occurrences(const std::vector<int>& arr, int target);
        static int count_occurrences(const std::vector<int>& arr, int target);

        // Range searches
        static std::pair<int, int> find_first_last_occurrence(const std::vector<int>& sorted_arr, int target);
        static std::vector<int> range_search(const std::vector<int>& sorted_arr, int min_val, int max_val);

        // Utility functions
        static bool is_sorted(const std::vector<int>& arr);
        static std::string get_algorithm_info(const std::string& algorithm_name);

    private:
        // Helper functions for binary search variants
        static int binary_search_recursive(const std::vector<int>& arr, int target, int left, int right, int& comparisons);
        static int find_first_occurrence(const std::vector<int>& arr, int target);
        static int find_last_occurrence(const std::vector<int>& arr, int target);
    };
}