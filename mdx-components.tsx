import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = (components?: MDXComponents): MDXComponents => ({
  ...docsComponents,
  ...components
})