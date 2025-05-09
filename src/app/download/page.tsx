'use client';

import React from 'react';

const DownloadPage = () => {
  const handleDownload = () => {
    // Tạo thẻ <a> và thực hiện tải xuống
    const a = document.createElement('a');
    a.href = '/api/download'; // Đường dẫn đến API server để tải file
    a.download = ''; // Để trống để sử dụng tên file từ API server
    a.click(); // Kích hoạt download
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Download WatchCon</h1>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Download with Random Filename
      </button>
    </main>
  );
};

export default DownloadPage;
