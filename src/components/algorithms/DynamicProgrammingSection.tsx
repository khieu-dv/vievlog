"use client";

import { useState, useEffect } from "react";
import { Layers2 } from "lucide-react";
import { MermaidDiagram } from "~/components/common/MermaidDiagram";
import { RustCodeEditor } from "~/components/common/RustCodeEditor";
import { initRustWasm } from "~/lib/rust-wasm-helper";

export function DynamicProgrammingSection() {
  const [rustDP, setRustDP] = useState<any>(null);
  const [wasmReady, setWasmReady] = useState(false);
  const [result, setResult] = useState("");
  const [wasm, setWasm] = useState<any>(null);

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
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Demo tương tác Dynamic Programming sử dụng Rust WASM. Quy hoạch động được tối ưu hóa là kỹ thuật giải quyết bài toán bằng cách chia nhỏ thành các bài toán con và lưu trữ kết quả để tránh tính toán lặp lại.
        </p>

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

          {/* Rust Implementation */}
          <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded border">
            <h4 className="font-medium mb-2">Cài Đặt Rust:</h4>
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
          </div>
        </div>
      </div>
    </div>
  );
}