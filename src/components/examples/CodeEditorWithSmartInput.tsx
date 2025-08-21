import React, { useState } from 'react';
import { SmartCodeRunner } from '~/components/common/SmartCodeRunner';

interface CodeEditorWithSmartInputProps {
  initialCode?: string;
  language?: string;
}

export const CodeEditorWithSmartInput: React.FC<CodeEditorWithSmartInputProps> = ({
  initialCode = `#include <iostream>
using namespace std;

int main() {
    int n, sum = 0;
    cout << "Enter number of elements: ";
    cin >> n;
    
    cout << "Enter " << n << " numbers: ";
    for(int i = 0; i < n; i++) {
        int x;
        cin >> x;
        sum += x;
    }
    
    cout << "Sum = " << sum << endl;
    return 0;
}`,
  language = 'cpp'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async (input: string) => {
    setIsRunning(true);
    setOutput('Running...');
    
    try {
      // Simulate Judge0 API call
      const response = await fetch('/api/judge0/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: getLanguageId(language),
          stdin: input
        }),
      });

      const result = await response.json();
      
      if (result.status?.id === 3) { // Accepted
        setOutput(result.stdout || 'No output');
      } else {
        setOutput(result.stderr || result.compile_output || 'Error occurred');
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageId = (lang: string): number => {
    const languageIds: Record<string, number> = {
      'c': 50,
      'cpp': 54,
      'java': 62,
      'python': 71,
      'javascript': 63
    };
    return languageIds[lang] || 54;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Code Editor</h3>
            <div className="flex items-center gap-3">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-800"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
              
              {/* Smart Code Runner */}
              <SmartCodeRunner
                code={code}
                language={language}
                onRun={handleRunCode}
                isRunning={isRunning}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 font-mono text-sm border rounded p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Write your code here..."
          />
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b">
            <h3 className="font-medium text-gray-900 dark:text-white">Output</h3>
          </div>
          <div className="p-4">
            <pre className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• The system analyzes your code to detect input requirements</li>
          <li>• If input is needed, popup dialogs will guide you step by step</li>
          <li>• If no input is needed, code runs directly</li>
          <li>• Input validation happens before sending to Judge0</li>
          <li>• You can skip inputs or use sample values</li>
        </ul>
      </div>
    </div>
  );
};