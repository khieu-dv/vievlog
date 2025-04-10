'use client';

import { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

interface LoadPdfProps {
  pdfUrl: string;
}

export default function LoadPdf({ pdfUrl }: LoadPdfProps) {
  const [file, setFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [containerWidth, setContainerWidth] = useState<number | undefined>();
  const [scale, setScale] = useState<number>(1.1); // Changed default scale to 1.2 (120%)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isTwoPageLayout, setIsTwoPageLayout] = useState<boolean>(false);

  // Set the PDF URL for the component
  useEffect(() => {
    setFile(`/api/proxy-pdf?pdfUrl=${encodeURIComponent(pdfUrl)}`);
  }, [pdfUrl]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef) {
        setContainerWidth(containerRef.clientWidth);
        // Check if screen width is larger than 1024px
        setIsTwoPageLayout(window.innerWidth > 1400);
      }
    };

    // Initial sizing
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  // Zoom controls
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1.1); // Changed reset zoom to 1.2 (120%)

  // Render pages in two-column layout
  const renderPagesInTwoColumnLayout = () => {
    if (!numPages) return null;

    const pageGroups = [];
    for (let i = 0; i < numPages; i += 2) {
      pageGroups.push(
        <div key={`group-${i}`} className="flex justify-center space-x-4 my-4">
          <Page
            pageNumber={i + 1}
            width={containerWidth ? containerWidth * 0.4 : undefined}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
          {i + 2 <= numPages && (
            <Page
              pageNumber={i + 2}
              width={containerWidth ? containerWidth * 0.4 : undefined}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          )}
        </div>
      );
    }
    return pageGroups;
  };

  // Render pages in single-column layout
  const renderPagesInSingleColumnLayout = () => {
    return Array.from(new Array(numPages), (_, index) => (
      <div key={index} className="pdf-page my-4 flex justify-center">
        <Page
          pageNumber={index + 1}
          width={containerWidth ? containerWidth * 0.9 : undefined}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </div>
    ));
  };

  return (
    <div className="pdf-container">
      <div className="controls mb-4 flex items-center gap-2">
        <button onClick={zoomOut} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
        <button onClick={resetZoom} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
        <button onClick={zoomIn} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
        <span className="ml-2">{Math.round(scale * 100)}%</span>
      </div>

      <div 
        ref={setContainerRef} 
        className="pdf-viewer w-full overflow-auto border border-gray-300 rounded-lg"
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
        >
          {isTwoPageLayout ? renderPagesInTwoColumnLayout() : renderPagesInSingleColumnLayout()}
        </Document>
      </div>
    </div>
  );
}