"use client"; // Thêm dòng này ở đầu file

import { useCallback, useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
} from "@xyflow/react";
import { Maximize2, Minimize2, RotateCw } from "lucide-react"; // Import RotateCw

import "@xyflow/react/dist/style.css";

import { initialNodes, nodeTypes, useNodesData, type CustomNodeType } from "./nodes";
import { initialEdges, edgeTypes, useEdgesData, type CustomEdgeType } from "./edges";

interface PopupInfo {
  url: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

interface FlowDiagramProps {
  category?: number; // Make category an optional prop
}

export default function App({ category = 0 }: FlowDiagramProps) {
  const { theme } = useTheme();
  // Fetch nodes and edges data
  const { nodes: fetchedNodes, loading: nodesLoading } = useNodesData(category);
  const { edges: fetchedEdges, loading: edgesLoading } = useEdgesData(category);

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>(initialEdges);
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo>({
    url: "",
    position: { x: 0, y: 0 },
    size: { width: 800, height: 800 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 800, height: 600 });

  const popupRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isResizingRef = useRef(false);
  const resizeStartPosRef = useRef({ x: 0, y: 0 });
  const initialSizeRef = useRef({ width: 0, height: 0 });
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Update nodes when data is fetched
  useEffect(() => {
    if (!nodesLoading && fetchedNodes.length > 0) {
      setNodes(fetchedNodes);
    }
  }, [fetchedNodes, nodesLoading, setNodes]);

  // Update edges when data is fetched
  useEffect(() => {
    if (!edgesLoading && fetchedEdges.length > 0) {
      setEdges(fetchedEdges);
    }
  }, [fetchedEdges, edgesLoading, setEdges]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1024); // Điều chỉnh giá trị 1024 theo nhu cầu
    };

    handleResize(); // Gọi hàm khi component mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const popupWidth = Math.min(screenWidth - 20, 800);
    const popupHeight = Math.min(screenHeight - 80, 1000);

    const x = (screenWidth - popupWidth) / 2;
    const y = (screenHeight - popupHeight) / 2;

    const url = node.data?.url_pdf ? String(node.data.url_pdf) : "";

    if (!url) {
      setError("No PDF URL available for this node");
      return;
    }

    setPopupInfo({
      url,
      position: { x, y },
      size: { width: popupWidth, height: popupHeight }
    });

    setIsLoading(true);
    setShowPopup(true);
    setIsFullScreen(false);
    setPdfLoadError(null);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    setError(null);
    setIsFullScreen(false);
    setPdfLoadError(null);
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX, clientY;
    if (e.type === 'touchstart') {
      const touch = (e as React.TouchEvent<HTMLDivElement>).touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as React.MouseEvent<HTMLDivElement>).clientX;
      clientY = (e as React.MouseEvent<HTMLDivElement>).clientY;
    }

