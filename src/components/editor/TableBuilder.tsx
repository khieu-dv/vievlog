'use client';

import { useState, useCallback } from 'react';

interface TableBuilderProps {
  onInsertTable: (rows: number, cols: number) => void;
  onClose: () => void;
}

export default function TableBuilder({ onInsertTable, onClose }: TableBuilderProps) {
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const [selectedSize, setSelectedSize] = useState({ rows: 1, cols: 1 });

  const maxRows = 8;
  const maxCols = 8;

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredCell({ row, col });
    setSelectedSize({ rows: row + 1, cols: col + 1 });
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    onInsertTable(row + 1, col + 1);
    onClose();
  }, [onInsertTable, onClose]);

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isSelected = row <= hoveredCell.row && col <= hoveredCell.col;
        cells.push(
          <button
            key={`${row}-${col}`}
            type="button"
            className={`w-4 h-4 border border-gray-300 transition-colors ${
              isSelected
                ? 'bg-blue-500 border-blue-600'
                : 'bg-white hover:bg-blue-100'
            }`}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Chọn kích thước bảng</h4>
        <div
          className="grid gap-1 w-fit"
          style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}
          onMouseLeave={() => {
            setHoveredCell({ row: 0, col: 0 });
            setSelectedSize({ rows: 1, cols: 1 });
          }}
        >
          {renderGrid()}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 mb-3">
        {selectedSize.rows} × {selectedSize.cols} bảng
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              onInsertTable(selectedSize.rows, selectedSize.cols);
              onClose();
            }}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            ✓ Chèn bảng
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
          >
            ✕ Hủy
          </button>
        </div>
      </div>

      {/* Custom Size Input */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="text-sm text-gray-600 mb-2">Hoặc nhập kích thước tùy chỉnh:</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="20"
            value={selectedSize.rows}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Hàng"
            onChange={(e) => setSelectedSize(prev => ({ ...prev, rows: Math.max(1, parseInt(e.target.value) || 1) }))}
          />
          <span className="text-gray-500">×</span>
          <input
            type="number"
            min="1"
            max="20"
            value={selectedSize.cols}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Cột"
            onChange={(e) => setSelectedSize(prev => ({ ...prev, cols: Math.max(1, parseInt(e.target.value) || 1) }))}
          />
          <button
            type="button"
            onClick={() => {
              onInsertTable(selectedSize.rows, selectedSize.cols);
              onClose();
            }}
            className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}