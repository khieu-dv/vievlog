# Bài 9: Server Actions


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu Server Actions và cách hoạt động trong Next.js
- Tạo và sử dụng Server Actions cho form handling
- Xử lý validation và error handling trong Server Actions
- Áp dụng progressive enhancement với Server Actions
- Kết hợp Server Actions với Client Components
- Tối ưu UX với loading states và revalidation

## 📝 Nội dung chi tiết

### 1. Server Actions là gì?

Server Actions là functions chạy trên server và có thể được gọi trực tiếp từ Client Components hoặc Server Components. Chúng cho phép bạn:

- **Xử lý form submissions** mà không cần API routes
- **Thực hiện mutations** (tạo, cập nhật, xóa data)
- **Progressive enhancement** - forms hoạt động ngay cả khi JavaScript bị disabled
- **Type safety** với TypeScript
- **Automatic revalidation** của cached data

#### Enabling Server Actions
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

### 2. Basic Server Action

#### Creating Server Action
```tsx
// app/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // Extract data from form
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // Validation
  if (!title || title.length < 3) {
    throw new Error('Title must be at least 3 characters long')
  }
  
  if (!content || content.length < 10) {
    throw new Error('Content must be at least 10 characters long')
  }
  
  try {
    // Save to database (mock)
    const newPost = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString(),
    }
    
    console.log('Creating post:', newPost)
    
    // Revalidate the posts page to show the new post
    revalidatePath('/posts')
    
    // Redirect to the new post or posts list
    redirect('/posts')
  } catch (error) {
    console.error('Failed to create post:', error)
    throw new Error('Failed to create post')
  }
}
```

#### Using Server Action in Server Component
```tsx
// app/posts/create/page.tsx
import { createPost } from '@/app/actions/posts'

export default function CreatePostPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      <form action={createPost} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post content"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Post
        </button>
      </form>
    </div>
  )
}
```

### 3. Advanced Server Actions với Validation

#### Server Action với Zod Validation
```tsx
// lib/validations.ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content must be less than 5000 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  published: z.boolean().optional().default(false)
})

export type CreatePostInput = z.infer<typeof createPostSchema>
```

```tsx
// app/actions/posts.ts
'use server'

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createPostSchema } from '@/lib/validations'

export type ActionResult = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  data?: any
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  try {
    // Parse form data
    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      categoryId: formData.get('categoryId'),
      tags: formData.get('tags'),
      published: formData.get('published') === 'on'
    }

    // Validate data
    const validatedData = createPostSchema.parse(rawData)
    
    // Process tags
    const tagsArray = validatedData.tags 
      ? validatedData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : []

    // Create post (mock database operation)
    const newPost = {
      id: Date.now(),
      slug: validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...validatedData,
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'current-user-id' // In real app, get from session
    }

    // Save to database
    await savePostToDatabase(newPost)
    
    // Revalidate cached data
    revalidatePath('/posts')
    revalidatePath('/')
    revalidateTag('posts')
    
    return {
      success: true,
      message: 'Post created successfully!',
      data: newPost
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }
    
    console.error('Failed to create post:', error)
    return {
      success: false,
      message: 'Failed to create post. Please try again.'
    }
  }
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      categoryId: formData.get('categoryId'),
      tags: formData.get('tags'),
      published: formData.get('published') === 'on'
    }

    const validatedData = createPostSchema.parse(rawData)
    
    // Update post
    const updatedPost = {
      id: parseInt(id),
      ...validatedData,
      tags: validatedData.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      updatedAt: new Date().toISOString()
    }

    await updatePostInDatabase(id, updatedPost)
    
    // Revalidate specific paths and tags
    revalidatePath('/posts')
    revalidatePath(`/posts/${updatedPost.slug}`)
    revalidateTag('posts')
    revalidateTag(`post-${id}`)
    
    return {
      success: true,
      message: 'Post updated successfully!',
      data: updatedPost
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }
    
    return {
      success: false,
      message: 'Failed to update post. Please try again.'
    }
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await deletePostFromDatabase(id)
    
    revalidatePath('/posts')
    revalidateTag('posts')
    
    return {
      success: true,
      message: 'Post deleted successfully!'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete post. Please try again.'
    }
  }
}

// Mock database functions
async function savePostToDatabase(post: any) {
  // Simulate database save
  await new Promise(resolve => setTimeout(resolve, 100))
  console.log('Post saved:', post)
}

async function updatePostInDatabase(id: string, post: any) {
  await new Promise(resolve => setTimeout(resolve, 100))
  console.log('Post updated:', post)
}

async function deletePostFromDatabase(id: string) {
  await new Promise(resolve => setTimeout(resolve, 100))
  console.log('Post deleted:', id)
}
```

