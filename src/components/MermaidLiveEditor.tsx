'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';

interface MermaidLiveEditorProps {
  initialMermaid?: string;
  onSave: (mermaidCode: string) => void;
  onCancel: () => void;
}

// Predefined templates
const mermaidTemplates = {
  flowchart: {
    name: '🔄 Flowchart',
    code: `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
    C --> D`
  },
  sequence: {
    name: '📞 Sequence Diagram',
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`
  },
  gantt: {
    name: '📊 Gantt Chart',
    code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`
  },
  pie: {
    name: '🥧 Pie Chart',
    code: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`
  },
  gitgraph: {
    name: '🌳 Git Graph',
    code: `gitgraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`
  },
  mindmap: {
    name: '🧠 Mind Map',
    code: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid`
  },
  timeline: {
    name: '⏰ Timeline',
    code: `timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter`
  },
  class: {
    name: '📋 Class Diagram',
    code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`
  }
};

export default function MermaidLiveEditor({ initialMermaid = '', onSave, onCancel }: MermaidLiveEditorProps) {
  const [code, setCode] = useState(initialMermaid || mermaidTemplates.flowchart.code);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('flowchart');
  const [zoomLevel, setZoomLevel] = useState(100);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      }
    });
  }, []);

  // Real-time preview rendering
  useEffect(() => {
    const renderPreview = async () => {
      if (!previewRef.current || !code.trim()) return;

      setIsLoading(true);
      setError('');

      try {
        // Clear previous content
        previewRef.current.innerHTML = '';

        const id = `mermaid-preview-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);

        previewRef.current.innerHTML = svg;

        // Make SVG responsive and remove fixed dimensions
        const svgElement = previewRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = 'none';
          svgElement.style.height = 'auto';
          svgElement.style.display = 'block';
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError(err.message || 'Unable to render diagram');
        previewRef.current.innerHTML = `
          <div class="flex items-center justify-center h-64 bg-red-50 border-2 border-dashed border-red-300 rounded-lg">
            <div class="text-center">
              <div class="text-red-600 text-4xl mb-4">⚠️</div>
              <div class="text-red-800 font-semibold mb-2">Syntax Error</div>
              <div class="text-red-600 text-sm max-w-md">${err.message}</div>
            </div>
          </div>
        `;
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(renderPreview, 500);
    return () => clearTimeout(debounceTimer);
  }, [code]);

  const handleTemplateSelect = useCallback((templateKey: string) => {
    setSelectedTemplate(templateKey);
    setCode(mermaidTemplates[templateKey as keyof typeof mermaidTemplates].code);
  }, []);

  const handleSave = useCallback(() => {
    onSave(code);
  }, [code, onSave]);

  const handleExport = useCallback(() => {
    const svgElement = previewRef.current?.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'diagram.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  }, []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    alert('📋 Code copied to clipboard!');
  }, [code]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(100);
  }, []);

  const handleZoomFit = useCallback(() => {
    if (previewRef.current && previewContainerRef.current) {
      const svgElement = previewRef.current.querySelector('svg');
      if (svgElement) {
        const containerWidth = previewContainerRef.current.clientWidth - 32; // padding
        const containerHeight = previewContainerRef.current.clientHeight - 32;
        const svgWidth = svgElement.getBoundingClientRect().width;
        const svgHeight = svgElement.getBoundingClientRect().height;

        const scaleX = containerWidth / svgWidth;
        const scaleY = containerHeight / svgHeight;
        const scale = Math.min(scaleX, scaleY) * 100;

        setZoomLevel(Math.max(25, Math.min(300, scale)));
      }
    }
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomChange = delta > 0 ? 10 : -10;
      setZoomLevel(prev => Math.max(25, Math.min(300, prev + zoomChange)));
    }
  }, []);

  // Add mouse wheel zoom support
  useEffect(() => {
    const container = previewContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Mermaid Live Editor</h2>
              <p className="text-gray-600 mt-1">Real-time diagram editing with instant preview</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-xl p-2 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Templates Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {Object.entries(mermaidTemplates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateSelect(key)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedTemplate === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Code Editor */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 bg-gray-800 text-white flex items-center justify-between">
              <span className="font-semibold">📝 Mermaid Code</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="markdown"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="w-1/2 flex flex-col border-l border-gray-300">
            <div className="p-3 bg-gray-100 flex items-center justify-between">
              <span className="font-semibold">👁️ Live Preview</span>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="text-blue-600 text-sm flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    Rendering...
                  </div>
                )}

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white border rounded-md">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 25}
                    className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom Out (or Ctrl+Mouse Wheel)"
                  >
                    🔍➖
                  </button>
                  <span className="px-2 text-xs font-mono min-w-[3rem] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 300}
                    className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom In (or Ctrl+Mouse Wheel)"
                  >
                    🔍➕
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button
                    onClick={handleZoomReset}
                    className="p-1 hover:bg-gray-100 text-xs"
                    title="Reset Zoom (100%)"
                  >
                    🎯
                  </button>
                  <button
                    onClick={handleZoomFit}
                    className="p-1 hover:bg-gray-100 text-xs"
                    title="Fit to Window"
                  >
                    📐
                  </button>
                </div>

                <button
                  onClick={handleExport}
                  disabled={!!error}
                  className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                >
                  💾 Export SVG
                </button>
              </div>
            </div>

            <div
              ref={previewContainerRef}
              className="flex-1 overflow-auto bg-gray-50 relative"
              style={{
                backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            >
              <div
                className="p-4 flex items-center justify-center min-h-full"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <div
                  ref={previewRef}
                  className="bg-white shadow-lg rounded-lg p-4"
                >
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <div>Your diagram will appear here</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {error && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Syntax error detected</span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Lines: {code.split('\n').length} |
                Characters: {code.length}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!!error || !code.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Save Diagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}