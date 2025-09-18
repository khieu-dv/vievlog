'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface DocumentRendererProps {
  content: string;
  className?: string;
}

export default function DocumentRenderer({ content, className = '' }: DocumentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaidDiagrams = async () => {
      if (!contentRef.current) return;

      // Initialize Mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true
        }
      });

      // Find and render Mermaid diagrams - check multiple selectors
      const selectors = [
        'pre code.language-mermaid',
        'code.language-mermaid',
        '.mermaid-code',
        '[data-language="mermaid"]'
      ];

      for (const selector of selectors) {
        const mermaidElements = contentRef.current.querySelectorAll(selector);

        for (let i = 0; i < mermaidElements.length; i++) {
          const element = mermaidElements[i];
          const chart = element.textContent?.trim() || '';

          if (!chart) continue;

          const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          try {
            console.log('Rendering Mermaid chart:', chart);
            const { svg } = await mermaid.render(id, chart);

            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-diagram my-6 flex justify-center p-4 bg-white border rounded-lg';
            wrapper.innerHTML = svg;

            // Find the container to replace
            let container = element.closest('pre') || element.parentElement;
            if (container) {
              container.replaceWith(wrapper);
            }
          } catch (error: unknown) {
            console.error('Mermaid rendering error:', error, 'Chart:', chart);

            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'bg-red-50 border border-red-200 rounded p-4 text-red-700 my-6';
            const errorMessage = error instanceof Error ? error.message : 'Unable to render diagram';
            errorDiv.innerHTML = `
              <strong>Mermaid Diagram Error:</strong><br>
              <code>${errorMessage}</code><br>
              <details class="mt-2">
                <summary class="cursor-pointer">Show diagram code</summary>
                <pre class="mt-2 text-sm bg-red-100 p-2 rounded">${chart}</pre>
              </details>
            `;

            let container = element.closest('pre') || element.parentElement;
            if (container) {
              container.replaceWith(errorDiv);
            }
          }
        }
      }

      // Apply custom styling to HTML elements
      applyCustomStyling(contentRef.current);
    };

    // Run after DOM is ready
    setTimeout(renderMermaidDiagrams, 100);
  }, [content]);

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <div
        ref={contentRef}
        className="document-content
          [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-6 [&_h1]:mt-8
          [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mb-4 [&_h2]:mt-6
          [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-3 [&_h3]:mt-5
          [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mb-2 [&_h4]:mt-4
          [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:my-4
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:pl-4
          [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:my-4 [&_ol]:space-y-2 [&_ol]:pl-4
          [&_li]:text-gray-700
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-blue-50 [&_blockquote]:rounded-r-lg
          [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-purple-600 [&_code]:text-sm
          [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0
          [&_table]:min-w-full [&_table]:divide-y [&_table]:divide-gray-200 [&_table]:border [&_table]:border-gray-300 [&_table]:rounded-lg [&_table]:my-6
          [&_thead]:bg-gray-50
          [&_th]:px-6 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-gray-500 [&_th]:uppercase [&_th]:tracking-wider [&_th]:border-b [&_th]:border-gray-200
          [&_td]:px-6 [&_td]:py-4 [&_td]:text-sm [&_td]:text-gray-900 [&_td]:border-b [&_td]:border-gray-200
          [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_a]:font-medium
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-6
          [&_.mermaid-diagram_svg]:max-w-full [&_.mermaid-diagram_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

function applyCustomStyling(container: HTMLElement) {
  // Add table wrapper for overflow
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.parentElement?.classList.contains('table-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper overflow-x-auto';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });

  // Enhance images with captions
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (img.alt && !img.nextElementSibling?.classList.contains('image-caption')) {
      const caption = document.createElement('p');
      caption.className = 'image-caption text-sm text-gray-500 text-center mt-2 italic';
      caption.textContent = img.alt;
      img.parentNode?.insertBefore(caption, img.nextSibling);
    }
  });

  // Process code blocks for syntax highlighting
  const codeBlocks = container.querySelectorAll('pre code');
  codeBlocks.forEach(code => {
    const pre = code.parentElement;
    if (pre && !code.classList.contains('language-mermaid')) {
      pre.classList.add('code-block');

      // Add language label if available
      const langMatch = Array.from(code.classList).find(cls => cls.startsWith('language-'));
      if (langMatch) {
        const lang = langMatch.replace('language-', '');
        const label = document.createElement('div');
        label.className = 'code-language-label bg-gray-800 text-white text-xs px-3 py-1 rounded-t-lg -mb-1';
        label.textContent = lang;
        pre.parentNode?.insertBefore(label, pre);
      }
    }
  });
}