"use client";

import React, { useState, useEffect } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import remarkGfm from 'remark-gfm';
import { useMDXComponents } from '../mdx-components';

// Custom component for the code block with a copy button
const CodeBlock = ({ language, code, isDark }: { language: string, code: string, isDark: boolean }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const CopyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    );

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );


    return (
        <div className="relative group">
            <SyntaxHighlighter
                style={isDark ? vscDarkPlus : vs}
                language={language}
                PreTag="div"
                className={`rounded-lg my-6 text-sm leading-relaxed !bg-[#F4F2F0] ${isDark ? 'text-[#d4d4d4]' : 'text-[#24292e]'}`}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}
            >
                {code}
            </SyntaxHighlighter>
            <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 p-2 rounded-md border transition-all duration-200 ease-in-out 
                           ${isCopied 
                               ? 'bg-green-600 text-white border-green-600' 
                               : `bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white 
                                  opacity-0 group-hover:opacity-100 focus:opacity-100`}`}
                aria-label={isCopied ? 'Copied!' : 'Copy code'}
            >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
        </div>
    );
};

type MarkdownRendererProps = {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const { theme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const components = useMDXComponents({
        code: ({ children, className, ...props }) => {
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

            return match ? (
                <CodeBlock language={language} code={String(children).replace(/\n$/, '')} isDark={isDark} />
            ) : (
                <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded px-1.5 py-0.5 text-sm font-mono border" {...props}>
                    {children}
                </code>
            );
        },
    });

    useEffect(() => {
        const serializeContent = async () => {
            try {
                setIsLoading(true);
                const serialized = await serialize(content, {
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [],
                    },
                });
                setMdxSource(serialized);
            } catch (error) {
                console.error('Error serializing MDX content:', error);
                setMdxSource(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (content) {
            serializeContent();
        }
    }, [content]);

    if (isLoading) {
        return (
            <div className="markdown-body">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    if (!mdxSource) {
        return (
            <div className="markdown-body">
                <p className="text-gray-500 dark:text-gray-400">Failed to load content</p>
            </div>
        );
    }

    return (
        <div className="markdown-body">
            <MDXRemote {...mdxSource} components={components} />
        </div>
    );
};