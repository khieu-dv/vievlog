"use client";

import React, { useState, useEffect } from 'react';
import { rustWasm } from '~/lib/wasm-loader';
import { Button } from '~/components/ui/Button';

export function SimpleIODemo() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const initWasm = async () => {
      try {
        setLoading(true);
        await rustWasm.init();
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize WASM:', error);
      } finally {
        setLoading(false);
      }
    };

    initWasm();
  }, []);

  const processText = () => {
    if (!isLoaded || !inputText.trim()) return;

    try {
      // Sử dụng các function Rust đơn giản
      const reversed = rustWasm.reverseString(inputText);
      const wordCount = rustWasm.countWords(inputText);
      const slug = rustWasm.generateSlug(inputText);
      const hash = rustWasm.simpleHash(inputText);
      
      const output = `
=== KẾT QUẢ XỬ LÝ VỚI RUST ===

📝 Text gốc: "${inputText}"

🔄 Text đảo ngược: "${reversed}"

📊 Số từ: ${wordCount}

🔗 Slug URL: "${slug}"

#️⃣ Hash code: ${hash}

⏱️ Xử lý bởi Rust WASM
      `.trim();

      setResult(output);
    } catch (error) {
      console.error('Error processing text:', error);
      setResult('Lỗi khi xử lý text!');
    }
  };

  const clearAll = () => {
    setInputText('');
    setResult('');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải Rust WASM...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center text-red-600">
          <p>Không thể tải Rust WASM module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔄 Input/Output Text Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Nhập text và xem Rust xử lý như thế nào
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          📝 Nhập Text
        </h2>
        
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập text bất kỳ vào đây..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div className="flex gap-3">
            <Button onClick={processText} className="flex-1">
              🚀 Xử lý với Rust
            </Button>
            <Button onClick={clearAll} variant="outline">
              🗑️ Xóa tất cả
            </Button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      {result && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            📤 Kết Quả
          </h2>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
              {result}
            </pre>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={() => navigator.clipboard.writeText(result)}
              variant="outline"
              size="sm"
            >
              📋 Copy kết quả
            </Button>
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
          💡 Thử các ví dụ này:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInputText("Hello World from Rust!")}
            className="text-left justify-start"
          >
            "Hello World from Rust!"
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInputText("Tôi đang học Rust và Next.js")}
            className="text-left justify-start"
          >
            "Tôi đang học Rust và Next.js"
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInputText("This is a Sample Blog Title for URL Slug")}
            className="text-left justify-start"
          >
            "This is a Sample Blog Title for URL Slug"
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInputText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")}
            className="text-left justify-start"
          >
            "Lorem ipsum dolor sit amet..."
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
          🦀 Rust Functions được sử dụng:
        </h3>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>• <strong>reverse_string():</strong> Đảo ngược chuỗi ký tự</li>
          <li>• <strong>count_words():</strong> Đếm số từ trong text</li>
          <li>• <strong>generate_slug():</strong> Tạo URL slug thân thiện</li>
          <li>• <strong>simple_hash():</strong> Tạo hash code từ text</li>
        </ul>
      </div>
    </div>
  );
}