#include "sorting.h"
#include <algorithm>
#include <iostream>

namespace Algorithms {

    std::vector<int> Sorting::bubble_sort(std::vector<int> arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    std::swap(arr[j], arr[j + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        return arr;
    }

    std::vector<int> Sorting::selection_sort(std::vector<int> arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                }
            }
            if (min_idx != i) {
                std::swap(arr[i], arr[min_idx]);
            }
        }
        return arr;
    }

    std::vector<int> Sorting::insertion_sort(std::vector<int> arr) {
        int n = arr.size();
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    std::vector<int> Sorting::merge_sort(std::vector<int> arr) {
        if (arr.size() <= 1) return arr;
        merge_sort_recursive(arr, 0, arr.size() - 1);
        return arr;
    }

    void Sorting::merge_sort_recursive(std::vector<int>& arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            merge_sort_recursive(arr, left, mid);
            merge_sort_recursive(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    void Sorting::merge(std::vector<int>& arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        std::vector<int> left_arr(n1);
        std::vector<int> right_arr(n2);

        for (int i = 0; i < n1; i++) {
            left_arr[i] = arr[left + i];
        }
        for (int j = 0; j < n2; j++) {
            right_arr[j] = arr[mid + 1 + j];
        }

        int i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
            if (left_arr[i] <= right_arr[j]) {
                arr[k] = left_arr[i];
                i++;
            } else {
                arr[k] = right_arr[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = left_arr[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = right_arr[j];
            j++;
            k++;
        }
    }

    std::vector<int> Sorting::quick_sort(std::vector<int> arr) {
        if (arr.size() <= 1) return arr;
        quick_sort_recursive(arr, 0, arr.size() - 1);
        return arr;
    }

    void Sorting::quick_sort_recursive(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quick_sort_recursive(arr, low, pi - 1);
            quick_sort_recursive(arr, pi + 1, high);
        }
    }

    int Sorting::partition(std::vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j <= high - 1; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        return i + 1;
    }

    std::vector<int> Sorting::heap_sort(std::vector<int> arr) {
        if (arr.size() <= 1) return arr;

        build_heap(arr);

        for (int i = arr.size() - 1; i > 0; i--) {
            std::swap(arr[0], arr[i]);
            heapify(arr, i, 0);
        }

        return arr;
    }

    void Sorting::build_heap(std::vector<int>& arr) {
        int n = arr.size();
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
    }

    void Sorting::heapify(std::vector<int>& arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != i) {
            std::swap(arr[i], arr[largest]);
            heapify(arr, n, largest);
        }
    }

    std::vector<int> Sorting::counting_sort(std::vector<int> arr, int max_val) {
        if (arr.empty()) return arr;

        std::vector<int> count(max_val + 1, 0);
        std::vector<int> output(arr.size());

        for (int num : arr) {
            count[num]++;
        }

        for (int i = 1; i <= max_val; i++) {
            count[i] += count[i - 1];
        }

        for (int i = arr.size() - 1; i >= 0; i--) {
            output[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        return output;
    }

    std::vector<int> Sorting::radix_sort(std::vector<int> arr) {
        if (arr.empty()) return arr;

        int max_val = get_max(arr);

        for (int exp = 1; max_val / exp > 0; exp *= 10) {
            counting_sort_for_radix(arr, exp);
        }

        return arr;
    }

    void Sorting::counting_sort_for_radix(std::vector<int>& arr, int exp) {
        std::vector<int> output(arr.size());
        std::vector<int> count(10, 0);

        for (int i = 0; i < arr.size(); i++) {
            count[(arr[i] / exp) % 10]++;
        }

        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (int i = arr.size() - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }

        for (int i = 0; i < arr.size(); i++) {
            arr[i] = output[i];
        }
    }

    int Sorting::get_max(const std::vector<int>& arr) {
        int max_val = arr[0];
        for (int num : arr) {
            if (num > max_val) {
                max_val = num;
            }
        }
        return max_val;
    }

    bool Sorting::is_sorted(const std::vector<int>& arr) {
        for (int i = 1; i < arr.size(); i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }

    std::string Sorting::get_algorithm_info(const std::string& algorithm_name) {
        if (algorithm_name == "bubble_sort") {
            return "Bubble Sort - Time: O(n²), Space: O(1), Stable: Yes";
        } else if (algorithm_name == "selection_sort") {
            return "Selection Sort - Time: O(n²), Space: O(1), Stable: No";
        } else if (algorithm_name == "insertion_sort") {
            return "Insertion Sort - Time: O(n²), Space: O(1), Stable: Yes";
        } else if (algorithm_name == "merge_sort") {
            return "Merge Sort - Time: O(n log n), Space: O(n), Stable: Yes";
        } else if (algorithm_name == "quick_sort") {
            return "Quick Sort - Time: O(n log n) avg, O(n²) worst, Space: O(log n), Stable: No";
        } else if (algorithm_name == "heap_sort") {
            return "Heap Sort - Time: O(n log n), Space: O(1), Stable: No";
        } else if (algorithm_name == "counting_sort") {
            return "Counting Sort - Time: O(n + k), Space: O(k), Stable: Yes";
        } else if (algorithm_name == "radix_sort") {
            return "Radix Sort - Time: O(d × (n + k)), Space: O(n + k), Stable: Yes";
        } else {
            return "Unknown algorithm";
        }
    }
}