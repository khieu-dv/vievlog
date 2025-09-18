// ~/components/editor/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { createLowlight } from 'lowlight';
import { useCallback, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import TableBuilder from './TableBuilder';
import TableControls from './TableControls';

const MermaidLiveEditor = dynamic(() => import('~/components/MermaidLiveEditor'), {
  ssr: false
});

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({
  editor,
  onOpenMermaidEditor
}: {
  editor: any;
  onOpenMermaidEditor: () => void;
}) => {
  const [showTableBuilder, setShowTableBuilder] = useState(false);
  const [showTableControls, setShowTableControls] = useState(false);
  const tableBuilderRef = useRef<HTMLDivElement>(null);
  const tableControlsRef = useRef<HTMLDivElement>(null);

  const addImage = useCallback(() => {
    const url = window.prompt('URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL liên kết:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertMermaidDiagram = useCallback(() => {
    const defaultMermaid = `\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B --> C[Option 1]
    B --> D[Option 2]
    C --> E[End]
    D --> E
\`\`\``;
    editor.chain().focus().insertContent(defaultMermaid).run();
  }, [editor]);


  const insertMDXComponent = useCallback(() => {
    const component = `<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
  <h4 className="font-semibold text-blue-800 mb-2">📝 Ghi chú</h4>
  <p className="text-blue-700">Nội dung ghi chú ở đây...</p>
</div>`;
    editor.chain().focus().insertContent(component).run();
  }, [editor]);

  const insertTable = useCallback((rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  }, [editor]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableBuilderRef.current && !tableBuilderRef.current.contains(event.target as Node)) {
        setShowTableBuilder(false);
      }
      if (tableControlsRef.current && !tableControlsRef.current.contains(event.target as Node)) {
        setShowTableControls(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2">
      {/* Text Formatting */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('strike') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <s>S</s>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('code') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Code
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Headings */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H3
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Lists */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          1. List
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Blocks */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Code Block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Quote
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Media & Links */}
      <div className="flex gap-1">
        <button
          onClick={setLink}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('link') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Link
        </button>
        <button
          onClick={addImage}
          className="px-3 py-1 text-sm border rounded bg-white text-gray-700 hover:bg-gray-100"
        >
          Image
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Table */}
      <div className="flex gap-1 relative" ref={tableBuilderRef}>
        <button
          onClick={() => {
            setShowTableBuilder(!showTableBuilder);
            setShowTableControls(false);
          }}
          className="px-3 py-1 text-sm border rounded bg-white text-gray-700 hover:bg-gray-100"
        >
          📊 Tạo bảng
        </button>

        {showTableBuilder && (
          <TableBuilder
            onInsertTable={insertTable}
            onClose={() => setShowTableBuilder(false)}
          />
        )}
      </div>

      {editor.isActive('table') && (
        <div className="relative" ref={tableControlsRef}>
          <button
            onClick={() => {
              setShowTableControls(!showTableControls);
              setShowTableBuilder(false);
            }}
            className="px-3 py-1 text-sm border rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            ⚙️ Chỉnh sửa bảng
          </button>

          {showTableControls && (
            <TableControls
              editor={editor}
              onClose={() => setShowTableControls(false)}
            />
          )}
        </div>
      )}

      <div className="w-px h-6 bg-gray-300"></div>

      {/* MDX Components */}
      <div className="flex gap-1">
        <div className="relative">
          <button
            onClick={insertMermaidDiagram}
            className="px-3 py-1 text-sm border rounded bg-purple-50 text-purple-700 hover:bg-purple-100"
          >
            📊 Quick Mermaid
          </button>
        </div>
        <button
          onClick={onOpenMermaidEditor}
          className="px-3 py-1 text-sm border rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          📊 Live Editor
        </button>
        <button
          onClick={insertMDXComponent}
          className="px-3 py-1 text-sm border rounded bg-green-50 text-green-700 hover:bg-green-100"
        >
          🧩 Component
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-3 py-1 text-sm border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-3 py-1 text-sm border rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Redo
        </button>
      </div>
    </div>
  );
};

// Mermaid Editor Modal Component
const MermaidEditorModal = ({ show, onSave, onCancel }: {
  show: boolean;
  onSave: (code: string) => void;
  onCancel: () => void;
}) => {
  if (!show) return null;

  return (
    <MermaidLiveEditor
      onSave={onSave}
      onCancel={onCancel}
    />
  );
};

export default function TipTapEditor({ content, onChange, placeholder = 'Bắt đầu viết...' }: TipTapEditorProps) {
  const lowlight = createLowlight();
  const [showMermaidEditor, setShowMermaidEditor] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    immediatelyRender: false,
  });

  const handleMermaidSave = useCallback((mermaidCode: string) => {
    const wrappedCode = `\`\`\`mermaid\n${mermaidCode}\n\`\`\``;
    editor?.chain().focus().insertContent(wrappedCode).run();
    setShowMermaidEditor(false);
  }, [editor]);

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MenuBar
          editor={editor}
          onOpenMermaidEditor={() => setShowMermaidEditor(true)}
        />
        <EditorContent
          editor={editor}
          placeholder={placeholder}
          className="min-h-[300px] max-h-[600px] overflow-y-auto"
        />
      </div>

      {/* Mermaid Visual Editor Modal */}
      <MermaidEditorModal
        show={showMermaidEditor}
        onSave={handleMermaidSave}
        onCancel={() => setShowMermaidEditor(false)}
      />
    </>
  );
}