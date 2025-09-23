"use client";

import { useState, useEffect } from "react";
import { Layers2 } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { CppCodeEditor } from "~/components/common/CppCodeEditor";
import { PythonCodeEditor } from "~/components/common/PythonCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function DynamicProgrammingSection() {
  const [rustDP, setRustDP] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);
  const [activeLanguageTab, setActiveLanguageTab] = useState("rust");

  // Fibonacci section
  const [fibN, setFibN] = useState(10);
  const [fibResult, setFibResult] = useState<number>(0);

  // Knapsack section
  const [knapsackCapacity, setKnapsackCapacity] = useState(10);
  const [knapsackItems, setKnapsackItems] = useState([
    { weight: 2, value: 3, name: "Item 1" },
    { weight: 3, value: 4, name: "Item 2" },
    { weight: 4, value: 5, name: "Item 3" },
    { weight: 5, value: 6, name: "Item 4" },
  ]);
  const [knapsackResult, setKnapsackResult] = useState<number>(0);

  // Longest Common Subsequence section
  const [lcsText1, setLcsText1] = useState("ABCDGH");
  const [lcsText2, setLcsText2] = useState("AEDFHR");
  const [lcsResult, setLcsResult] = useState<number>(0);
  const [lcsSequence, setLcsSequence] = useState<string>("");

  // Coin Change section
  const [coinAmount, setCoinAmount] = useState(11);
  const [coinDenominations, setCoinDenominations] = useState([1, 5, 10, 25]);
  const [coinResult, setCoinResult] = useState<{ minCoins: number; coins: number[] } | null>(null);

  // Initialize WASM
  useEffect(() => {
    async function init() {
      try {
        const wasmInstance = await initRustWasm();
        const newDP = wasmInstance.algorithms.dynamicProgramming;
        setRustDP(newDP);
        setWasm(wasmInstance);
        setWasmReady(true);
        setResult("✅ Rust WASM Dynamic Programming algorithms đã sẵn sàng!");
      } catch (error) {
        console.error("Failed to initialize WASM:", error);
        setResult("❌ Không thể khởi tạo Rust WASM");
      }
    }
    init();
  }, []);

  const calculateFibonacci = () => {
    if (fibN < 0 || fibN > 50) {
      setResult("❌ Số không hợp lệ (0-50)");
      return;
    }

    if (wasmReady && rustDP) {
      try {
        const result = rustDP.fibonacci(fibN);
        setFibResult(result);
        setResult(`🦀 Fibonacci(${fibN}) = ${result}`);
      } catch (error) {
        setResult("❌ Rust WASM Fibonacci failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const solveKnapsack = () => {
    if (wasmReady && rustDP) {
      try {
        const weights = knapsackItems.map(item => item.weight);
        const values = knapsackItems.map(item => item.value);
        const result = rustDP.knapsack(weights, values, knapsackCapacity);
        setKnapsackResult(result);
        setResult(`🦀 Knapsack: Giá trị tối đa = ${result} với dung lượng ${knapsackCapacity}`);
      } catch (error) {
        setResult("❌ Rust WASM Knapsack failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const solveLCS = () => {
    if (wasmReady && rustDP) {
      try {
        const result = rustDP.longestCommonSubsequence(lcsText1, lcsText2);
        setLcsResult(result.length);
        setLcsSequence(result.sequence);
        setResult(`🦀 LCS: Độ dài = ${result.length}, Dãy = "${result.sequence}"`);
      } catch (error) {
        setResult("❌ Rust WASM LCS failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  const solveCoinChange = () => {
    if (wasmReady && rustDP) {
      try {
        const result = rustDP.coinChange(coinDenominations, coinAmount);
        setCoinResult(result);
        if (result && result.minCoins >= 0) {
          setResult(`🦀 Coin Change: Số đồng xu tối thiểu = ${result.minCoins} để đổi ${coinAmount}`);
        } else {
          setResult(`🦀 Coin Change: Không thể đổi ${coinAmount} với các mệnh giá hiện có`);
        }
      } catch (error) {
        setResult("❌ Rust WASM Coin Change failed: " + error);
      }
    } else {
      setResult("❌ WASM chưa sẵn sàng");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layers2 className="h-5 w-5" />
          🦀 Rust WASM Dynamic Programming (Quy Hoạch Động)
        </h3>

        {/* Định nghĩa và giải thích cơ bản */}
        <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg mb-4 border-l-4 border-slate-500">
          <h4 className="font-semibold text-slate-800 dark:text-slate-300 mb-2">🧩 Quy Hoạch Động là gì?</h4>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <strong>Dynamic Programming (DP)</strong> là kỹ thuật giải quyết bài toán phức tạp bằng cách:
            chia nhỏ thành các bài toán con + lưu kết quả để tránh tính lại.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-blue-600 dark:text-blue-400">🔑 Điều kiện sử dụng DP:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• <strong>Overlapping Subproblems:</strong> Các bài toán con trùng lặp</li>
                <li>• <strong>Optimal Substructure:</strong> Lời giải tối ưu từ lời giải con</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded">
              <strong className="text-green-600 dark:text-green-400">🎯 Ứng dụng thực tế:</strong>
              <ul className="mt-1 text-gray-600 dark:text-gray-300">
                <li>• Tối ưu hóa đầu tư, lập lịch</li>
                <li>• Game: tìm path tối ưu</li>
                <li>• Xử lý ngôn ngữ tự nhiên</li>
                <li>• Bioinformatics (DNA)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-4 border-l-4 border-emerald-500">
          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">⚡ Top-down vs Bottom-up:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Memoization (Top-down):</strong>
              <br/><span className="text-gray-600 dark:text-gray-400">Recursion + cache kết quả đã tính</span>
            </div>
            <div>
              <strong>Tabulation (Bottom-up):</strong>
              <br/><span className="text-gray-600 dark:text-gray-400">Dùng bảng, tính từ nhỏ đến lớn</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
            <strong>Kết quả:</strong> {result}
          </div>
        )}

        <div className="space-y-6">
          {/* Fibonacci Section */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">1. Fibonacci với Memoization:</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={fibN}
                onChange={(e) => setFibN(parseInt(e.target.value) || 0)}
                placeholder="Nhập n"
                min="0"
                max="50"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={calculateFibonacci}
                disabled={!wasmReady}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                🦀 Tính Fibonacci({fibN})
              </button>
            </div>

            {fibResult > 0 && (
              <div className="space-y-2">
                <p className="font-medium">🦀 Kết quả: Fibonacci({fibN}) = {fibResult}</p>
              </div>
            )}
          </div>

          {/* Knapsack Section */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">2. 0/1 Knapsack Problem:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">Sức chứa túi:</label>
                <input
                  type="number"
                  value={knapsackCapacity}
                  onChange={(e) => setKnapsackCapacity(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                />
              </div>
              <div>
                <button
                  onClick={solveKnapsack}
                  disabled={!wasmReady}
                  className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  🦀 Giải Knapsack
                </button>
              </div>
            </div>

            <div className="mb-3">
              <h5 className="font-medium mb-2">Danh sách vật phẩm:</h5>
              <div className="space-y-1">
                {knapsackItems.map((item, index) => (
                  <div key={index} className="text-sm bg-white dark:bg-slate-800 p-2 rounded">
                    {item.name}: Trọng lượng = {item.weight}, Giá trị = {item.value}
                  </div>
                ))}
              </div>
            </div>

            {knapsackResult && (
              <div className="space-y-2">
                <p className="font-medium">Giá trị tối đa: {knapsackResult}</p>
                <div>
                  <strong>Danh sách vật phẩm:</strong>
                  <div className="mt-1 space-y-1">
                    {knapsackItems.map((item, index) => (
                      <div key={index} className="text-sm p-2 rounded bg-gray-100 dark:bg-gray-700">
                        {item.name} (Trọng lượng: {item.weight}, Giá trị: {item.value})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* LCS Section */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">3. Longest Common Subsequence (LCS):</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              <input
                type="text"
                value={lcsText1}
                onChange={(e) => setLcsText1(e.target.value.toUpperCase())}
                placeholder="Chuỗi 1"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <input
                type="text"
                value={lcsText2}
                onChange={(e) => setLcsText2(e.target.value.toUpperCase())}
                placeholder="Chuỗi 2"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={solveLCS}
                disabled={!wasmReady}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              >
                🦀 Tìm LCS
              </button>
            </div>

            {lcsResult && (
              <div className="space-y-2">
                <p className="font-medium">Độ dài LCS: {lcsResult}</p>
                <p className="font-medium">Chuỗi con chung dài nhất: "{lcsSequence}"</p>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                  <p className="text-sm">Kết quả được tính toán bằng thuật toán Dynamic Programming từ Rust WASM.</p>
                </div>
              </div>
            )}
          </div>

          {/* Coin Change Section */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">4. Coin Change Problem:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              <input
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinAmount(parseInt(e.target.value) || 0)}
                placeholder="Số tiền cần đổi"
                min="1"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <input
                type="text"
                value={coinDenominations.join(',')}
                onChange={(e) => {
                  const coins = e.target.value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x > 0);
                  setCoinDenominations(coins);
                }}
                placeholder="Mệnh giá (phân cách bằng dấu phẩy)"
                className="px-3 py-2 border rounded dark:bg-slate-600 dark:border-slate-500"
              />
              <button
                onClick={solveCoinChange}
                disabled={!wasmReady}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                🦀 Đổi Tiền
              </button>
            </div>

            <p className="text-sm mb-3">Mệnh giá hiện tại: [{coinDenominations.join(', ')}]</p>

            {coinResult && (
              <div className="space-y-2">
                {coinResult.minCoins === -1 ? (
                  <p className="font-medium text-red-600">Không thể đổi được số tiền {coinAmount}</p>
                ) : (
                  <>
                    <p className="font-medium">Số xu tối thiểu: {coinResult.minCoins}</p>
                    <p className="font-medium">Các xu sử dụng: [{coinResult.coins.join(', ')}]</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* DP Concept Diagram */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Nguyên Lý Dynamic Programming:</h4>
            <MermaidDiagram
              chart={`
                graph TD
                    PROBLEM[Bài toán lớn] --> DIVIDE[Chia nhỏ thành các bài toán con]
                    DIVIDE --> OVERLAP{Các bài toán con có chồng lắp?}

                    OVERLAP -->|Có| MEMO[Sử dụng Memoization]
                    OVERLAP -->|Không| RECURSIVE[Sử dụng Đệ quy thông thường]

                    MEMO --> TOPDOWN[Top-down approach]
                    MEMO --> BOTTOMUP[Bottom-up approach]

                    TOPDOWN --> STORE1[Lưu kết quả khi tính]
                    BOTTOMUP --> STORE2[Tính từ bài toán nhỏ nhất]

                    STORE1 --> RESULT[Kết quả tối ưu]
                    STORE2 --> RESULT
                    RECURSIVE --> RESULT

                    subgraph "Ví dụ DP Problems"
                        FIB[Fibonacci]
                        KNAP[Knapsack]
                        LCS_EX[LCS]
                        COIN[Coin Change]
                        EDIT[Edit Distance]
                        PATH[Shortest Path]
                    end

                    style PROBLEM fill:#F44336,color:#fff
                    style MEMO fill:#4CAF50,color:#fff
                    style RESULT fill:#2196F3,color:#fff
              `}
              className="mb-4"
            />
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">So Sánh Các Bài Toán DP:</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Bài Toán</th>
                    <th className="text-left py-2">Độ Phức Tạp</th>
                    <th className="text-left py-2">Không Gian</th>
                    <th className="text-left py-2">Ứng Dụng</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 font-medium">Fibonacci</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">O(n)</td>
                    <td className="py-2">Toán học, giới thiệu DP</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">0/1 Knapsack</td>
                    <td className="py-2">O(nW)</td>
                    <td className="py-2">O(nW)</td>
                    <td className="py-2">Phân bổ tài nguyên</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">LCS</td>
                    <td className="py-2">O(mn)</td>
                    <td className="py-2">O(mn)</td>
                    <td className="py-2">Diff tools, DNA analysis</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Coin Change</td>
                    <td className="py-2">O(nA)</td>
                    <td className="py-2">O(A)</td>
                    <td className="py-2">Đổi tiền, tối ưu hóa</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Edit Distance</td>
                    <td className="py-2">O(mn)</td>
                    <td className="py-2">O(mn)</td>
                    <td className="py-2">Spell checker, DNA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Multi-language Implementation */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-4">Cài Đặt:</h4>

            {/* Language Tabs */}
            <div className="mb-4">
              <div className="border-b border-gray-200 dark:border-gray-600">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveLanguageTab("rust")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "rust"
                        ? "border-orange-500 text-orange-600 dark:text-orange-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Rust
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("cpp")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "cpp"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    C++
                  </button>
                  <button
                    onClick={() => setActiveLanguageTab("python")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeLanguageTab === "python"
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Python
                  </button>
                </nav>
              </div>
            </div>

            {/* Language-specific Code */}
            {activeLanguageTab === "rust" && (
              <RustCodeEditor
              code={`use std::collections::HashMap;

// 1. Fibonacci với Memoization
pub fn fibonacci_memo(n: usize, memo: &mut HashMap<usize, u64>) -> u64 {
    if let Some(&result) = memo.get(&n) {
        return result;
    }

    let result = match n {
        0 => 0,
        1 => 1,
        _ => fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo),
    };

    memo.insert(n, result);
    result
}

// 2. 0/1 Knapsack
pub fn knapsack(weights: &[usize], values: &[usize], capacity: usize) -> usize {
    let n = weights.len();
    let mut dp = vec![vec![0; capacity + 1]; n + 1];

    for i in 1..=n {
        for w in 1..=capacity {
            if weights[i - 1] <= w {
                dp[i][w] = std::cmp::max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    dp[n][capacity]
}

// 3. Longest Common Subsequence
pub fn lcs(text1: &str, text2: &str) -> usize {
    let chars1: Vec<char> = text1.chars().collect();
    let chars2: Vec<char> = text2.chars().collect();
    let m = chars1.len();
    let n = chars2.len();

    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if chars1[i - 1] == chars2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::cmp::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    dp[m][n]
}

// 4. Coin Change (số xu tối thiểu)
pub fn coin_change(coins: &[usize], amount: usize) -> Option<usize> {
    let mut dp = vec![usize::MAX; amount + 1];
    dp[0] = 0;

    for coin in coins {
        for i in *coin..=amount {
            if dp[i - coin] != usize::MAX {
                dp[i] = std::cmp::min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    if dp[amount] == usize::MAX {
        None
    } else {
        Some(dp[amount])
    }
}

// 5. Edit Distance (Levenshtein distance)
pub fn edit_distance(word1: &str, word2: &str) -> usize {
    let chars1: Vec<char> = word1.chars().collect();
    let chars2: Vec<char> = word2.chars().collect();
    let m = chars1.len();
    let n = chars2.len();

    let mut dp = vec![vec![0; n + 1]; m + 1];

    // Initialize base cases
    for i in 0..=m {
        dp[i][0] = i;
    }
    for j in 0..=n {
        dp[0][j] = j;
    }

    for i in 1..=m {
        for j in 1..=n {
            if chars1[i - 1] == chars2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + std::cmp::min(
                    std::cmp::min(dp[i - 1][j], dp[i][j - 1]),
                    dp[i - 1][j - 1]
                );
            }
        }
    }

    dp[m][n]
}

// Sử dụng
fn main() {
    // Fibonacci
    let mut memo = HashMap::new();
    println!("Fibonacci(10) = {}", fibonacci_memo(10, &mut memo));

    // Knapsack
    let weights = vec![2, 3, 4, 5];
    let values = vec![3, 4, 5, 6];
    println!("Knapsack = {}", knapsack(&weights, &values, 10));

    // LCS
    println!("LCS length = {}", lcs("ABCDGH", "AEDFHR"));

    // Coin Change
    let coins = vec![1, 5, 10, 25];
    if let Some(min_coins) = coin_change(&coins, 11) {
        println!("Min coins = {}", min_coins);
    }

    // Edit Distance
    println!("Edit distance = {}", edit_distance("kitten", "sitting"));
}`}
                height="500px"
              />
            )}

            {activeLanguageTab === "cpp" && (
              <CppCodeEditor
                code={`#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <climits>

class DynamicProgramming {
public:
    // 1. Fibonacci với Memoization
    static long long fibonacci(int n, std::unordered_map<int, long long>& memo) {
        if (memo.find(n) != memo.end()) {
            return memo[n];
        }

        long long result;
        if (n <= 1) {
            result = n;
        } else {
            result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
        }

        memo[n] = result;
        return result;
    }

    // 2. 0/1 Knapsack Problem
    static int knapsack(const std::vector<int>& weights, const std::vector<int>& values, int capacity) {
        int n = weights.size();
        std::vector<std::vector<int>> dp(n + 1, std::vector<int>(capacity + 1, 0));

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = std::max(
                        dp[i - 1][w],
                        dp[i - 1][w - weights[i - 1]] + values[i - 1]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        return dp[n][capacity];
    }

    // 3. Longest Common Subsequence
    static int lcs(const std::string& text1, const std::string& text2) {
        int m = text1.length();
        int n = text2.length();
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i - 1] == text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    // 4. Coin Change
    static int coinChange(const std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, INT_MAX);
        dp[0] = 0;

        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                if (dp[i - coin] != INT_MAX) {
                    dp[i] = std::min(dp[i], dp[i - coin] + 1);
                }
            }
        }

        return dp[amount] == INT_MAX ? -1 : dp[amount];
    }

    // 5. Edit Distance
    static int editDistance(const std::string& word1, const std::string& word2) {
        int m = word1.length();
        int n = word2.length();
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1));

        // Khởi tạo base cases
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + std::min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
                }
            }
        }

        return dp[m][n];
    }
};

// Sử dụng
int main() {
    // Fibonacci
    std::unordered_map<int, long long> memo;
    std::cout << "Fibonacci(10) = " << DynamicProgramming::fibonacci(10, memo) << std::endl;

    // Knapsack
    std::vector<int> weights = {2, 3, 4, 5};
    std::vector<int> values = {3, 4, 5, 6};
    std::cout << "Knapsack = " << DynamicProgramming::knapsack(weights, values, 10) << std::endl;

    // LCS
    std::cout << "LCS length = " << DynamicProgramming::lcs("ABCDGH", "AEDFHR") << std::endl;

    // Coin Change
    std::vector<int> coins = {1, 5, 10, 25};
    std::cout << "Min coins = " << DynamicProgramming::coinChange(coins, 11) << std::endl;

    // Edit Distance
    std::cout << "Edit distance = " << DynamicProgramming::editDistance("kitten", "sitting") << std::endl;

    return 0;
}`}
                height="500px"
              />
            )}

            {activeLanguageTab === "python" && (
              <PythonCodeEditor
                code={`from functools import lru_cache
from typing import List, Optional

class DynamicProgramming:
    """Các thuật toán Dynamic Programming cơ bản"""

    @staticmethod
    @lru_cache(maxsize=None)
    def fibonacci(n: int) -> int:
        """Fibonacci với memoization sử dụng decorator"""
        if n <= 1:
            return n
        return DynamicProgramming.fibonacci(n - 1) + DynamicProgramming.fibonacci(n - 2)

    @staticmethod
    def fibonacci_iterative(n: int) -> int:
        """Fibonacci bottom-up approach"""
        if n <= 1:
            return n

        dp = [0] * (n + 1)
        dp[1] = 1

        for i in range(2, n + 1):
            dp[i] = dp[i - 1] + dp[i - 2]

        return dp[n]

    @staticmethod
    def knapsack(weights: List[int], values: List[int], capacity: int) -> int:
        """0/1 Knapsack Problem"""
        n = len(weights)
        dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]

        for i in range(1, n + 1):
            for w in range(1, capacity + 1):
                if weights[i - 1] <= w:
                    dp[i][w] = max(
                        dp[i - 1][w],
                        dp[i - 1][w - weights[i - 1]] + values[i - 1]
                    )
                else:
                    dp[i][w] = dp[i - 1][w]

        return dp[n][capacity]

    @staticmethod
    def longest_common_subsequence(text1: str, text2: str) -> int:
        """Longest Common Subsequence"""
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

        return dp[m][n]

    @staticmethod
    def coin_change(coins: List[int], amount: int) -> int:
        """Coin Change - số xu tối thiểu"""
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0

        for coin in coins:
            for i in range(coin, amount + 1):
                if dp[i - coin] != float('inf'):
                    dp[i] = min(dp[i], dp[i - coin] + 1)

        return dp[amount] if dp[amount] != float('inf') else -1

    @staticmethod
    def coin_change_with_path(coins: List[int], amount: int) -> tuple:
        """Coin Change trả về cả số xu và danh sách xu"""
        dp = [float('inf')] * (amount + 1)
        parent = [-1] * (amount + 1)
        dp[0] = 0

        for coin in coins:
            for i in range(coin, amount + 1):
                if dp[i - coin] + 1 < dp[i]:
                    dp[i] = dp[i - coin] + 1
                    parent[i] = coin

        if dp[amount] == float('inf'):
            return -1, []

        # Reconstruct path
        result_coins = []
        current = amount
        while current > 0:
            coin = parent[current]
            result_coins.append(coin)
            current -= coin

        return dp[amount], result_coins

    @staticmethod
    def edit_distance(word1: str, word2: str) -> int:
        """Edit Distance (Levenshtein distance)"""
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        # Khởi tạo base cases
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],     # delete
                        dp[i][j - 1],     # insert
                        dp[i - 1][j - 1]  # replace
                    )

        return dp[m][n]

    @staticmethod
    def max_subarray_sum(arr: List[int]) -> int:
        """Maximum Subarray Sum (Kadane's Algorithm)"""
        if not arr:
            return 0

        max_so_far = max_ending_here = arr[0]

        for i in range(1, len(arr)):
            max_ending_here = max(arr[i], max_ending_here + arr[i])
            max_so_far = max(max_so_far, max_ending_here)

        return max_so_far

    @staticmethod
    def longest_increasing_subsequence(nums: List[int]) -> int:
        """Longest Increasing Subsequence"""
        if not nums:
            return 0

        dp = [1] * len(nums)

        for i in range(1, len(nums)):
            for j in range(i):
                if nums[i] > nums[j]:
                    dp[i] = max(dp[i], dp[j] + 1)

        return max(dp)

# Sử dụng:
if __name__ == "__main__":
    dp = DynamicProgramming()

    # Fibonacci
    print(f"Fibonacci(10) = {dp.fibonacci(10)}")

    # Knapsack
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    print(f"Knapsack = {dp.knapsack(weights, values, 10)}")

    # LCS
    print(f"LCS length = {dp.longest_common_subsequence('ABCDGH', 'AEDFHR')}")

    # Coin Change
    coins = [1, 5, 10, 25]
    min_coins, coin_list = dp.coin_change_with_path(coins, 11)
    print(f"Min coins = {min_coins}, Coins = {coin_list}")

    # Edit Distance
    print(f"Edit distance = {dp.edit_distance('kitten', 'sitting')}")

    # Max Subarray
    arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    print(f"Max subarray sum = {dp.max_subarray_sum(arr)}")

    # LIS
    nums = [10, 9, 2, 5, 3, 7, 101, 18]
    print(f"Longest increasing subsequence = {dp.longest_increasing_subsequence(nums)}")`}
                height="500px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}