"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import prettier from "prettier/standalone";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

interface JSCodeEditorProps {
    initialCode?: string;
    className?: string;
}

interface ApiResponse {
    logs?: string[];
    result?: string;
    error?: string;
}

export default function JSCodeEditor({ initialCode, className }: JSCodeEditorProps) {
    const [code, setCode] = useState(
        initialCode || `// Type or paste your code here...\nconsole.log("Hello, Monaco!");\n\nfunction add(a, b) {\n  return a + b;\n}`
    );
    const [output, setOutput] = useState("Output will appear here...");
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

    // Validate JavaScript code
    const validateCode = useCallback((code: string): string | null => {
        if (!code.trim()) return "Code cannot be empty";
        if (code.length > 10000) return "Code is too long (max 10,000 characters)";
        
        // Basic syntax validation (removed to avoid conflicts with server-side validation)
        // Server-side will handle validation
        return null;
    }, []);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        const formattingProvider = {
            async provideDocumentFormattingEdits(model: any) {
                const text = model.getValue();
                try {
                    const formattedText = await prettier.format(text, {
                        parser: "babel",
                        plugins: [babel, estree],
                        semi: true,
                        singleQuote: false,
                    });
                    return [
                        {
                            range: model.getFullModelRange(),
                            text: formattedText,
                        },
                    ];
                } catch (error) {
                    console.error("Prettier formatting failed:", error);
                    return null;
                }
            },
        };

        monaco.languages.registerDocumentFormattingEditProvider(
            "javascript",
            formattingProvider
        );

        editor.updateOptions({
            formatOnType: true,
            formatOnPaste: true,
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
        setOutput("Running code...");

        try {
            // Debug log
            console.log("Sending code to API:", code.trim());
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const res = await fetch("/api/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code.trim() }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data: ApiResponse = await res.json();

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
                setOutput(`Network Error: ${(err as Error).message}`);
            }
        } finally {
            setIsRunning(false);
        }
    }, [code, validateCode]);

    const formatCodeManual = () => {
        if (!editorRef.current) return;
        
        try {
            const action = editorRef.current.getAction("editor.action.formatDocument");
            if (action) {
                action.run();
            }
        } catch (error) {
            console.error("Format failed:", error);
        }
    };

    // Update code when initialCode changes
    useEffect(() => {
        if (initialCode !== undefined && initialCode !== code) {
            setCode(initialCode);
        }
    }, [initialCode]);

    return (
        <div className={`p-4 md:p-6 flex flex-col ${className?.includes('h-') ? '' : 'h-screen'} ${className || ''}`}>
            <div className="flex-grow flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
                {/* Editor Column */}
                <div className="w-full lg:w-1/2 flex flex-col h-[40vh] lg:h-full">
                    <div
                        className="flex-shrink-0 mb-2 flex items-center justify-between"
                        style={{ height: "40px" }}
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Code Editor</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Ctrl+Enter to run • Ctrl+S to format</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={runCode}
                                disabled={isRunning}
                                className={`px-3 py-1.5 text-white rounded text-sm font-medium transition-all duration-200 ${
                                    isRunning 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
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
                                className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
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
                            onChange={(value) => setCode(value || "")}
                            onMount={handleEditorDidMount}
                            theme="vs-light"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>
                </div>

                {/* Output Column */}
                <div className="w-full lg:w-1/2 flex flex-col lg:h-full">
                    <div
                        className="flex-shrink-0 mb-2 flex items-center"
                        style={{ height: "40px" }}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">Output</h2>
                    </div>
                    <pre
                        className="flex-grow p-2 rounded bg-gray-100 overflow-auto whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                            __html: Prism.highlight(output, Prism.languages.javascript, "javascript"),
                        }}
                    ></pre>
                </div>
            </div>
        </div>
    );
}
