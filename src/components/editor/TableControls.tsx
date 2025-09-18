'use client';

import { useCallback } from 'react';

interface TableControlsProps {
  editor: any;
  onClose: () => void;
}

export default function TableControls({ editor, onClose }: TableControlsProps) {
  const addRowBefore = useCallback(() => {
    editor?.chain().focus().addRowBefore().run();
  }, [editor]);

  const addRowAfter = useCallback(() => {
    editor?.chain().focus().addRowAfter().run();
  }, [editor]);

  const deleteRow = useCallback(() => {
    editor?.chain().focus().deleteRow().run();
  }, [editor]);

  const addColumnBefore = useCallback(() => {
    editor?.chain().focus().addColumnBefore().run();
  }, [editor]);

  const addColumnAfter = useCallback(() => {
    editor?.chain().focus().addColumnAfter().run();
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor?.chain().focus().deleteColumn().run();
  }, [editor]);

  const deleteTable = useCallback(() => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bảng?')) {
      editor?.chain().focus().deleteTable().run();
      onClose();
    }
  }, [editor, onClose]);

  const mergeCells = useCallback(() => {
    editor?.chain().focus().mergeCells().run();
  }, [editor]);

  const splitCell = useCallback(() => {
    editor?.chain().focus().splitCell().run();
  }, [editor]);

  const toggleHeaderRow = useCallback(() => {
    editor?.chain().focus().toggleHeaderRow().run();
  }, [editor]);

  const toggleHeaderColumn = useCallback(() => {
    editor?.chain().focus().toggleHeaderColumn().run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px]">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Chỉnh sửa bảng</h4>
      </div>

      {/* Row Controls */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600 mb-2">🔄 Hàng (Rows)</div>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={addRowBefore}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
            title="Thêm hàng phía trên"
          >
            ⬆️ Thêm trên
          </button>
          <button
            type="button"
            onClick={addRowAfter}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
            title="Thêm hàng phía dưới"
          >
            ⬇️ Thêm dưới
          </button>
          <button
            type="button"
            onClick={deleteRow}
            className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100"
            title="Xóa hàng hiện tại"
          >
            🗑️ Xóa
          </button>
        </div>
      </div>

      {/* Column Controls */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600 mb-2">📏 Cột (Columns)</div>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={addColumnBefore}
            className="px-2 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
            title="Thêm cột bên trái"
          >
            ⬅️ Thêm trái
          </button>
          <button
            type="button"
            onClick={addColumnAfter}
            className="px-2 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
            title="Thêm cột bên phải"
          >
            ➡️ Thêm phải
          </button>
          <button
            type="button"
            onClick={deleteColumn}
            className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100"
            title="Xóa cột hiện tại"
          >
            🗑️ Xóa
          </button>
        </div>
      </div>

      {/* Cell Controls */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600 mb-2">🔗 Ô (Cells)</div>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={mergeCells}
            className="px-2 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100"
            title="Gộp các ô đã chọn"
          >
            🔗 Gộp ô
          </button>
          <button
            type="button"
            onClick={splitCell}
            className="px-2 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100"
            title="Tách ô"
          >
            ✂️ Tách ô
          </button>
        </div>
      </div>

      {/* Header Controls */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-600 mb-2">👑 Header</div>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={toggleHeaderRow}
            className={`px-2 py-1 text-xs border rounded ${
              editor.isActive('table') && editor.getAttributes('table')?.hasHeaderRow
                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            title="Bật/tắt header row"
          >
            📋 Header Row
          </button>
          <button
            type="button"
            onClick={toggleHeaderColumn}
            className={`px-2 py-1 text-xs border rounded ${
              editor.isActive('table') && editor.getAttributes('table')?.hasHeaderColumn
                ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            title="Bật/tắt header column"
          >
            📊 Header Col
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={deleteTable}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            🗑️ Xóa bảng
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
          >
            ✕ Đóng
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
        💡 <strong>Mẹo:</strong> Click vào ô bảng trước khi sử dụng các chức năng này
      </div>
    </div>
  );
}