### 4. Enhanced Form với Client Component

#### Client Component với Server Action
```tsx
// app/components/CreatePostForm.tsx
'use client'

import { useFormStatus, useFormState } from 'react-dom'
import { createPost, ActionResult } from '@/app/actions/posts'

const initialState: ActionResult = {
  success: false,
  message: '',
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, initialState)

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      {state.message && (
        <div className={`mb-6 p-4 rounded-md ${
          state.success 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {state.message}
        </div>
      )}
      
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter post title"
          />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-600">{state.errors.title[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.content ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter post content"
          />
          {state.errors?.content && (
            <p className="mt-1 text-sm text-red-600">{state.errors.content[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors?.categoryId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            <option value="1">Technology</option>
            <option value="2">Design</option>
            <option value="3">Business</option>
          </select>
          {state.errors?.categoryId && (
            <p className="mt-1 text-sm text-red-600">{state.errors.categoryId[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="react, nextjs, javascript"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish immediately
          </label>
        </div>
        
        <SubmitButton />
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating Post...
        </>
      ) : (
        'Create Post'
      )}
    </button>
  )
}
```

### 5. CRUD Operations với Server Actions

#### Post Management System
```tsx
// app/components/PostManager.tsx
'use client'

import { useState } from 'react'
import { updatePost, deletePost, ActionResult } from '@/app/actions/posts'
import { useFormState } from 'react-dom'

interface Post {
  id: string
  title: string
  content: string
  categoryId: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

interface PostManagerProps {
  post: Post
}

const initialState: ActionResult = {
  success: false,
  message: '',
}

export default function PostManager({ post }: PostManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const updateAction = updatePost.bind(null, post.id)
  const deleteAction = deletePost.bind(null, post.id)
  
  const [updateState, updateFormAction] = useFormState(updateAction, initialState)
  const [deleteState, deleteFormAction] = useFormState(deleteAction, initialState)

  const handleUpdateSuccess = () => {
    if (updateState.success) {
      setIsEditing(false)
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      {/* Display Mode */}
      {!isEditing ? (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <span>•</span>
                <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <div>
          {updateState.message && (
            <div className={`mb-4 p-3 rounded ${
              updateState.success 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {updateState.message}
              {updateState.success && handleUpdateSuccess()}
            </div>
          )}
          
          <form action={updateFormAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                defaultValue={post.title}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  updateState.errors?.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {updateState.errors?.title && (
                <p className="mt-1 text-sm text-red-600">{updateState.errors.title[0]}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                rows={4}
                defaultValue={post.content}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  updateState.errors?.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {updateState.errors?.content && (
                <p className="mt-1 text-sm text-red-600">{updateState.errors.content[0]}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={post.categoryId}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Technology</option>
                <option value="2">Design</option>
                <option value="3">Business</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                defaultValue={post.tags.join(', ')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Comma separated tags"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="published"
                defaultChecked={post.published}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Published
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Post
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{post.title}"? This action cannot be undone.
            </p>
            
            {deleteState.message && (
              <div className={`mb-4 p-3 rounded ${
                deleteState.success 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {deleteState.message}
              </div>
            )}
            
            <div className="flex space-x-3">
              <form action={deleteFormAction}>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete Post
                </button>
              </form>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 6. Advanced Patterns

#### Optimistic Updates với Server Actions
```tsx
// app/components/OptimisticLikes.tsx
'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleLike } from '@/app/actions/posts'

interface LikeButtonProps {
  postId: string
  initialLikes: number
  initialLiked: boolean
}

export default function OptimisticLikes({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
  
  const [optimisticState, addOptimisticLike] = useOptimistic(
    { likes: initialLikes, liked: initialLiked },
    (state, newLiked: boolean) => ({
      likes: newLiked ? state.likes + 1 : state.likes - 1,
      liked: newLiked
    })
  )

  const handleLike = () => {
    const newLiked = !optimisticState.liked
    
    startTransition(async () => {
      // Immediately update UI optimistically
      addOptimisticLike(newLiked)
      
      try {
        // Call server action
        await toggleLike(postId, newLiked)
      } catch (error) {
        console.error('Failed to toggle like:', error)
        // The UI will automatically revert on error due to React's error boundaries
      }
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
        optimisticState.liked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        className={`w-5 h-5 ${optimisticState.liked ? 'fill-red-500' : 'fill-none stroke-current'}`}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{optimisticState.likes}</span>
    </button>
  )
}
```

#### Server Action cho Real-time Comments
```tsx
// app/actions/comments.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function addComment(postId: string, formData: FormData) {
  const content = formData.get('content') as string
  const author = formData.get('author') as string
  
  if (!content.trim()) {
    throw new Error('Comment content is required')
  }
  
  if (!author.trim()) {
    throw new Error('Author name is required')  
  }
  
  try {
    const newComment = {
      id: Date.now(),
      postId,
      content: content.trim(),
      author: author.trim(),
      createdAt: new Date().toISOString()
    }
    
    // Save to database
    await saveCommentToDatabase(newComment)
    
    // Revalidate the post page to show new comment
    revalidatePath(`/posts/${postId}`)
    
    return { success: true, comment: newComment }
  } catch (error) {
    console.error('Failed to add comment:', error)
    throw new Error('Failed to add comment')
  }
}

async function saveCommentToDatabase(comment: any) {
  // Mock save to database
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log('Comment saved:', comment)
}
```

```tsx
// app/components/CommentForm.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { addComment } from '@/app/actions/comments'
import { useRef } from 'react'

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const addCommentWithId = addComment.bind(null, postId)
  
  const [state, formAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      try {
        const result = await addCommentWithId(formData)
        // Reset form on success
        formRef.current?.reset()
        return { success: true, message: 'Comment added successfully!' }
      } catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to add comment'
        }
      }
    },
    { success: false, message: '' }
  )

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
      
      {state.message && (
        <div className={`mb-4 p-3 rounded ${
          state.success 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {state.message}
        </div>
      )}
      
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your comment here..."
          />
        </div>
        
        <SubmitButton />
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding Comment...
        </>
      ) : (
        'Add Comment'
      )}
    </button>
  )
}
```

## 🏆 Bài tập thực hành

### Đề bài: Xây dựng Task Management System với Server Actions

Tạo một hệ thống quản lý công việc hoàn chỉnh với:
1. **Task CRUD**: Tạo, cập nhật, xóa, hoàn thành tasks
2. **Real-time Updates**: Optimistic updates cho task status
3. **Form Validation**: Comprehensive validation với Zod
4. **File Uploads**: Đính kèm files cho tasks
5. **Comments**: Hệ thống comment cho từng task

### Lời giải chi tiết:

**Bước 1**: Setup Project
```bash
npx create-next-app@latest task-manager --typescript --tailwind --eslint --app
cd task-manager
npm install zod
```

**Bước 2**: Types và Validation
```typescript
// lib/types.ts
export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  assigneeId: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  author: string
  content: string
  createdAt: string
}
```

```typescript
// lib/validations.ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Priority is required' }),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional()
})

export const updateTaskSchema = createTaskSchema.extend({
  status: z.enum(['todo', 'in-progress', 'completed']).optional()
})

export const addCommentSchema = z.object({
  author: z.string().min(1, 'Author name is required').max(50, 'Author name too long'),
  content: z.string().min(1, 'Comment content is required').max(500, 'Comment too long')
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type AddCommentInput = z.infer<typeof addCommentSchema>
```

**Bước 3**: Server Actions
```tsx
// app/actions/tasks.ts
'use server'

import { z } from 'zod'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createTaskSchema, updateTaskSchema, addCommentSchema } from '@/lib/validations'
import type { Task, TaskComment } from '@/lib/types'

export type ActionResult = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  data?: any
}

// Mock database
let tasks: Task[] = [
  {
    id: '1',
    title: 'Setup project structure',
    description: 'Create the basic folder structure and setup essential files',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-02-01',
    assigneeId: 'user-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Add login/register functionality with session management',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-02-10',
    assigneeId: 'user-1',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  }
]

let comments: TaskComment[] = []

export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate') || undefined,
      assigneeId: formData.get('assigneeId') || undefined
    }

    const validatedData = createTaskSchema.parse(rawData)
    
    const newTask: Task = {
      id: Date.now().toString(),
      ...validatedData,
      description: validatedData.description || '',
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    tasks.push(newTask)
    
    revalidatePath('/tasks')
    revalidateTag('tasks')
    
    return {
      success: true,
      message: 'Task created successfully!',
      data: newTask
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }
    
    return {
      success: false,
      message: 'Failed to create task'
    }
  }
}

export async function updateTask(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const taskIndex = tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return {
        success: false,
        message: 'Task not found'
      }
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      dueDate: formData.get('dueDate') || undefined,
      assigneeId: formData.get('assigneeId') || undefined
    }

    const validatedData = updateTaskSchema.parse(rawData)
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...validatedData,
      description: validatedData.description || '',
      updatedAt: new Date().toISOString()
    }
    
    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)
    revalidateTag('tasks')
    revalidateTag(`task-${id}`)
    
    return {
      success: true,
      message: 'Task updated successfully!',
      data: tasks[taskIndex]
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }
    
    return {
      success: false,
      message: 'Failed to update task'
    }
  }
}

