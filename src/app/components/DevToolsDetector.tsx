// components/DevToolsDetector.tsx
'use client';

import { useEffect } from 'react';

export default function DevToolsDetector() {
  useEffect(() => {
    // Biến kiểm tra trạng thái DevTools
    let devToolsOpen = false;

    // Phát hiện bằng console.log debugging
    const consoleCheck = () => {
      const startTime = new Date().getTime();
      console.log('%c', 'padding: 10px; background: white; color: white;');
      console.clear();
      
      const endTime = new Date().getTime();
      if (endTime - startTime > 100) {
        handleDevToolsOpen();
      }
    };

    // Phát hiện bằng window size
    const sizeCheck = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        handleDevToolsOpen();
      }
    };

    // Xử lý khi phát hiện DevTools mở
    const handleDevToolsOpen = () => {
      if (!devToolsOpen) {
        devToolsOpen = true;
        console.log('DevTools detected');
        
        // Ngắt kết nối mạng (giả lập)
        if ('connection' in navigator && 'onchange' in (navigator.connection as any)) {
          // Vô hiệu hóa tất cả các yêu cầu mạng mới
          const originalFetch = window.fetch;
          window.fetch = function() {
            return new Promise((_, reject) => {
              reject(new Error('Network connection disabled'));
            });
          };
          
          // Vô hiệu hóa XMLHttpRequest
          const originalOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function() {
            throw new Error('Network connection disabled');
          };
          
          // Chuyển hướng người dùng (tùy chọn)
          window.location.href = '/network-disabled';
        }
      }
    };

    // Thiết lập các listener
    const interval = setInterval(consoleCheck, 1000);
    window.addEventListener('resize', sizeCheck);
    
    // Function dọn dẹp khi component unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', sizeCheck);
    };
  }, []);

  return null; // Component này không render gì
}