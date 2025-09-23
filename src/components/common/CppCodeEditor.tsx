"use client";

import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CppCodeEditorProps {
  code: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

export function CppCodeEditor({
  code,
  height = "300px",
  readOnly = true,
  className = ""
}: CppCodeEditorProps) {
  const { theme } = useTheme();

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <Editor
        height={height}
        defaultLanguage="cpp"
        value={code}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          folding: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "none",
          occurrencesHighlight: "off",
          selectionHighlight: false,
          contextmenu: false,
        }}
      />
    </div>
  );
}