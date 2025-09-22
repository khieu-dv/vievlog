"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  className?: string;
}

export function MermaidDiagram({ chart, id, className = "" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

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

          // Apply responsive styling
          const svgElement = element.querySelector("svg");
          if (svgElement) {
            svgElement.style.width = "100%";
            svgElement.style.height = "auto";
            svgElement.style.maxWidth = "100%";
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
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className={`mermaid-diagram w-full overflow-x-auto ${className}`}
      style={{ minHeight: "200px" }}
    />
  );
}