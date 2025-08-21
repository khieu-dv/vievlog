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

interface Language {
    id: number;
    name: string;
    monacoLanguage: string;
    defaultCode: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
    {
        id: 63,
        name: "JavaScript (Node.js)",
        monacoLanguage: "javascript",
        defaultCode: `// Type or paste your code here...\nconsole.log("Hello, JavaScript!");\n\nfunction add(a, b) {\n  return a + b;\n}`
    },
    {
        id: 71,
        name: "Python",
        monacoLanguage: "python",
        defaultCode: `# Type or paste your code here...\nprint("Hello, Python!")\n\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3))`
    },
    {
        id: 62,
        name: "Java",
        monacoLanguage: "java",
        defaultCode: `// Type or paste your code here...\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`
    },
    {
        id: 54,
        name: "C++",
        monacoLanguage: "cpp",
        defaultCode: `// Type or paste your code here...\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`
    },
    {
        id: 50,
        name: "C",
        monacoLanguage: "c",
        defaultCode: `// Type or paste your code here...\n#include <stdio.h>\n\nint main() {\n    printf("Hello, C!\\n");\n    return 0;\n}`
    },
    {
        id: 78,
        name: "Kotlin",
        monacoLanguage: "kotlin",
        defaultCode: `// Type or paste your code here...\nfun main() {\n    println("Hello, Kotlin!")\n}`
    },
    {
        id: 51,
        name: "C#",
        monacoLanguage: "csharp",
        defaultCode: `// Type or paste your code here...\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, C#!");\n    }\n}`
    },
    {
        id: 60,
        name: "Go",
        monacoLanguage: "go",
        defaultCode: `// Type or paste your code here...\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}`
    },
    {
        id: 73,
        name: "Rust",
        monacoLanguage: "rust",
        defaultCode: `// Type or paste your code here...\nfn main() {\n    println!("Hello, Rust!");\n}`
    }
];

export default function JSCodeEditor({ initialCode, className, onChange, theme = 'light', isFloating = false }: JSCodeEditorProps) {
    // Load saved language from localStorage or default to JavaScript
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const savedLanguageId = localStorage.getItem('selectedLanguageId');
            if (savedLanguageId) {
                const savedLang = SUPPORTED_LANGUAGES.find(lang => lang.id === parseInt(savedLanguageId));
                if (savedLang) return savedLang;
            }
        }
        return SUPPORTED_LANGUAGES[0];
    });
    
    const [code, setCode] = useState(() => {
        if (initialCode) return initialCode;
        if (typeof window !== 'undefined') {
            const savedCode = localStorage.getItem('editorCode');
            if (savedCode) return savedCode;
        }
        return selectedLanguage.defaultCode;
    });
    
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

    const handleLanguageChange = useCallback((languageId: number) => {
        const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
        if (language) {
            setSelectedLanguage(language);
            setCode(language.defaultCode);
            onChange?.(language.defaultCode);
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedLanguageId', languageId.toString());
                localStorage.setItem('editorCode', language.defaultCode);
            }
        }
    }, [onChange]);

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
                body: JSON.stringify({ 
                    code: code.trim(),
                    language_id: selectedLanguage.id
                }),
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
    }, [initialCode, onChange]);

    // Save language and code changes to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedLanguageId', selectedLanguage.id.toString());
        }
    }, [selectedLanguage]);

    return (
        <div className={`${isFloating ? 'p-2' : 'p-4 md:p-6'} flex flex-col ${className?.includes('h-') ? '' : 'h-screen'} ${className || ''}`}>
            <div className={`flex-grow flex ${isFloating ? 'flex-col' : 'flex-col lg:flex-row'} ${isFloating ? 'space-y-1' : 'lg:space-x-4 space-y-4 lg:space-y-0'}`}>
                {/* Editor Column */}
                <div className={`w-full ${isFloating ? 'flex-1 min-h-0' : 'lg:w-3/5'} flex flex-col ${isFloating ? 'h-[60%] max-h-[60%]' : 'h-[40vh] lg:h-full'}`}>
                    <div className={`flex-shrink-0 ${isFloating ? 'mb-1' : 'mb-2'} flex items-center justify-between ${isFloating ? 'h-6' : 'h-10'}`}>
                        <div className="flex-1">
                            <h2 className={`font-semibold text-gray-700 ${isFloating ? 'text-sm' : 'text-lg'}`}>
                                {isFloating ? 'Code' : 'Code Editor'}
                            </h2>
                            {!isFloating && (
                                <p className="text-xs text-gray-500 mt-0.5">Ctrl+Enter to run • Ctrl+S to format</p>
                            )}
                        </div>
                        <div className={`flex items-center ${isFloating ? 'space-x-1' : 'space-x-2'}`}>
                            <select
                                value={selectedLanguage.id}
                                onChange={(e) => handleLanguageChange(Number(e.target.value))}
                                className={`${isFloating ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-sm'} bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.id} value={lang.id}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
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
                            language={selectedLanguage.monacoLanguage}
                            value={code}
                            onChange={(value) => {
                                const newCode = value || "";
                                setCode(newCode);
                                onChange?.(newCode);
                                
                                // Save code to localStorage
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('editorCode', newCode);
                                }
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