export async function toggleTaskStatus(id: string, newStatus: Task['status']): Promise<ActionResult> {
  try {
    const taskIndex = tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return {
        success: false,
        message: 'Task not found'
      }
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    }
    
    revalidatePath('/tasks')
    revalidatePath(`/tasks/${id}`)
    revalidateTag('tasks')
    
    return {
      success: true,
      message: `Task marked as ${newStatus}`,
      data: tasks[taskIndex]
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update task status'
    }
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  try {
    const taskIndex = tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      return {
        success: false,
        message: 'Task not found'
      }
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0]
    
    // Also delete related comments
    comments = comments.filter(c => c.taskId !== id)
    
    revalidatePath('/tasks')
    revalidateTag('tasks')
    
    return {
      success: true,
      message: 'Task deleted successfully!',
      data: deletedTask
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete task'
    }
  }
}

export async function addTaskComment(taskId: string, formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      author: formData.get('author'),
      content: formData.get('content')
    }

    const validatedData = addCommentSchema.parse(rawData)
    
    const newComment: TaskComment = {
      id: Date.now().toString(),
      taskId,
      ...validatedData,
      createdAt: new Date().toISOString()
    }

    comments.push(newComment)
    
    revalidatePath(`/tasks/${taskId}`)
    revalidateTag(`task-${taskId}-comments`)
    
    return {
      success: true,
      message: 'Comment added successfully!',
      data: newComment
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      }
    }
    
    return {
      success: false,
      message: 'Failed to add comment'
    }
  }
}

