import React from 'react';
import JSCodeEditor from '~/components/common/JSCodeEditor';

export const TestSmartInputIntegration: React.FC = () => {
  const testCodes = {
    cpp: `#include <iostream>
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
    python: `n = int(input())
numbers = list(map(int, input().split()))
print(f"Sum: {sum(numbers)}")`,
    java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for(int i = 0; i < n; i++) {
            int x = sc.nextInt();
            sum += x;
        }
        System.out.println("Sum: " + sum);
    }
}`,
    javascript: `const readline = require('readline-sync');
const n = parseInt(readline.question('Enter number: '));
let sum = 0;
for(let i = 0; i < n; i++) {
    const x = parseInt(readline.question('Enter number: '));
    sum += x;
}
console.log('Sum:', sum);`
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Input Integration Test
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Test the new smart input popup system. The system will analyze your code and show 
          step-by-step input dialogs when you click Run. If no input is needed, it runs directly.
        </p>
      </div>

      {/* Test Cases */}
      <div className="grid gap-8">
        {Object.entries(testCodes).map(([lang, code]) => (
          <div key={lang} className="bg-white rounded-lg shadow-lg border">
            <div className="bg-gray-100 px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-900 capitalize">
                {lang} Example - Multiple Inputs Expected
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This code should trigger the popup sequence for input collection.
              </p>
            </div>
            <div className="p-4">
              <JSCodeEditor 
                initialCode={code}
                className="h-96"
              />
            </div>
          </div>
        ))}

        {/* No Input Example */}
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="bg-gray-100 px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900">
              No Input Example - Should Run Directly
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              This code should run directly without showing any popups.
            </p>
          </div>
          <div className="p-4">
            <JSCodeEditor 
              initialCode={`console.log("Hello, World!");
console.log("No input needed!");
console.log("This should run directly.");`}
              className="h-64"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">How to Test:</h4>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Click the "Run" button on any code editor above</li>
          <li>
            <strong>For examples with input requirements:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>A popup sequence should appear</li>
              <li>Follow the step-by-step prompts</li>
              <li>Use "Use sample" buttons for quick testing</li>
              <li>Input validation should work in real-time</li>
            </ul>
          </li>
          <li>
            <strong>For the "No Input" example:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Should run directly without any popups</li>
            </ul>
          </li>
          <li>Check that the output appears correctly after completion</li>
        </ol>
      </div>

      {/* Feature List */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3">Expected Features:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-green-800">
          <ul className="list-disc list-inside space-y-1">
            <li>Smart code analysis for input detection</li>
            <li>Step-by-step popup sequence</li>
            <li>Real-time input validation</li>
            <li>Sample input generation</li>
            <li>Progress tracking</li>
            <li>Skip options</li>
          </ul>
          <ul className="list-disc list-inside space-y-1">
            <li>Language-specific patterns (C, C++, Python, Java, JS)</li>
            <li>Type detection (int, float, string, arrays)</li>
            <li>Error handling and user feedback</li>
            <li>Direct execution for no-input code</li>
            <li>Mobile-friendly responsive design</li>
            <li>Dark mode support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};