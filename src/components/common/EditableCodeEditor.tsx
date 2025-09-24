"use client";

import { Editor } from '@monaco-editor/react';

interface EditableCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  height?: string;
  theme?: string;
  className?: string;
  readOnly?: boolean;
}

export function EditableCodeEditor({
  code,
  onChange,
  language,
  height = "400px",
  theme = "vs-dark",
  className = "",
  readOnly = false
}: EditableCodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      <Editor
        height={height}
        language={language}
        value={code}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
          fontSize: 14,
          lineHeight: 20,
          tabSize: 4,
          insertSpaces: true,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'line',
          bracketPairColorization: {
            enabled: true
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true
        }}
      />
    </div>
  );
}