import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { Counter, TodoList, ColorPicker } from './InteractiveComponents'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-4 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold tracking-tight text-foreground mb-3 leading-tight">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-base text-foreground leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 text-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-1 text-base leading-relaxed">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 bg-muted/20 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
      >
        {children}
      </Link>
    ),
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        className="rounded-lg max-w-full h-auto mb-4"
        width={800}
        height={400}
        alt={props.alt || ''}
      />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-border">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">
        {children}
      </td>
    ),
    hr: () => (
      <hr className="border-border my-8" />
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground">
        {children}
      </em>
    ),
    Counter,
    TodoList,
    ColorPicker,
    ...components,
  }
}