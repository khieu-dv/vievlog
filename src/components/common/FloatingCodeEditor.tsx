"use client";

import React, { useState, useCallback } from 'react';
import { Code, X, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import JSCodeEditor from './JSCodeEditor';

const FloatingCodeEditor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
            className={`fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
                       transition-all duration-500 ease-in-out transform floating-editor-enter
                       ${isExpanded
                ? 'inset-4 lg:inset-8'
                : 'bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] sm:left-auto sm:right-6 sm:translate-x-0 sm:w-96 h-[520px] sm:h-[600px] lg:w-[600px] lg:h-[500px] xl:w-[720px] xl:h-[600px]'
              }
                       ${isExpanded ? 'scale-100' : 'scale-100 hover:shadow-3xl'}
                       max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]`}
            style={{
              backdropFilter: 'blur(20px)',
              background: isExpanded
                ? 'rgba(255, 255, 255, 0.98)'
                : 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl
                          bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
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