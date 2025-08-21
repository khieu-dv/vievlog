"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Code, X, Maximize2, Minimize2, RotateCcw, Move, ExternalLink } from 'lucide-react';
import JSCodeEditor from './JSCodeEditor';

const FloatingCodeEditor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPopout, setIsPopout] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const popoutWindowRef = useRef<Window | null>(null);
  const rafRef = useRef<number | null>(null);
  const screenDimensions = useRef({ width: 0, height: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  
  // Load cached code for JavaScript (default language) on mount
  const [code, setCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const cachedCode = localStorage.getItem('quickCodeEditor_code_63'); // JavaScript language ID
      if (cachedCode && cachedCode.trim()) {
        return cachedCode;
      }
    }
    return `// Welcome to Quick Code Editor!
// Try some JavaScript code here:

function greetUser(name) {
  return \`Hello, \${name}! Welcome to VieVlog.\`;
}

console.log(greetUser("Developer"));
`;
  });

  // Handle touch feedback with haptic-like effect
  const handleTouch = useCallback((e: React.TouchEvent) => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const resetCode = () => {
    const defaultCode = `// Welcome to Quick Code Editor!
// Try some JavaScript code here:

function greetUser(name) {
  return \`Hello, \${name}! Welcome to VieVlog.\`;
}

console.log(greetUser("Developer"));`;
    
    setCode(defaultCode);
    
    // Clear all cached code for Quick Code Editor
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('quickCodeEditor_code_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return; // Don't allow dragging when expanded
    
    // Don't drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive = target.tagName === 'BUTTON' || 
                         target.tagName === 'SELECT' || 
                         target.tagName === 'INPUT' ||
                         target.closest('button') ||
                         target.closest('select') ||
                         target.closest('input') ||
                         target.closest('.monaco-editor');
    
    if (isInteractive) return;
    
    // Cache screen dimensions for drag operation
    screenDimensions.current = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Store initial position for direction calculation
    lastPosition.current = { x: position.x, y: position.y };
    
    setIsDragging(true);
    const rect = editorRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
    
    // Prevent text selection while dragging
    e.preventDefault();
  };

  // Handle popout window
  const handlePopout = useCallback(() => {
    if (isPopout && popoutWindowRef.current) {
      // Close popout window
      popoutWindowRef.current.close();
      setIsPopout(false);
      return;
    }

    // Open popout window
    const newWindow = window.open(
      '',
      'QuickCodeEditor',
      'width=800,height=600,resizable=yes,scrollbars=yes,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no'
    );

    if (newWindow) {
      popoutWindowRef.current = newWindow;
      setIsPopout(true);

      // Create the HTML content for the popout window
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Quick Code Editor - VieVlog</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-core.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-javascript.min.js"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #1e1e1e;
              color: #ffffff;
              height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .header {
              padding: 12px 16px;
              background: linear-gradient(to right, #2563eb, #7c3aed);
              color: white;
              display: flex;
              align-items: center;
              gap: 8px;
              border-bottom: 1px solid #374151;
            }
            .main-container {
              flex: 1;
              display: flex;
              min-height: 0;
            }
            .editor-section {
              flex: 3;
              display: flex;
              flex-direction: column;
              border-right: 1px solid #374151;
            }
            .editor-header {
              padding: 12px 16px;
              background: #374151;
              display: flex;
              align-items: center;
              justify-content: between;
              gap: 12px;
              border-bottom: 1px solid #4b5563;
            }
            .editor-title {
              font-weight: 600;
              font-size: 14px;
              flex: 1;
            }
            .editor-controls {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .control-select, .control-button {
              padding: 6px 12px;
              font-size: 12px;
              border: 1px solid #6b7280;
              border-radius: 4px;
              background: #4b5563;
              color: white;
              cursor: pointer;
            }
            .control-select:focus, .control-button:focus {
              outline: none;
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
            .control-button:hover {
              background: #6b7280;
            }
            .control-button.run {
              background: #2563eb;
            }
            .control-button.run:hover {
              background: #1d4ed8;
            }
            .control-button.format {
              background: #6b7280;
            }
            .control-button.format:hover {
              background: #9ca3af;
            }
            .control-button:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            .editor-container {
              flex: 1;
              position: relative;
            }
            #editor {
              width: 100%;
              height: 100%;
            }
            .output-section {
              flex: 2;
              display: flex;
              flex-direction: column;
              background: #f9fafb;
            }
            .output-header {
              padding: 12px 16px;
              background: #f3f4f6;
              border-bottom: 1px solid #e5e7eb;
            }
            .output-title {
              font-weight: 600;
              font-size: 14px;
              color: #374151;
            }
            .output-content {
              flex: 1;
              padding: 16px;
              background: #f9fafb;
              color: #1f2937;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 12px;
              overflow: auto;
              white-space: pre-wrap;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            <span>Quick Code Editor - VieVlog</span>
          </div>
          <div class="main-container">
            <div class="editor-section">
              <div class="editor-header">
                <div class="editor-title">Code Editor</div>
                <div class="editor-controls">
                  <select id="languageSelect" class="control-select">
                    <option value="63">JavaScript</option>
                    <option value="71">Python</option>
                    <option value="62">Java</option>
                    <option value="54">C++</option>
                    <option value="50">C</option>
                    <option value="78">Kotlin</option>
                    <option value="51">C#</option>
                    <option value="60">Go</option>
                    <option value="73">Rust</option>
                  </select>
                  <button id="runButton" class="control-button run">Run</button>
                  <button id="formatButton" class="control-button format">Format</button>
                </div>
              </div>
              <div class="editor-container">
                <div id="editor"></div>
              </div>
            </div>
            <div class="output-section">
              <div class="output-header">
                <div class="output-title">Output</div>
              </div>
              <div id="output" class="output-content">Output will appear here...</div>
            </div>
          </div>
          <script>
            let editor;
            let selectedLanguageId = 63;
            let isRunning = false;
            
            const SUPPORTED_LANGUAGES = {
              63: { 
                name: "JavaScript", 
                monacoLanguage: "javascript",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some JavaScript code here:

function greetUser(name) {
  return \\\`Hello, \\\${name}! Welcome to VieVlog.\\\`;
}

console.log(greetUser("Developer"));\`
              },
              71: { 
                name: "Python", 
                monacoLanguage: "python",
                defaultCode: \`# Welcome to Quick Code Editor!
# Try some Python code here:

def greet_user(name):
    return f"Hello, {name}! Welcome to VieVlog."

print(greet_user("Developer"))\`
              },
              62: { 
                name: "Java", 
                monacoLanguage: "java",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some Java code here:

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java! Welcome to VieVlog.");
    }
}\`
              },
              54: { 
                name: "C++", 
                monacoLanguage: "cpp",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some C++ code here:

#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++! Welcome to VieVlog." << endl;
    return 0;
}\`
              },
              50: { 
                name: "C", 
                monacoLanguage: "c",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some C code here:

#include <stdio.h>

int main() {
    printf("Hello, C! Welcome to VieVlog.\\\\n");
    return 0;
}\`
              },
              78: { 
                name: "Kotlin", 
                monacoLanguage: "kotlin",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some Kotlin code here:

fun main() {
    println("Hello, Kotlin! Welcome to VieVlog.")
}\`
              },
              51: { 
                name: "C#", 
                monacoLanguage: "csharp",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some C# code here:

using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, C#! Welcome to VieVlog.");
    }
}\`
              },
              60: { 
                name: "Go", 
                monacoLanguage: "go",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some Go code here:

package main

import "fmt"

func main() {
    fmt.Println("Hello, Go! Welcome to VieVlog.")
}\`
              },
              73: { 
                name: "Rust", 
                monacoLanguage: "rust",
                defaultCode: \`// Welcome to Quick Code Editor!
// Try some Rust code here:

fn main() {
    println!("Hello, Rust! Welcome to VieVlog.");
}\`
              }
            };
            
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
            require(['vs/editor/editor.main'], function () {
              editor = monaco.editor.create(document.getElementById('editor'), {
                value: ${JSON.stringify(code)},
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                minimap: { enabled: false },
                wordWrap: 'on',
                formatOnType: true,
                formatOnPaste: true,
                autoIndent: 'full'
              });

              // Sync changes back to parent window
              editor.onDidChangeModelContent(() => {
                const newCode = editor.getValue();
                if (window.opener && !window.opener.closed) {
                  localStorage.setItem('quickCodeEditor_code_63', newCode);
                  window.opener.postMessage({ 
                    type: 'codeChange', 
                    code: newCode 
                  }, '*');
                }
              });

              // Listen for code changes from parent
              window.addEventListener('message', (event) => {
                if (event.data.type === 'updateCode') {
                  const currentCode = editor.getValue();
                  if (currentCode !== event.data.code) {
                    editor.setValue(event.data.code);
                  }
                }
              });
            });

            // Language change handler
            document.getElementById('languageSelect').addEventListener('change', function(e) {
              const newLanguageId = parseInt(e.target.value);
              const language = SUPPORTED_LANGUAGES[newLanguageId];
              
              if (language && editor) {
                const currentCode = editor.getValue().trim();
                const shouldLoadDefault = !currentCode || confirm(
                  \`Switch to \${language.name}?\\n\\nClick OK to load default \${language.name} code.\\nClick Cancel to keep current code.\`
                );

                selectedLanguageId = newLanguageId;
                monaco.editor.setModelLanguage(editor.getModel(), language.monacoLanguage);
                
                if (shouldLoadDefault) {
                  editor.setValue(language.defaultCode);
                  
                  // Sync the new default code to parent window
                  if (window.opener && !window.opener.closed) {
                    localStorage.setItem(\`quickCodeEditor_code_\${selectedLanguageId}\`, language.defaultCode);
                    window.opener.postMessage({ 
                      type: 'codeChange', 
                      code: language.defaultCode 
                    }, '*');
                  }
                }
              }
            });

            // Format button handler
            document.getElementById('formatButton').addEventListener('click', async function() {
              if (editor) {
                try {
                  await editor.getAction("editor.action.formatDocument")?.run();
                } catch (error) {
                  console.error("Format failed:", error);
                }
              }
            });

            // Run button handler
            document.getElementById('runButton').addEventListener('click', async function() {
              if (isRunning) return;
              
              const code = editor.getValue();
              if (!code.trim()) {
                document.getElementById('output').textContent = 'Error: Code cannot be empty';
                return;
              }

              isRunning = true;
              const runButton = document.getElementById('runButton');
              runButton.textContent = 'Running...';
              runButton.disabled = true;

              try {
                const baseUrl = window.opener ? window.opener.location.origin : window.location.origin;
                const response = await fetch(\`\${baseUrl}/api/run-code\`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                  },
                  credentials: 'include',
                  mode: 'cors',
                  body: JSON.stringify({
                    code: code,
                    language_id: selectedLanguageId,
                    stdin: ""
                  })
                });

                if (!response.ok) {
                  throw new Error(\`HTTP error! status: \${response.status}\`);
                }

                const data = await response.json();
                const outputElement = document.getElementById('output');

                if (data.error) {
                  outputElement.textContent = \`Execution Error:\\n\${data.error}\`;
                } else {
                  const logs = data.logs ? data.logs.join('\\n') : '';
                  const result = data.result || '';
                  const output = [logs, result].filter(Boolean).join('\\n') || 'Code executed successfully (no output)';
                  outputElement.textContent = output;
                }
              } catch (error) {
                document.getElementById('output').textContent = \`Network Error: \${error.message}\`;
              } finally {
                isRunning = false;
                runButton.textContent = 'Run';
                runButton.disabled = false;
              }
            });

            // Handle window close
            window.addEventListener('beforeunload', () => {
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage({ type: 'popoutClosed' }, '*');
              }
            });
          </script>
        </body>
        </html>
      `;

      newWindow.document.write(htmlContent);
      newWindow.document.close();

      // Close the original popup when popout is opened
      setIsOpen(false);

      // Listen for messages from popout window
      const handleMessage = (event: MessageEvent) => {
        if (event.source === newWindow) {
          if (event.data.type === 'codeChange') {
            setCode(event.data.code);
          } else if (event.data.type === 'popoutClosed') {
            setIsPopout(false);
            popoutWindowRef.current = null;
            setIsOpen(true); // Reopen the original popup
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup when window is closed
      newWindow.addEventListener('beforeunload', () => {
        window.removeEventListener('message', handleMessage);
        setIsPopout(false);
        popoutWindowRef.current = null;
        setIsOpen(true); // Reopen the original popup
      });
    }
  }, [code, isPopout, setIsOpen, setCode]);

  // Handle drag move with performance optimization
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isExpanded) return;

    // Cancel previous frame if still pending
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Update position using transform for better performance
      if (editorRef.current) {
        editorRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      }

      // Use cached screen dimensions for better performance
      const { width: screenWidth, height: screenHeight } = screenDimensions.current;
      const threshold = 80;
      const warningThreshold = 120;

      const isBeyondBounds = 
        newX < -threshold || 
        newY < -threshold || 
        newX > screenWidth - threshold || 
        newY > screenHeight - threshold;

      const isNearBounds = 
        newX < -warningThreshold || 
        newY < -warningThreshold || 
        newX > screenWidth - warningThreshold || 
        newY > screenHeight - warningThreshold;

      // Only update if state actually changed to avoid unnecessary re-renders
      const newIsNearEdge = isNearBounds && !isBeyondBounds;
      if (newIsNearEdge !== isNearEdge) {
        setIsNearEdge(newIsNearEdge);
      }

      // Check movement direction to determine if we should auto pop-out
      if (isBeyondBounds && !isPopout) {
        const deltaX = newX - lastPosition.current.x;
        const deltaY = newY - lastPosition.current.y;
        
        // Only trigger pop-out if moving AWAY from screen center
        const screenCenterX = screenWidth / 2;
        const screenCenterY = screenHeight / 2;
        
        const isMovingAwayFromCenter = 
          (newX < 0 && deltaX < 0) ||                    // Moving left and going more left
          (newY < 0 && deltaY < 0) ||                    // Moving up and going more up  
          (newX > screenWidth && deltaX > 0) ||          // Moving right and going more right
          (newY > screenHeight && deltaY > 0);          // Moving down and going more down
        
        if (isMovingAwayFromCenter) {
          handlePopout();
          return;
        }
      }

      // Update position tracking for next frame
      lastPosition.current = { x: newX, y: newY };
      
      // Batch state update less frequently
      setPosition({ x: newX, y: newY });
      rafRef.current = null;
    });
  }, [isDragging, dragStart, isExpanded, isPopout, handlePopout, isNearEdge]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsNearEdge(false);
    
    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // Reset CSS properties to use React state positioning
    if (editorRef.current) {
      editorRef.current.style.transform = '';
    }
  }, []);

  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset position when expanded/minimized
  useEffect(() => {
    if (isExpanded) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isExpanded]);


  // Send code updates to popout window
  useEffect(() => {
    if (isPopout && popoutWindowRef.current && !popoutWindowRef.current.closed) {
      popoutWindowRef.current.postMessage({ 
        type: 'updateCode', 
        code: code 
      }, '*');
    }
  }, [code, isPopout]);

  // Cleanup popout window and RAF on unmount
  useEffect(() => {
    return () => {
      if (popoutWindowRef.current && !popoutWindowRef.current.closed) {
        popoutWindowRef.current.close();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Floating Tab Button - Positioned at bottom right */}
      {!isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50">
          <button
            onClick={toggleOpen}
            onTouchStart={handleTouch}
            className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-xl 
                     hover:shadow-2xl transform hover:scale-105 active:scale-95 
                     transition-all duration-300 touch-manipulation select-none floating-code-button"
            aria-label="Open Code Editor"
          >
            <Code className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">Quick Code</span>
          </button>
        </div>
      )}

      {/* Floating Code Editor Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden floating-backdrop"
              onClick={() => setIsExpanded(false)}
            />
          )}

          {/* Editor Panel - Positioned from bottom right */}
          <div
            ref={editorRef}
            onMouseDown={handleMouseDown}
            className={`fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border 
                       ${isNearEdge ? 'border-blue-400 border-2 shadow-blue-500/50' : 'border-gray-200 dark:border-gray-700'}
                       ${isDragging ? '' : 'transition-all duration-200 ease-out'} 
                       transform floating-editor-enter
                       ${isExpanded
                ? 'inset-4 lg:inset-8'
                : 'w-[calc(100vw-2rem)] sm:w-96 h-[520px] sm:h-[600px] lg:w-[600px] lg:h-[500px] xl:w-[720px] xl:h-[600px]'
              }
                       ${isDragging ? 'cursor-move shadow-2xl scale-[1.02]' : 
                         (!isExpanded ? 'cursor-grab hover:shadow-2xl hover:scale-[1.01]' : 'scale-100 hover:shadow-3xl')}
                       ${isNearEdge ? 'shadow-2xl shadow-blue-500/30' : ''}
                       max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]
                       ${!isExpanded ? 'select-none' : ''}
                       ${isDragging ? 'will-change-transform' : ''}`}
            style={{
              backdropFilter: 'blur(20px)',
              background: isExpanded
                ? 'rgba(255, 255, 255, 0.98)'
                : 'rgba(255, 255, 255, 0.95)',
              ...(isExpanded 
                ? {} 
                : {
                    left: position.x === 0 ? '50%' : position.x,
                    bottom: position.y === 0 ? '24px' : 'auto',
                    top: position.y !== 0 ? position.y : 'auto',
                    transform: position.x === 0 ? 'translateX(-50%)' : 'none'
                  }
              )
            }}
          >
            {/* Header */}
            <div 
              ref={headerRef}
              className={`flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl
                          bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Code className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                    <span className="lg:inline hidden">Quick Code Editor</span>
                    <span className="lg:hidden">Editor</span>
                  </h3>
                </div>
                {!isExpanded && (
                  <div title="Click and drag anywhere on popup to move - Drag to edge to pop-out" className="flex items-center gap-1">
                    <Move 
                      className={`h-3 w-3 transition-colors ${isNearEdge ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} 
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                      Drag anywhere
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* Reset Button */}
                <button
                  onClick={resetCode}
                  onTouchStart={handleTouch}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md 
                           transition-all duration-200 active:scale-95 touch-manipulation"
                  title="Reset Code"
                >
                  <RotateCcw className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Pop-out Button */}
                <button
                  onClick={handlePopout}
                  onTouchStart={handleTouch}
                  className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md 
                           transition-all duration-200 active:scale-95 touch-manipulation"
                  title={isPopout ? "Close Pop-out" : "Open in New Window"}
                >
                  <ExternalLink className="h-3 w-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                </button>

                {/* Expand/Minimize Button */}
                <button
                  onClick={toggleExpanded}
                  onTouchStart={handleTouch}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md 
                           transition-all duration-200 active:scale-95 touch-manipulation"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize2 className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={toggleOpen}
                  onTouchStart={handleTouch}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md 
                           transition-all duration-200 active:scale-95 touch-manipulation"
                  title="Close"
                >
                  <X className="h-3 w-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                </button>
              </div>
            </div>

            {/* Near Edge Notification */}
            {isNearEdge && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg">
                Drag to edge to open in new window
              </div>
            )}

            {/* Code Editor */}
            <div className={`${isExpanded ? 'h-[calc(100%-3rem)]' : 'h-[calc(100%-2.5rem)]'} flex flex-col overflow-hidden`}>
              <JSCodeEditor
                onChange={setCode}
                className="h-full rounded-none rounded-b-2xl overflow-hidden"
                theme={isExpanded ? 'vs-dark' : 'light'}
                isFloating={true}
              />
            </div>

          </div>
        </>
      )}
    </>
  );
};

export default FloatingCodeEditor;