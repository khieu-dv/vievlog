#include "dynamic_programming.h"
#include <algorithm>
#include <climits>

namespace Algorithms {

    int DynamicProgramming::fibonacci(int n) {
        if (n <= 1) return n;

        std::vector<int> dp(n + 1);
        dp[0] = 0;
        dp[1] = 1;

        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        return dp[n];
    }

    int DynamicProgramming::fibonacci_memo_helper(int n, std::unordered_map<int, int>& memo) {
        if (n <= 1) return n;

        if (memo.find(n) != memo.end()) {
            return memo[n];
        }

        memo[n] = fibonacci_memo_helper(n - 1, memo) + fibonacci_memo_helper(n - 2, memo);
        return memo[n];
    }

    int DynamicProgramming::fibonacci_memoized(int n) {
        std::unordered_map<int, int> memo;
        return fibonacci_memo_helper(n, memo);
    }

    std::vector<int> DynamicProgramming::fibonacci_sequence(int n) {
        std::vector<int> sequence;
        if (n <= 0) return sequence;

        sequence.push_back(0);
        if (n == 1) return sequence;

        sequence.push_back(1);
        for (int i = 2; i < n; i++) {
            sequence.push_back(sequence[i - 1] + sequence[i - 2]);
        }

        return sequence;
    }

    int DynamicProgramming::factorial(int n) {
        if (n <= 1) return 1;

        std::vector<int> dp(n + 1);
        dp[0] = 1;
        dp[1] = 1;

        for (int i = 2; i <= n; i++) {
            dp[i] = i * dp[i - 1];
        }

        return dp[n];
    }

    std::vector<std::vector<int>> DynamicProgramming::pascal_triangle(int rows) {
        std::vector<std::vector<int>> triangle;
        if (rows <= 0) return triangle;

        for (int i = 0; i < rows; i++) {
            std::vector<int> row(i + 1, 1);
            for (int j = 1; j < i; j++) {
                row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
            }
            triangle.push_back(row);
        }

        return triangle;
    }

    int DynamicProgramming::lcs_helper(const std::string& str1, const std::string& str2, int i, int j, std::vector<std::vector<int>>& memo) {
        if (i == 0 || j == 0) return 0;

        if (memo[i][j] != -1) return memo[i][j];

        if (str1[i - 1] == str2[j - 1]) {
            memo[i][j] = 1 + lcs_helper(str1, str2, i - 1, j - 1, memo);
        } else {
            memo[i][j] = std::max(lcs_helper(str1, str2, i - 1, j, memo),
                                lcs_helper(str1, str2, i, j - 1, memo));
        }

        return memo[i][j];
    }

