"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
// No Monaco types import needed - use any for editor ref
import Prism from "prismjs";
import "prismjs/themes/prism.css";

interface JSCodeEditorProps {
    initialCode?: string;
    className?: string;
    onChange?: (code: string) => void;
    theme?: 'light' | 'vs-dark';
    isFloating?: boolean;
}

interface ApiResponse {
    logs?: string[];
    result?: string;
    error?: string;
}

export default function JSCodeEditor({ initialCode, className, onChange, theme = 'light', isFloating = false }: JSCodeEditorProps) {
    const [code, setCode] = useState(
        initialCode || `// Type or paste your code here...\nconsole.log("Hello, Monaco!");\n\nfunction add(a, b) {\n  return a + b;\n}`
    );
    const [output, setOutput] = useState("Output will appear here...");
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef<any>(null);

    // Validate JavaScript code
    const validateCode = useCallback((code: string): string | null => {
        if (!code.trim()) return "Code cannot be empty";
        if (code.length > 20000) return "Code is too long (max 20,000 characters)";

        // Basic syntax validation (removed to avoid conflicts with server-side validation)
        // Server-side will handle validation
        return null;
    }, []);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Monaco has built-in formatting - just enable it
        editor.updateOptions({
            formatOnType: true,
            formatOnPaste: true,
            autoIndent: 'full',
            tabSize: 2,
            insertSpaces: true,
        });
    };

    const runCode = useCallback(async () => {
        // Validate code before running
        const validationError = validateCode(code);
        if (validationError) {
            setOutput(`Validation Error: ${validationError}`);
            return;
        }

        setIsRunning(true);
        setOutput("Resolving imports and running code...");

        try {
            // Step 1: Resolve imports first
            let codeToRun = code.trim();
            if (codeToRun.includes("import")) {
                const resolveRes = await fetch("/api/resolve-imports", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: codeToRun }),
                });

                if (!resolveRes.ok) {
                    throw new Error(`Failed to resolve imports: ${resolveRes.statusText}`);
                }

                const resolveData = await resolveRes.json();
                codeToRun = resolveData.processedCode;
                // Update the editor to show the processed code
                // setCode(codeToRun); // DISABLED FOR BETTER UX
            }

            // Step 2: Run the processed code
            setOutput("Running code...");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const runRes = await fetch("/api/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: codeToRun }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!runRes.ok) {
                throw new Error(`HTTP ${runRes.status}: ${runRes.statusText}`);
            }

            const data: ApiResponse = await runRes.json();

            if (data.error) {
                setOutput(`Runtime Error: ${data.error}`);
            } else {
                const logsOutput = data.logs && data.logs.length > 0 ? data.logs.join("\n") : "";
                const resultOutput = data.result && data.result !== "undefined" ? data.result : "";

                // Format result if it's JSON
                const formattedResult = [logsOutput, resultOutput]
                    .filter(Boolean)
                    .map((item) => {
                        try {
                            const parsed = JSON.parse(item);
                            return JSON.stringify(parsed, null, 2);
                        } catch {
                            return item;
                        }
                    })
                    .join("\n");

                setOutput(formattedResult || "Code executed successfully (no output)");
            }
        } catch (err) {
            if ((err as Error).name === 'AbortError') {
                setOutput("Error: Code execution timed out (10 seconds)");
            } else {
                setOutput(`Error: ${(err as Error).message}`);
            }
        } finally {
            setIsRunning(false);
        }
    }, [code, validateCode]);

    const formatCodeManual = async () => {
        if (!editorRef.current) return;

        try {
            // Use Monaco's built-in formatting action
            await editorRef.current.getAction("editor.action.formatDocument")?.run();
        } catch (error) {
            console.error("Format failed:", error);
        }
    };

    


    // Update code when initialCode changes
    useEffect(() => {
        if (initialCode !== undefined && initialCode !== code) {
            setCode(initialCode);
            onChange?.(initialCode);
        }
    }, [initialCode]); // Removed onChange from dependency array to avoid loops

    return (
        <div className={`${isFloating ? 'p-2' : 'p-4 md:p-6'} flex flex-col ${className?.includes('h-') ? '' : 'h-screen'} ${className || ''}`}>
            <div className={`flex-grow flex ${isFloating ? 'flex-col' : 'flex-col lg:flex-row'} ${isFloating ? 'space-y-1' : 'lg:space-x-4 space-y-4 lg:space-y-0'}`}>
                {/* Editor Column */}
                <div className={`w-full ${isFloating ? 'flex-1 min-h-0' : 'lg:w-3/5'} flex flex-col ${isFloating ? 'h-[60%] max-h-[60%]' : 'h-[40vh] lg:h-full'}`}>
                    <div className={`flex-shrink-0 ${isFloating ? 'mb-1' : 'mb-2'} flex items-center justify-between ${isFloating ? 'h-6' : 'h-10'}`}>
                        <div>
                            <h2 className={`font-semibold text-gray-700 ${isFloating ? 'text-sm' : 'text-lg'}`}>
                                {isFloating ? 'Code' : 'Code Editor'}
                            </h2>
                            {!isFloating && (
                                <p className="text-xs text-gray-500 mt-0.5">Ctrl+Enter to run • Ctrl+S to format</p>
                            )}
                        </div>
                        <div className={`flex items-center ${isFloating ? 'space-x-1' : 'space-x-2'}`}>
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className={`${isFloating ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} text-white rounded font-medium transition-all duration-200 ${isRunning ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                    } disabled:opacity-50`}
                            >
                                {isRunning ? (
                                    <span className="flex items-center gap-1">
                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Running
                                    </span>
                                ) : (
                                    'Run'
                                )}
                            </button>
                            <button
                                onClick={formatCodeManual}
                                className={`${isFloating ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} bg-gray-600 text-white rounded hover:bg-gray-700`}
                            >
                                Format
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow rounded-md overflow-hidden">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            value={code}
                            onChange={(value) => {
                                const newCode = value || "";
                                setCode(newCode);
                                onChange?.(newCode);
                            }}
                            onMount={handleEditorDidMount}
                            theme={theme === 'vs-dark' ? 'vs-dark' : 'vs-light'}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fixedOverflowWidgets: true,
                            }}
                        />
                    </div>
                </div>

                {/* Output Column */}
                <div className={`w-full ${isFloating ? 'flex-1 min-h-0' : 'lg:w-2/5'} flex flex-col ${isFloating ? 'h-[40%] max-h-[40%]' : 'lg:h-full'}`}>
                    <div className={`flex-shrink-0 ${isFloating ? 'mb-1' : 'mb-2'} flex items-center ${isFloating ? 'h-6' : 'h-10'}`}>
                        <h2 className={`font-semibold text-gray-700 ${isFloating ? 'text-sm' : 'text-lg'}`}>Output</h2>
                    </div>
                    <pre
                        className={`flex-grow p-2 rounded bg-gray-100 overflow-auto whitespace-pre-wrap ${isFloating ? 'text-xs' : ''}`}
                        dangerouslySetInnerHTML={{
                            __html: Prism.highlight(output, Prism.languages.javascript, "javascript"),
                        }}
                    ></pre>
                </div>
            </div>

        </div>
    );
}
