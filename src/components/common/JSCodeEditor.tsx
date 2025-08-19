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
        <div className="p-6 max-w-4xl mx-auto">
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.375rem', overflow: 'hidden' }}>
                <Editor
                    height="40vh"
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
            <div className="mt-2 space-x-2">
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
            <pre className="mt-4 p-2 border rounded bg-gray-100 min-h-[4rem] whitespace-pre-wrap">{output}</pre>
        </div>
    );
}
