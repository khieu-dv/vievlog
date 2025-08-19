"use client";
import { useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import prettier from "prettier/standalone";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";

export default function JSCodeEditor() {
    const [code, setCode] = useState(
        `// Type or paste your code here...\nconsole.log(\"Hello, Monaco!\");\n\nfunction add(a, b) {\nreturn a + b;\n}`
    );
    const [output, setOutput] = useState("Output will appear here...");
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Register a formatting provider for JavaScript
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
                    // Return null to indicate failure, so the editor doesn't change
                    return null;
                }
            },
        };

        monaco.languages.registerDocumentFormattingEditProvider(
            "javascript",
            formattingProvider
        );

        // Enable format on type and format on paste
        editor.updateOptions({
            formatOnType: true,
            formatOnPaste: true,
        });
    };

    const runCode = async () => {
        try {
            const res = await fetch("/api/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (data.error) {
                setOutput("Error: " + data.error);
            } else {
                const logsOutput = data.logs.length > 0 ? data.logs.join("\n") : "";
                const resultOutput = data.result !== "undefined" ? data.result : "";
                setOutput([logsOutput, resultOutput].filter(Boolean).join("\n"));
            }
        } catch (err: any) {
            setOutput("Error: " + err.message);
        }
    };

    const formatCodeManual = () => {
        // @ts-ignore
        editorRef.current?.getAction('editor.action.formatDocument').run();
    }

    return (
        <div className="p-4 md:p-6 h-screen flex flex-col">
            <div className="flex-grow flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
                {/* Editor Column */}
                <div className="w-full lg:w-1/2 flex flex-col h-[50vh] lg:h-full">
                    <div className="flex-shrink-0 mb-2 flex items-center" style={{ height: '40px' }}>
                        <h2 className="text-lg font-semibold text-gray-700">Code Editor</h2>
                    </div>
                    <div className="flex-grow border rounded-md overflow-hidden">
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
                    <div className="flex-shrink-0 mb-2 flex items-center space-x-2" style={{ height: '40px' }}>
                        <button
                            onClick={runCode}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Run
                        </button>
                        <button
                            onClick={formatCodeManual}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Format Code
                        </button>
                    </div>
                    <pre className="flex-grow p-2 border rounded bg-gray-100 whitespace-pre-wrap overflow-auto">{output}</pre>
                </div>
            </div>
        </div>
    );
}
