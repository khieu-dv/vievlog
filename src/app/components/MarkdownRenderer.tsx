"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 text-gray-900" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5 text-gray-900" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4 text-gray-900" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-lg font-bold mb-2 mt-3 text-gray-900" {...props} />,
                    h5: ({ node, ...props }) => <h5 className="text-base font-bold mb-1 mt-2 text-gray-900" {...props} />,
                    h6: ({ node, ...props }) => <h6 className="text-sm font-bold mb-1 mt-1 text-gray-900" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 text-gray-800 leading-relaxed" {...props} />,
                    a: ({ node, ...props }) => (
                        <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
                    ),
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-1 mb-4 text-gray-700 italic" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full bg-white border border-gray-300" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
                    tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
                    th: ({ node, ...props }) => (
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-300" {...props} />
                    ),
                    td: ({ node, ...props }) => <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300" {...props} />,
                    code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                        // Handle language detection, with special handling for Golang
                        const match = /language-(\w+)/.exec(className || '');
                        let language = match ? match[1] : '';

                        // Map common variations of golang to 'go' which is what Prism expects
                        if (language === 'golang' || language === 'go') {
                            language = 'go';
                        }

                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={atomDark}
                                language={language}
                                PreTag="div"
                                className="rounded-md my-4"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-gray-100 text-gray-900 rounded-md px-1 py-0.5 text-sm font-mono" {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ node, ...props }) => <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-4" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-8 border-t border-gray-300" {...props} />,
                    img: ({ node, ...props }) => <img className="max-w-full h-auto my-4 rounded-md" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};