    if ((e.target as HTMLElement).closest(".popup-header") &&
      !(e.target as HTMLElement).closest(".popup-controls")) {
      isDraggingRef.current = true;

      if (popupRef.current) {
        const rect = popupRef.current.getBoundingClientRect();
        dragOffsetRef.current = {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      }
      e.preventDefault();
    }
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX, clientY;
    if (e.type === 'touchstart') {
      const touch = (e as React.TouchEvent<HTMLDivElement>).touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (e as React.MouseEvent<HTMLDivElement>).clientX;
      clientY = (e as React.MouseEvent<HTMLDivElement>).clientY;
    }

    isResizingRef.current = true;
    resizeStartPosRef.current = { x: clientX, y: clientY };

    if (popupRef.current) {
      initialSizeRef.current = {
        width: popupRef.current.offsetWidth,
        height: popupRef.current.offsetHeight
      };
    }
    e.preventDefault();
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      setPreviousSize({
        width: popupInfo.size.width,
        height: popupInfo.size.height
      });
      setPopupInfo(prev => ({
        ...prev,
        position: { x: 0, y: 0 },
        size: { width: window.innerWidth, height: window.innerHeight }
      }));
      setIsFullScreen(true);
    } else {
      setPopupInfo(prev => ({
        ...prev,
        position: { x: 50, y: 50 },
        size: previousSize
      }));
      setIsFullScreen(false);
    }
  }, [isFullScreen, popupInfo.size.width, popupInfo.size.height, previousSize]);

  const zoomIn = useCallback(() => {
    setPopupInfo(prev => ({
      ...prev,
      size: {
        width: prev.size.width * 1.2,
        height: prev.size.height * 1.2
      }
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setPopupInfo(prev => ({
      ...prev,
      size: {
        width: Math.max(400, prev.size.width * 0.8),
        height: Math.max(300, prev.size.height * 0.8)
      }
    }));
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (isDraggingRef.current && popupRef.current && !isFullScreen) {
        const newX = clientX - dragOffsetRef.current.x;
        const newY = clientY - dragOffsetRef.current.y;

        setPopupInfo(prev => ({
          ...prev,
          position: { x: newX, y: newY }
        }));
      }

      if (isResizingRef.current && !isFullScreen) {
        const deltaX = clientX - resizeStartPosRef.current.x;
        const deltaY = clientY - resizeStartPosRef.current.y;

        const newWidth = Math.max(400, initialSizeRef.current.width + deltaX);
        const newHeight = Math.max(600, initialSizeRef.current.height + deltaY);

        setPopupInfo(prev => ({
          ...prev,
          size: { width: newWidth, height: newHeight }
        }));
      }
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);

      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isFullScreen]);

  const handleIframeError = () => {
    setPdfLoadError('Failed to load PDF. Please try again.');
  };

  const reloadPdf = () => {
    if (iframeRef.current) {
      iframeRef.current.src = `https://docs.google.com/viewer?url=${encodeURIComponent(popupInfo.url)}&embedded=true`;
      setPdfLoadError(null);
    }
  };

  const updatePopupPositionAndSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const popupWidth = Math.min(screenWidth - 20, 800);
    const popupHeight = Math.min(screenHeight - 80, 1000);

    const x = (screenWidth - popupWidth) / 2;
    const y = (screenHeight - popupHeight) / 2;

    setPopupInfo(prev => ({
      ...prev,
      position: { x, y },
      size: { width: popupWidth, height: popupHeight }
    }));
  };

  useEffect(() => {
    if (showPopup) {
      updatePopupPositionAndSize();
      window.addEventListener('resize', updatePopupPositionAndSize);
      return () => window.removeEventListener('resize', updatePopupPositionAndSize);
    }
  }, [showPopup]);

  const nodeStyle = theme === "dark"
    ? { backgroundColor: "#1f2937", color: "white" }
    : { backgroundColor: "white", color: "black" };

  return (
    <div className="w-full h-[600px]">
      <ReactFlow<CustomNodeType, CustomEdgeType>
        nodes={nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            ...nodeStyle
          }
        }))}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView

        // Thêm các props này để vô hiệu hóa controls của node
        nodesDraggable={false}     // Không cho phép kéo node
        nodesConnectable={false}   // Không cho phép tạo kết nối mới từ node
      >
        <Background />
        {isLargeScreen && <MiniMap />}
        {isLargeScreen && <Controls />}
      </ReactFlow>

      {showPopup && (
        <div
          ref={popupRef}
          className={`fixed z-50 overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:text-white ${isFullScreen ? 'fixed inset-0' : ''}`}
          style={{
            left: `${popupInfo.position.x}px`,
            top: `${popupInfo.position.y}px`,
            width: `${popupInfo.size.width}px`,
            height: `${popupInfo.size.height}px`,
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="popup-header flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg cursor-move">
            <button
              onClick={closePopup}
              className="text-2xl font-bold bg-transparent border-none cursor-pointer text-gray-600 dark:text-gray-300 z-10"
            >
              ×
            </button>
            <h3 className="text-lg font-medium flex-1 text-center">PDF Viewer (Kéo để di chuyển)</h3>
            <div className="popup-controls flex space-x-2">
              <button
                onClick={zoomOut}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Thu nhỏ"
              >
                -
              </button>
              <button
                onClick={zoomIn}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Phóng to"
              >
                +
              </button>
              <button
                onClick={toggleFullScreen}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title={isFullScreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
              >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={reloadPdf}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Tải lại PDF"
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading PDF...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500 p-4 text-center">
                Error: {error}
              </div>
            </div>
          )}

          {pdfLoadError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500 p-4 text-center">
                {pdfLoadError}
                <button
                  onClick={reloadPdf}
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
                >
                  Tải Lại PDF
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && !pdfLoadError && (
            <div className="h-[calc(100%-40px)] w-full">
              <iframe
                ref={iframeRef}
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(popupInfo.url)}&embedded=true`}
                className="w-full h-full border-none"
                title="PDF Viewer"
                onError={handleIframeError}
              />
            </div>
          )}

          {!isFullScreen && (
            <div
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, rgba(128, 128, 128, 0.5) 50%)'
              }}
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
            />
          )}
        </div>
      )}
    </div>
  );
}