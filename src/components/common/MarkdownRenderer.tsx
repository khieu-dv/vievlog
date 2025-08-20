"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

type MarkdownRendererProps = {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

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
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-800" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-800" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1 text-gray-800" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-1 mb-4 text-gray-700 italic" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="bg-white border border-gray-300" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
                    tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
                    th: ({ node, ...props }) => (
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-300" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        let language = match ? match[1] : '';

                        const languageMap: Record<string, string> = {
                            'js': 'javascript',
                            'jsx': 'jsx',
                            'ts': 'typescript',
                            'tsx': 'tsx',
                            'py': 'python',
                            'rb': 'ruby',
                            'go': 'go',
                            'golang': 'go',
                            'rust': 'rust',
                            'rs': 'rust',
                            'java': 'java',
                            'c': 'c',
                            'cpp': 'cpp',
                            'c++': 'cpp',
                            'csharp': 'csharp',
                            'cs': 'csharp',
                            'php': 'php',
                            'swift': 'swift',
                            'kotlin': 'kotlin',
                            'scala': 'scala',
                            'dart': 'dart',
                            'r': 'r',
                            'matlab': 'matlab',
                            'sql': 'sql',
                            'html': 'xml',
                            'css': 'css',
                            'scss': 'scss',
                            'sass': 'sass',
                            'less': 'less',
                            'json': 'json',
                            'xml': 'xml',
                            'yaml': 'yaml',
                            'yml': 'yaml',
                            'toml': 'toml',
                            'ini': 'ini',
                            'conf': 'ini',
                            'sh': 'bash',
                            'bash': 'bash',
                            'zsh': 'bash',
                            'fish': 'bash',
                            'powershell': 'powershell',
                            'ps1': 'powershell',
                            'dockerfile': 'dockerfile',
                            'docker': 'dockerfile',
                            'makefile': 'makefile',
                            'make': 'makefile',
                            'cmake': 'cmake',
                            'gradle': 'gradle',
                            'maven': 'xml',
                            'vue': 'vue',
                            'svelte': 'svelte',
                            'angular': 'typescript',
                            'react': 'jsx',
                            'graphql': 'graphql',
                            'gql': 'graphql',
                            'markdown': 'markdown',
                            'md': 'markdown',
                            'latex': 'latex',
                            'tex': 'latex',
                            'vim': 'vim',
                            'nginx': 'nginx',
                            'apache': 'apache',
                            'lua': 'lua',
                            'perl': 'perl',
                            'haskell': 'haskell',
                            'hs': 'haskell',
                            'clojure': 'clojure',
                            'clj': 'clojure',
                            'lisp': 'lisp',
                            'scheme': 'scheme',
                            'erlang': 'erlang',
                            'elixir': 'elixir',
                            'ex': 'elixir',
                            'elm': 'elm',
                            'ocaml': 'ocaml',
                            'fsharp': 'fsharp',
                            'fs': 'fsharp',
                            'julia': 'julia',
                            'jl': 'julia',
                            'zig': 'zig',
                            'assembly': 'x86asm',
                            'asm': 'x86asm',
                            'nasm': 'x86asm',
                            'mips': 'mipsasm',
                            'arm': 'armasm',
                            'vb': 'vbnet',
                            'vbnet': 'vbnet',
                            'pascal': 'pascal',
                            'delphi': 'delphi',
                            'cobol': 'cobol',
                            'fortran': 'fortran',
                            'ada': 'ada',
                            'd': 'd',
                            'nim': 'nim',
                            'crystal': 'crystal',
                            'reason': 'reason',
                            're': 'reason',
                            'rescript': 'rescript',
                            'res': 'rescript',
                            'purescript': 'purescript',
                            'purs': 'purescript',
                            'coffeescript': 'coffeescript',
                            'coffee': 'coffeescript',
                            'livescript': 'livescript',
                            'ls': 'livescript',
                            'stylus': 'stylus',
                            'styl': 'stylus',
                            'pug': 'pug',
                            'jade': 'pug',
                            'handlebars': 'handlebars',
                            'hbs': 'handlebars',
                            'mustache': 'handlebars',
                            'twig': 'twig',
                            'jinja': 'jinja2',
                            'jinja2': 'jinja2',
                            'smarty': 'smarty',
                            'erb': 'erb',
                            'haml': 'haml',
                            'slim': 'slim',
                            'liquid': 'liquid',
                            'django': 'django',
                            'mako': 'mako',
                            'prolog': 'prolog',
                            'pl': 'prolog',
                            'smalltalk': 'smalltalk',
                            'st': 'smalltalk',
                            'tcl': 'tcl',
                            'verilog': 'verilog',
                            'v': 'verilog',
                            'vhdl': 'vhdl',
                            'systemverilog': 'systemverilog',
                            'sv': 'systemverilog',
                            'plaintext': 'plaintext',
                            'text': 'plaintext',
                            'txt': 'plaintext'
                        };

                        language = languageMap[language.toLowerCase()] || language;

                        return !inline && match ? (
                            <div className="relative">
                                <SyntaxHighlighter
                                    style={isDark ? vscDarkPlus : vs}
                                    language={language}
                                    PreTag="div"
                                    className={`rounded-lg my-6 text-sm leading-relaxed ${isDark ? '!bg-[#f8f8f8] !text-[#d4d4d4]' : '!bg-[#f8f8f8] !text-[#24292e]'
                                        }`}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1.5rem',
                                        backgroundColor: isDark ? '#f8f8f8' : '#f8f8f8',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        lineHeight: '1.6'
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                                {language && (
                                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-mono rounded-bl-md rounded-tr-lg border-l border-b ${isDark
                                        ? 'text-gray-400 bg-gray-800 border-gray-600'
                                        : 'text-gray-600 bg-gray-200 border-gray-300'
                                        }`}>
                                        {language}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded px-1.5 py-0.5 text-sm font-mono border" {...props}>
                                {children}
                            </code>
                        );
                    },
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