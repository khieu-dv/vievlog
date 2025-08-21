"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
// No Monaco types import needed - use any for editor ref
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { SmartCodeRunner } from "./SmartCodeRunner";

interface JSCodeEditorProps {
    initialCode?: string;
    className?: string;
    onChange?: (code: string) => void;
    onLanguageChange?: (languageId: number) => void;
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
        name: "JavaScript",
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
        defaultCode: `// Type or paste your code here...\nfn main() {\n    println!(\"Hello, Rust!\");\n}`
    }
];

export default function JSCodeEditor({ initialCode, className, onChange, onLanguageChange, theme = 'light', isFloating = false }: JSCodeEditorProps) {
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

    // Helper function to get cache key for code storage
    const getCacheKey = useCallback((languageId: number) => {
        return isFloating ? `quickCodeEditor_code_${languageId}` : `codeEditor_code_${languageId}`;
    }, [isFloating]);

    // Helper function to load cached code for a language
    const loadCachedCode = useCallback((languageId: number): string => {
        if (typeof window === 'undefined') return "";
        
        const cacheKey = getCacheKey(languageId);
        const cachedCode = localStorage.getItem(cacheKey);
        
        if (cachedCode && cachedCode.trim()) {
            return cachedCode;
        }
        
        // Return default code if no cache found
        const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
        return language ? language.defaultCode : "";
    }, [getCacheKey]);

    // Helper function to save code to cache
    const saveCachedCode = useCallback((languageId: number, codeToSave: string) => {
        if (typeof window === 'undefined') return;
        
        const cacheKey = getCacheKey(languageId);
        const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
        
        // Only save if code is different from default code
        if (language && codeToSave.trim() && codeToSave !== language.defaultCode) {
            localStorage.setItem(cacheKey, codeToSave);
        } else {
            // Remove cache if code is empty or same as default
            localStorage.removeItem(cacheKey);
        }
    }, [getCacheKey]);

    const [code, setCode] = useState(() => {
        if (initialCode) return initialCode;
        // Start with empty string to avoid SSR/Client mismatch
        return "";
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

        // Fix suggestion widget positioning for floating mode
        if (isFloating) {
            // Add CSS to fix suggestion widget positioning when zoomed
            const style = document.createElement('style');
            style.textContent = `
                .floating-editor-enter .monaco-editor .suggest-widget {
                    position: absolute !important;
                    z-index: 999999 !important;
                    transform: translateZ(0) !important;
                    will-change: transform !important;
                }
                .floating-editor-enter .monaco-editor .parameter-hints-widget {
                    position: absolute !important;
                    z-index: 999999 !important;
                    transform: translateZ(0) !important;
                    will-change: transform !important;
                }
                .floating-editor-enter .monaco-editor .editor-hover {
                    position: absolute !important;
                    z-index: 999999 !important;
                    transform: translateZ(0) !important;
                    will-change: transform !important;
                }
                .floating-editor-enter .monaco-editor .context-menu {
                    position: absolute !important;
                    z-index: 999999 !important;
                    transform: translateZ(0) !important;
                }
                .floating-editor-enter .monaco-editor .overflow-guard {
                    position: relative !important;
                }
                .floating-editor-enter .monaco-editor .monaco-scrollable-element {
                    position: relative !important;
                }
            `;
            document.head.appendChild(style);

            // Store reference to clean up later
            (editor as any)._floatingStyleElement = style;

            // Force layout recalculation for better positioning
            const handleLayoutUpdate = () => {
                requestAnimationFrame(() => {
                    editor.layout();
                    // Trigger position recalculation for widgets
                    const suggestWidget = (editor as any)._contributions?.['editor.contrib.suggestController'];
                    if (suggestWidget && suggestWidget.widget) {
                        suggestWidget.widget._onDidSuggestionsChange?.fire();
                    }
                });
            };

            // Listen for various events that might affect positioning
            window.addEventListener('resize', handleLayoutUpdate);
            window.addEventListener('scroll', handleLayoutUpdate, true);
            
            // Store handler for cleanup
            (editor as any)._layoutHandler = handleLayoutUpdate;
        }
    };

    const handleLanguageChange = useCallback((languageId: number) => {
        const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
        if (language) {
            // Save current code before switching
            saveCachedCode(selectedLanguage.id, code);
            
            const currentCode = code.trim();
            const cachedCode = loadCachedCode(languageId);
            
            setSelectedLanguage(language);
            
            let newCode: string;
            
            // If there's cached code for the new language, use it
            if (cachedCode && cachedCode !== language.defaultCode) {
                newCode = cachedCode;
            }
            // If no current code, use default
            else if (!currentCode) {
                newCode = language.defaultCode;
            }
            // If there's current code, ask user what to do
            else {
                const shouldLoadDefault = confirm(`Switch to ${language.name}?\n\nClick OK to load default ${language.name} code.\nClick Cancel to keep current code.`);
                if (shouldLoadDefault) {
                    newCode = language.defaultCode;
                } else {
                    newCode = currentCode;
                    // Save the current code for this new language
                    saveCachedCode(languageId, currentCode);
                }
            }
            
            setCode(newCode);
            onChange?.(newCode);

            // Save selected language to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedLanguageId', languageId.toString());
            }
            
            // Notify parent component of language change
            onLanguageChange?.(languageId);
        }
    }, [onChange, onLanguageChange, selectedLanguage.id, code, saveCachedCode, loadCachedCode]);

    const runCodeWithInput = useCallback(async (input: string) => {
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
            console.log("Sending to API:", {
                code: code.trim().substring(0, 100) + "...",
                language_id: selectedLanguage.id,
                stdin: input || "(empty)",
                stdin_length: input.length,
                stdin_repr: JSON.stringify(input)
            });
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const res = await fetch("/api/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: code.trim(),
                    language_id: selectedLanguage.id,
                    stdin: input
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

                // If there was input provided, show it in the output for better UX
                let finalOutput = formattedResult || "Code executed successfully (no output)";
                if (input && input.trim()) {
                    const inputLines = input.trim().split('\n');
                    const inputDisplay = inputLines.map(line => `> ${line}`).join('\n');
                    finalOutput = `Input provided:\n${inputDisplay}\n\nOutput:\n${finalOutput}`;
                }

                setOutput(finalOutput);
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
    }, [code, validateCode, selectedLanguage.id]);

    // Map Monaco language to input analyzer language
    const getAnalyzerLanguage = useCallback((monacoLanguage: string): string => {
        const languageMap: Record<string, string> = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'kotlin': 'kotlin',
            'csharp': 'csharp',
            'go': 'go',
            'rust': 'rust'
        };
        return languageMap[monacoLanguage] || monacoLanguage;
    }, []);

    const formatCodeManual = async () => {
        if (!editorRef.current) return;

        try {
            // Use Monaco's built-in formatting action
            await editorRef.current.getAction("editor.action.formatDocument")?.run();
        } catch (error) {
            console.error("Format failed:", error);
        }
    };

    // Load cached code on mount and when language changes
    useEffect(() => {
        // Skip if we have initialCode provided
        if (initialCode) {
            return;
        }

        // Load cached code for current language
        const cachedCode = loadCachedCode(selectedLanguage.id);
        if (cachedCode && cachedCode !== code) {
            setCode(cachedCode);
            onChange?.(cachedCode);
        }
    }, [selectedLanguage.id, loadCachedCode, initialCode]); // Removed code to avoid loops

    // Update code when initialCode changes
    useEffect(() => {
        if (initialCode !== undefined && initialCode !== code && code !== "") {
            setCode(initialCode);
            onChange?.(initialCode);
        }
    }, [initialCode, onChange, code]);

    // Cleanup effect for floating mode
    useEffect(() => {
        return () => {
            // Cleanup when component unmounts or isFloating changes
            if (editorRef.current) {
                const editor = editorRef.current;
                
                // Remove floating styles
                if ((editor as any)._floatingStyleElement) {
                    document.head.removeChild((editor as any)._floatingStyleElement);
                    (editor as any)._floatingStyleElement = null;
                }
                
                // Remove layout handler
                if ((editor as any)._layoutHandler) {
                    window.removeEventListener('resize', (editor as any)._layoutHandler);
                    window.removeEventListener('scroll', (editor as any)._layoutHandler, true);
                    (editor as any)._layoutHandler = null;
                }
            }
        };
    }, [isFloating]);



    return (
        <div className={`${isFloating ? 'p-2' : 'p-4 md:p-6'} flex flex-col ${className?.includes('h-') ? '' : 'h-screen'} ${className || ''}`}>
            <div className={`flex-grow flex ${isFloating ? 'flex-col' : 'flex-col lg:flex-row'} ${isFloating ? 'space-y-1' : 'lg:space-x-4 space-y-4 lg:space-y-0'} min-h-0`}>
                {/* Editor Column */}
                <div className={`w-full ${isFloating ? 'min-h-0' : 'lg:w-3/5'} flex flex-col ${isFloating ? 'flex-[3]' : 'h-[40vh] lg:h-full'}`}>
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
                            <SmartCodeRunner
                                code={code}
                                language={getAnalyzerLanguage(selectedLanguage.monacoLanguage)}
                                onRun={runCodeWithInput}
                                isRunning={isRunning}
                                className={`${isFloating ? 'px-2 py-1 text-xs' : 'px-2 py-1 text-xs'} bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400`}
                                buttonText={isRunning ? 'Running...' : 'Run'}
                            />
                            <button
                                onClick={formatCodeManual}
                                className={`${isFloating ? 'px-2 py-1 text-xs' : 'px-2 py-1 text-xs'} bg-gray-600 text-white rounded hover:bg-gray-700`}
                            >
                                Format
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow rounded-md overflow-hidden min-h-0">
                        <Editor
                            height="100%"
                            language={selectedLanguage.monacoLanguage}
                            value={code}
                            onChange={(value) => {
                                const newCode = value || "";
                                setCode(newCode);
                                onChange?.(newCode);
                                
                                // Auto-save code to cache when user edits
                                saveCachedCode(selectedLanguage.id, newCode);
                            }}
                            onMount={handleEditorDidMount}
                            theme={theme === 'vs-dark' ? 'vs-dark' : 'vs-light'}
                            options={{
                                minimap: { enabled: false },
                                fontSize: isFloating ? 12 : 14,
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fixedOverflowWidgets: false,
                                scrollbar: {
                                    vertical: 'visible',
                                    horizontal: 'visible',
                                    verticalScrollbarSize: isFloating ? 8 : 10,
                                    horizontalScrollbarSize: isFloating ? 8 : 10,
                                },
                                suggest: {
                                    showIcons: true,
                                    showSnippets: true,
                                    showWords: true,
                                    showMethods: true,
                                    showFunctions: true,
                                    showConstructors: true,
                                    showClasses: true,
                                    showEvents: true,
                                    showFields: true,
                                    showValues: true,
                                    showProperties: true,
                                    showEnums: true,
                                    showEnumMembers: true,
                                    showKeywords: true,
                                    showModules: true,
                                    showOperators: true,
                                    showUsers: true,
                                    showFiles: true,
                                    showReferences: true,
                                    showFolders: true,
                                    showColors: true,
                                    showTypeParameters: true,
                                    showConstants: true,
                                    showVariables: true,
                                    showInterfaces: true,
                                    showUnits: true,
                                    showStructs: true,
                                    ...(isFloating && {
                                        insertMode: 'replace' as const,
                                        filterGraceful: true,
                                        snippetsPreventQuickSuggestions: false,
                                    }),
                                },
                                quickSuggestions: {
                                    other: true,
                                    comments: false,
                                    strings: false,
                                },
                                parameterHints: {
                                    enabled: true,
                                    cycle: false,
                                },
                                hover: {
                                    enabled: true,
                                    delay: 300,
                                },
                                ...(isFloating && {
                                    overviewRulerBorder: false,
                                    overviewRulerLanes: 0,
                                    hideCursorInOverviewRuler: true,
                                    contextmenu: true,
                                }),
                            }}
                        />
                    </div>
                </div>

                {/* Output Column */}
                <div className={`w-full ${isFloating ? 'min-h-0' : 'lg:w-2/5'} flex flex-col ${isFloating ? 'flex-[2]' : 'lg:h-full'}`}>
                    <div className={`flex-shrink-0 ${isFloating ? 'mb-1' : 'mb-2'} flex items-center ${isFloating ? 'h-6' : 'h-10'}`}>
                        <h2 className={`font-semibold text-gray-700 ${isFloating ? 'text-sm' : 'text-lg'}`}>Output</h2>
                        <div className={`ml-auto text-xs text-gray-500 ${isFloating ? 'hidden' : ''}`}>
                            Smart input detection enabled
                        </div>
                    </div>

                    <pre
                        className={`flex-grow p-2 rounded bg-gray-100 overflow-auto whitespace-pre-wrap min-h-0 ${isFloating ? 'text-xs' : ''}`}
                        dangerouslySetInnerHTML={{
                            __html: Prism.highlight(output, Prism.languages.javascript, "javascript"),
                        }}
                    ></pre>
                </div>
            </div>

        </div>
    );
}