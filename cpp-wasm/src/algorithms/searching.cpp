#include "searching.h"
#include <algorithm>
#include <cmath>

namespace Algorithms {

    SearchResult Searching::linear_search(const std::vector<int>& arr, int target) {
        int comparisons = 0;
        for (int i = 0; i < arr.size(); i++) {
            comparisons++;
            if (arr[i] == target) {
                return SearchResult(i, true, comparisons);
            }
        }
        return SearchResult(-1, false, comparisons);
    }

    SearchResult Searching::binary_search(const std::vector<int>& sorted_arr, int target) {
        int left = 0, right = sorted_arr.size() - 1;
        int comparisons = 0;

        while (left <= right) {
            comparisons++;
            int mid = left + (right - left) / 2;

            if (sorted_arr[mid] == target) {
                return SearchResult(mid, true, comparisons);
            } else if (sorted_arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return SearchResult(-1, false, comparisons);
    }

    int Searching::binary_search_recursive(const std::vector<int>& arr, int target, int left, int right, int& comparisons) {
        if (left > right) {
            return -1;
        }

        comparisons++;
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            return binary_search_recursive(arr, target, mid + 1, right, comparisons);
        } else {
            return binary_search_recursive(arr, target, left, mid - 1, comparisons);
        }
    }

    SearchResult Searching::jump_search(const std::vector<int>& sorted_arr, int target) {
        int n = sorted_arr.size();
        int step = std::sqrt(n);
        int prev = 0;
        int comparisons = 0;

        while (sorted_arr[std::min(step, n) - 1] < target) {
            comparisons++;
            prev = step;
            step += std::sqrt(n);
            if (prev >= n) {
                return SearchResult(-1, false, comparisons);
            }
        }

        while (sorted_arr[prev] < target) {
            comparisons++;
            prev++;
            if (prev == std::min(step, n)) {
                return SearchResult(-1, false, comparisons);
            }
        }

        comparisons++;
        if (sorted_arr[prev] == target) {
            return SearchResult(prev, true, comparisons);
        }

        return SearchResult(-1, false, comparisons);
    }

    SearchResult Searching::interpolation_search(const std::vector<int>& sorted_arr, int target) {
        int low = 0, high = sorted_arr.size() - 1;
        int comparisons = 0;

        while (low <= high && target >= sorted_arr[low] && target <= sorted_arr[high]) {
            comparisons++;
            if (low == high) {
                if (sorted_arr[low] == target) {
                    return SearchResult(low, true, comparisons);
                }
                return SearchResult(-1, false, comparisons);
            }

            int pos = low + (static_cast<double>(target - sorted_arr[low]) /
                           (sorted_arr[high] - sorted_arr[low])) * (high - low);

            if (sorted_arr[pos] == target) {
                return SearchResult(pos, true, comparisons);
            }

            if (sorted_arr[pos] < target) {
                low = pos + 1;
            } else {
                high = pos - 1;
            }
        }

        return SearchResult(-1, false, comparisons);
    }

    SearchResult Searching::exponential_search(const std::vector<int>& sorted_arr, int target) {
        if (sorted_arr.empty()) {
            return SearchResult(-1, false, 0);
        }

        int comparisons = 1;
        if (sorted_arr[0] == target) {
            return SearchResult(0, true, comparisons);
        }

        int bound = 1;
        while (bound < sorted_arr.size() && sorted_arr[bound] < target) {
            comparisons++;
            bound *= 2;
        }

        int left = bound / 2;
        int right = std::min(bound, static_cast<int>(sorted_arr.size()) - 1);

        int binary_comparisons = 0;
        int result = binary_search_recursive(sorted_arr, target, left, right, binary_comparisons);

        return SearchResult(result, result != -1, comparisons + binary_comparisons);
    }

    SearchResult Searching::ternary_search(const std::vector<int>& sorted_arr, int target) {
        int left = 0, right = sorted_arr.size() - 1;
        int comparisons = 0;

        while (left <= right) {
            int mid1 = left + (right - left) / 3;
            int mid2 = right - (right - left) / 3;

            comparisons += 2;
            if (sorted_arr[mid1] == target) {
                return SearchResult(mid1, true, comparisons);
            }
            if (sorted_arr[mid2] == target) {
                return SearchResult(mid2, true, comparisons);
            }

            if (target < sorted_arr[mid1]) {
                right = mid1 - 1;
            } else if (target > sorted_arr[mid2]) {
                left = mid2 + 1;
            } else {
                left = mid1 + 1;
                right = mid2 - 1;
            }
        }

        return SearchResult(-1, false, comparisons);
    }

    std::vector<int> Searching::find_all_occurrences(const std::vector<int>& arr, int target) {
        std::vector<int> indices;
        for (int i = 0; i < arr.size(); i++) {
            if (arr[i] == target) {
                indices.push_back(i);
            }
        }
        return indices;
    }

    int Searching::count_occurrences(const std::vector<int>& arr, int target) {
        int count = 0;
        for (int num : arr) {
            if (num == target) {
                count++;
            }
        }
        return count;
    }

    int Searching::find_first_occurrence(const std::vector<int>& arr, int target) {
        int left = 0, right = arr.size() - 1;
        int result = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                result = mid;
                right = mid - 1;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    int Searching::find_last_occurrence(const std::vector<int>& arr, int target) {
        int left = 0, right = arr.size() - 1;
        int result = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                result = mid;
                left = mid + 1;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    std::pair<int, int> Searching::find_first_last_occurrence(const std::vector<int>& sorted_arr, int target) {
        int first = find_first_occurrence(sorted_arr, target);
        int last = find_last_occurrence(sorted_arr, target);
        return std::make_pair(first, last);
    }

    std::vector<int> Searching::range_search(const std::vector<int>& sorted_arr, int min_val, int max_val) {
        std::vector<int> result;

        int left_bound = std::lower_bound(sorted_arr.begin(), sorted_arr.end(), min_val) - sorted_arr.begin();
        int right_bound = std::upper_bound(sorted_arr.begin(), sorted_arr.end(), max_val) - sorted_arr.begin();

        for (int i = left_bound; i < right_bound; i++) {
            result.push_back(sorted_arr[i]);
        }

        return result;
    }

    bool Searching::is_sorted(const std::vector<int>& arr) {
        for (int i = 1; i < arr.size(); i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }

    std::string Searching::get_algorithm_info(const std::string& algorithm_name) {
        if (algorithm_name == "linear_search") {
            return "Linear Search - Time: O(n), Space: O(1), Works on unsorted arrays";
        } else if (algorithm_name == "binary_search") {
            return "Binary Search - Time: O(log n), Space: O(1), Requires sorted array";
        } else if (algorithm_name == "jump_search") {
            return "Jump Search - Time: O(√n), Space: O(1), Requires sorted array";
        } else if (algorithm_name == "interpolation_search") {
            return "Interpolation Search - Time: O(log log n) avg, O(n) worst, Space: O(1), Requires sorted array";
        } else if (algorithm_name == "exponential_search") {
            return "Exponential Search - Time: O(log n), Space: O(1), Good for unbounded arrays";
        } else if (algorithm_name == "ternary_search") {
            return "Ternary Search - Time: O(log₃ n), Space: O(1), Requires sorted array";
        } else {
            return "Unknown algorithm";
        }
    }
}