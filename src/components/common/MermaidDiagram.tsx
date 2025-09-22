"use client";

import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  className?: string;
  showZoomControls?: boolean;
}

export function MermaidDiagram({ chart, id, className = "", showZoomControls = true }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    if (ref.current) {
      // Initialize mermaid with configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 14,
        themeVariables: {
          primaryColor: "#3b82f6",
          primaryTextColor: "#1f2937",
          primaryBorderColor: "#e5e7eb",
          lineColor: "#6b7280",
          secondaryColor: "#f3f4f6",
          tertiaryColor: "#f9fafb",
          background: "#ffffff",
          mainBkg: "#ffffff",
          secondBkg: "#f3f4f6",
          tertiaryBkg: "#f9fafb",
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
        },
        gitGraph: {
          useMaxWidth: true,
        },
        er: {
          useMaxWidth: true,
        },
        journey: {
          useMaxWidth: true,
        }
      });

      const renderChart = async () => {
        try {
          const element = ref.current;
          if (!element) return;

          // Clear previous content
          element.innerHTML = "";

          // Generate unique ID
          const chartId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

          // Render the diagram
          const { svg } = await mermaid.render(chartId, chart);
          element.innerHTML = svg;

          // Apply responsive styling and zoom
          const svgElement = element.querySelector("svg");
          if (svgElement) {
            svgElement.style.width = "100%";
            svgElement.style.height = "auto";
            svgElement.style.maxWidth = "100%";
            svgElement.style.transform = `scale(${zoom})`;
            svgElement.style.transformOrigin = "center top";
            svgElement.style.transition = "transform 0.2s ease-in-out";
          }
        } catch (error) {
          console.error("Error rendering Mermaid diagram:", error);
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded">Error rendering diagram: ${error}</div>`;
          }
        }
      };

      renderChart();
    }
  }, [chart, id, zoom]);

  // Update zoom when zoom state changes
  useEffect(() => {
    if (ref.current) {
      const svgElement = ref.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.transform = `scale(${zoom})`;
      }
    }
  }, [zoom]);

  return (
    <div className={`relative ${className}`}>
      {/* Zoom Controls */}
      {showZoomControls && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 rounded-lg p-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="p-1.5 rounded hover:bg-gray-100/20 dark:hover:bg-slate-700/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
          <span className="px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="p-1.5 rounded hover:bg-gray-100/20 dark:hover:bg-slate-700/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Phóng to"
          >
            <ZoomIn size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title="Đặt lại zoom"
          >
            <RotateCcw size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Diagram Container */}
      <div
        ref={ref}
        className="mermaid-diagram w-full overflow-x-auto"
        style={{ minHeight: "200px" }}
      />
    </div>
  );
}