    int DynamicProgramming::longest_common_subsequence(const std::string& str1, const std::string& str2) {
        int m = str1.length();
        int n = str2.length();

        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1[i - 1] == str2[j - 1]) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    int DynamicProgramming::edit_distance(const std::string& str1, const std::string& str2) {
        int m = str1.length();
        int n = str2.length();

        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1));

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1[i - 1] == str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + std::min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
                }
            }
        }

        return dp[m][n];
    }

    int DynamicProgramming::longest_increasing_subsequence(const std::vector<int>& arr) {
        if (arr.empty()) return 0;

        std::vector<int> dp(arr.size(), 1);

        for (int i = 1; i < arr.size(); i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) {
                    dp[i] = std::max(dp[i], dp[j] + 1);
                }
            }
        }

        return *std::max_element(dp.begin(), dp.end());
    }

    bool DynamicProgramming::is_subsequence(const std::string& s, const std::string& t) {
        int i = 0, j = 0;

        while (i < s.length() && j < t.length()) {
            if (s[i] == t[j]) {
                i++;
            }
            j++;
        }

        return i == s.length();
    }

    int DynamicProgramming::maximum_subarray_sum(const std::vector<int>& arr) {
        if (arr.empty()) return 0;

        int max_sum = arr[0];
        int current_sum = arr[0];

        for (int i = 1; i < arr.size(); i++) {
            current_sum = std::max(arr[i], current_sum + arr[i]);
            max_sum = std::max(max_sum, current_sum);
        }

        return max_sum;
    }

    int DynamicProgramming::maximum_product_subarray(const std::vector<int>& arr) {
        if (arr.empty()) return 0;

        int max_product = arr[0];
        int max_ending_here = arr[0];
        int min_ending_here = arr[0];

        for (int i = 1; i < arr.size(); i++) {
            int temp = max_ending_here;
            max_ending_here = std::max({arr[i], max_ending_here * arr[i], min_ending_here * arr[i]});
            min_ending_here = std::min({arr[i], temp * arr[i], min_ending_here * arr[i]});
            max_product = std::max(max_product, max_ending_here);
        }

        return max_product;
    }

    int DynamicProgramming::coin_change(const std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin) {
                    dp[i] = std::min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }

    int DynamicProgramming::coin_change_ways(const std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, 0);
        dp[0] = 1;

        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }

        return dp[amount];
    }

    int DynamicProgramming::knapsack_01(const std::vector<int>& weights, const std::vector<int>& values, int capacity) {
        int n = weights.size();
        std::vector<std::vector<int>> dp(n + 1, std::vector<int>(capacity + 1, 0));

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = std::max(values[i - 1] + dp[i - 1][w - weights[i - 1]],
                                      dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        return dp[n][capacity];
    }

    int DynamicProgramming::knapsack_unbounded(const std::vector<int>& weights, const std::vector<int>& values, int capacity) {
        std::vector<int> dp(capacity + 1, 0);

        for (int i = 1; i <= capacity; i++) {
            for (int j = 0; j < weights.size(); j++) {
                if (weights[j] <= i) {
                    dp[i] = std::max(dp[i], dp[i - weights[j]] + values[j]);
                }
            }
        }

        return dp[capacity];
    }

    int DynamicProgramming::unique_paths(int m, int n) {
        std::vector<std::vector<int>> dp(m, std::vector<int>(n, 1));

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }

        return dp[m - 1][n - 1];
    }

    int DynamicProgramming::unique_paths_with_obstacles(const std::vector<std::vector<int>>& grid) {
        if (grid.empty() || grid[0].empty() || grid[0][0] == 1) return 0;

        int m = grid.size();
        int n = grid[0].size();
        std::vector<std::vector<int>> dp(m, std::vector<int>(n, 0));

        dp[0][0] = 1;

        for (int i = 1; i < m; i++) {
            dp[i][0] = (grid[i][0] == 0 && dp[i - 1][0] == 1) ? 1 : 0;
        }

        for (int j = 1; j < n; j++) {
            dp[0][j] = (grid[0][j] == 0 && dp[0][j - 1] == 1) ? 1 : 0;
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (grid[i][j] == 0) {
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
                }
            }
        }

        return dp[m - 1][n - 1];
    }

    int DynamicProgramming::minimum_path_sum(const std::vector<std::vector<int>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;

        int m = grid.size();
        int n = grid[0].size();
        std::vector<std::vector<int>> dp(m, std::vector<int>(n));

        dp[0][0] = grid[0][0];

        for (int i = 1; i < m; i++) {
            dp[i][0] = dp[i - 1][0] + grid[i][0];
        }

        for (int j = 1; j < n; j++) {
            dp[0][j] = dp[0][j - 1] + grid[0][j];
        }

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = std::min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }

        return dp[m - 1][n - 1];
    }

    std::string DynamicProgramming::get_algorithm_info(const std::string& algorithm_name) {
        if (algorithm_name == "fibonacci") {
            return "Fibonacci - Time: O(n), Space: O(n), Classic DP example";
        } else if (algorithm_name == "lcs") {
            return "Longest Common Subsequence - Time: O(mn), Space: O(mn), String matching";
        } else if (algorithm_name == "edit_distance") {
            return "Edit Distance (Levenshtein) - Time: O(mn), Space: O(mn), String similarity";
        } else if (algorithm_name == "lis") {
            return "Longest Increasing Subsequence - Time: O(n²), Space: O(n), Sequence analysis";
        } else if (algorithm_name == "maximum_subarray") {
            return "Maximum Subarray Sum (Kadane's) - Time: O(n), Space: O(1), Array optimization";
        } else if (algorithm_name == "coin_change") {
            return "Coin Change - Time: O(n×amount), Space: O(amount), Optimization problem";
        } else if (algorithm_name == "knapsack") {
            return "0/1 Knapsack - Time: O(n×W), Space: O(n×W), Resource optimization";
        } else if (algorithm_name == "unique_paths") {
            return "Unique Paths - Time: O(mn), Space: O(mn), Grid traversal counting";
        } else {
            return "Unknown algorithm";
        }
    }
}