// Utility functions to get data
export async function getTasks(): Promise<Task[]> {
  return tasks
}

export async function getTask(id: string): Promise<Task | null> {
  return tasks.find(t => t.id === id) || null
}

export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  return comments.filter(c => c.taskId === taskId)
}
```

**Bước 4**: Task List Component
```tsx
// app/components/TaskList.tsx
import { getTasks } from '@/app/actions/tasks'
import TaskCard from './TaskCard'

export default async function TaskList() {
  const tasks = await getTasks()

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* To Do Column */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          To Do ({todoTasks.length})
        </h3>
        <div className="space-y-3">
          {todoTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-700 mb-4 flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
          In Progress ({inProgressTasks.length})
        </h3>
        <div className="space-y-3">
          {inProgressTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Completed Column */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-700 mb-4 flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          Completed ({completedTasks.length})
        </h3>
        <div className="space-y-3">
          {completedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Bước 5**: Task Card với Optimistic Updates
```tsx
// app/components/TaskCard.tsx
'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleTaskStatus, deleteTask } from '@/app/actions/tasks'
import type { Task } from '@/lib/types'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition()
  
  const [optimisticTask, setOptimisticTask] = useOptimistic(
    task,
    (state: Task, newStatus: Task['status']) => ({
      ...state,
      status: newStatus
    })
  )

  const handleStatusChange = (newStatus: Task['status']) => {
    startTransition(async () => {
      setOptimisticTask(newStatus)
      try {
        await toggleTaskStatus(task.id, newStatus)
      } catch (error) {
        console.error('Failed to update task status:', error)
      }
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      startTransition(async () => {
        try {
          await deleteTask(task.id)
        } catch (error) {
          console.error('Failed to delete task:', error)
        }
      })
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'border-l-gray-400'
      case 'in-progress': return 'border-l-blue-400'
      case 'completed': return 'border-l-green-400'
      default: return 'border-l-gray-400'
    }
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getStatusColor(optimisticTask.status)} ${isPending ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <Link href={`/tasks/${task.id}`}>
          <h4 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
            {task.title}
          </h4>
        </Link>
        
        <div className="flex space-x-1">
          <button
            onClick={() => handleStatusChange(
              optimisticTask.status === 'completed' ? 'todo' : 
              optimisticTask.status === 'todo' ? 'in-progress' : 'completed'
            )}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 text-sm"
            title="Change status"
          >
            ▶
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-400 hover:text-red-600 text-sm"
            title="Delete task"
          >
            ✕
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        
        {task.dueDate && (
          <span className="text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <div className="mt-2 flex space-x-2">
        {optimisticTask.status !== 'in-progress' && (
          <button
            onClick={() => handleStatusChange('in-progress')}
            disabled={isPending}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Start
          </button>
        )}
        
        {optimisticTask.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange('completed')}
            disabled={isPending}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  )
}
```

**Giải thích logic:**
1. **Server Actions**: CRUD operations với comprehensive validation
2. **Optimistic Updates**: UI updates immediately với useOptimistic
3. **Form Handling**: useFormState và useFormStatus cho better UX  
4. **Revalidation**: Strategic cache invalidation với revalidatePath và revalidateTag
5. **Error Handling**: Proper error boundaries và user feedback

## 🔑 Những điểm quan trọng cần lưu ý

1. **Server Actions Basics**:
   - Must use `'use server'` directive
   - Run on server, can access server resources
   - Return serializable data only
   - Automatically handle CSRF protection

2. **Form Integration**:
   - Direct integration với HTML forms
   - Progressive enhancement support
   - Works với và không có JavaScript

3. **State Management**:
   - Use `useFormState` cho form state management
   - Use `useFormStatus` cho loading states
   - Use `useOptimistic` cho optimistic updates

4. **Validation và Error Handling**:
   - Always validate inputs server-side
   - Return structured error responses
   - Handle both validation và runtime errors

5. **Performance Optimization**:
   - Strategic revalidation với tags
   - Use optimistic updates cho better UX
   - Consider caching strategies

6. **Common Pitfalls**:
   - Forgetting `'use server'` directive
   - Not handling errors properly
   - Over-revalidating cached data
   - Not providing loading states

## 📝 Bài tập về nhà

Xây dựng một **E-commerce Shopping Cart System** với Server Actions:

### Yêu cầu chính:
1. **Product Catalog**:
   - Add to cart với Server Actions
   - Quantity updates với optimistic UI
   - Stock management và validation

2. **Shopping Cart**:
   - Update quantities với debounced Server Actions
   - Remove items với confirmation
   - Apply discount codes với validation

3. **Checkout Process**:
   - Multi-step form với Server Actions
   - Address validation và saving
   - Payment processing simulation
   - Order confirmation và email

4. **User Reviews**:
   - Add reviews với file uploads
   - Rating system với Server Actions
   - Review moderation system

5. **Admin Panel**:
   - Bulk product operations
   - Order management với status updates
   - Inventory management với real-time updates

### Technical Requirements:
- Comprehensive form validation với Zod
- File upload handling với Server Actions
- Email sending simulation
- Advanced optimistic updates patterns
- Error recovery strategies
- Loading states cho complex operations

### Advanced Features:
- Wishlist management với Server Actions
- Product comparison với client state
- Recently viewed tracking
- Inventory alerts và notifications
- Bulk operations với progress indicators
- Advanced search với Server Actions
