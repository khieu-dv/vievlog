import React from 'react'
import { cn } from '@/lib/utils'

interface MarkdownWrapperProps {
  children: React.ReactNode
  className?: string
}

/**
 * MarkdownWrapper - Wrapper component để đảm bảo spacing nhất quán cho tất cả markdown content
 * 
 * Sử dụng:
 * - Wrap bất kỳ markdown/mdx content nào
 * - Tự động áp dụng class 'markdown-content' để kích hoạt CSS reset
 * - Đảm bảo margin/padding nhất quán cho tất cả elements
 * 
 * @example
 * <MarkdownWrapper>
 *   <div className="bg-blue-50 p-4">
 *     <h3>Tiêu đề</h3>
 *     <p>Nội dung</p>
 *   </div>
 * </MarkdownWrapper>
 */
export function MarkdownWrapper({ children, className }: MarkdownWrapperProps) {
  return (
    <div className={cn(
      "markdown-content", // Kích hoạt CSS reset từ markdown.css
      "prose prose-gray max-w-none", // Prose styles
      "space-y-4", // Consistent vertical spacing
      className
    )}>
      {children}
    </div>
  )
}

export default MarkdownWrapper