import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'
// TODO: Re-enable InteractiveComponents when available
// import { Counter, TodoList, ColorPicker, MultiChoiceQuiz } from './src/components/InteractiveComponents'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = (components?: MDXComponents): MDXComponents => ({
  ...docsComponents,
  // Counter,
  // TodoList,
  // ColorPicker,
  // MultiChoiceQuiz,
  ...components
})