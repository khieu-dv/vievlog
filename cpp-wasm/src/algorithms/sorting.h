#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <string>

namespace Algorithms {
    class Sorting {
    public:
        // Basic sorting algorithms
        static std::vector<int> bubble_sort(std::vector<int> arr);
        static std::vector<int> selection_sort(std::vector<int> arr);
        static std::vector<int> insertion_sort(std::vector<int> arr);

        // Advanced sorting algorithms
        static std::vector<int> merge_sort(std::vector<int> arr);
        static std::vector<int> quick_sort(std::vector<int> arr);
        static std::vector<int> heap_sort(std::vector<int> arr);
        static std::vector<int> counting_sort(std::vector<int> arr, int max_val);
        static std::vector<int> radix_sort(std::vector<int> arr);

        // Utility functions
        static bool is_sorted(const std::vector<int>& arr);
        static std::string get_algorithm_info(const std::string& algorithm_name);

    private:
        // Helper functions for merge sort
        static void merge_sort_recursive(std::vector<int>& arr, int left, int right);
        static void merge(std::vector<int>& arr, int left, int mid, int right);

        // Helper functions for quick sort
        static void quick_sort_recursive(std::vector<int>& arr, int low, int high);
        static int partition(std::vector<int>& arr, int low, int high);

        // Helper functions for heap sort
        static void heapify(std::vector<int>& arr, int n, int i);
        static void build_heap(std::vector<int>& arr);

        // Helper functions for radix sort
        static void counting_sort_for_radix(std::vector<int>& arr, int exp);
        static int get_max(const std::vector<int>& arr);
    };
}