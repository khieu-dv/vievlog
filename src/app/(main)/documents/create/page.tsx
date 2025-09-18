// ~/app/(main)/documents/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '~/components/editor/TipTapEditor';
import { useSession } from '~/lib/authClient';
import { mdxTemplates, type MDXTemplate } from '~/lib/mdx-templates';

export default function CreateDocumentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MDXTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    published: false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTemplateSelect = (template: MDXTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      content: template.content,
      category: template.category
    }));
    setShowTemplates(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      alert('Bạn cần đăng nhập để tạo tài liệu');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          author: session.user.id,
        }),
      });

      if (response.ok) {
        const document = await response.json();
        router.push(`/documents/${document.slug}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Có lỗi xảy ra khi tạo tài liệu');
      }
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Có lỗi xảy ra khi tạo tài liệu');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cần đăng nhập</h1>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tạo tài liệu</p>
          <a
            href="/auth/sign-in"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tạo tài liệu mới</h1>
                <p className="text-gray-600 mt-1">Tạo và chia sẻ tài liệu MDX phức tạp</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
              >
                📝 Chọn template
              </button>
            </div>
            {selectedTemplate && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedTemplate.icon}</span>
                    <div>
                      <h3 className="font-semibold text-purple-800">{selectedTemplate.name}</h3>
                      <p className="text-sm text-purple-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(null)}
                    className="text-purple-400 hover:text-purple-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề tài liệu"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="url-cua-tai-lieu"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /documents/{formData.slug}
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Mô tả ngắn về tài liệu"
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <input
                  id="category"
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: Programming, Tutorial"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="react, javascript, tutorial (phân cách bằng dấu phẩy)"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung *
              </label>
              <TipTapEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Bắt đầu viết nội dung tài liệu..."
              />
            </div>

            {/* Published */}
            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Xuất bản ngay (có thể thay đổi sau)
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.slug || !formData.content}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tạo...' : 'Tạo tài liệu'}
              </button>
            </div>
          </form>
        </div>

        {/* Template Selection Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Chọn Template MDX</h2>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Chọn template phù hợp để bắt đầu tạo tài liệu</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mdxTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            template.category === 'course' ? 'bg-blue-100 text-blue-700' :
                            template.category === 'tutorial' ? 'bg-green-100 text-green-700' :
                            template.category === 'documentation' ? 'bg-yellow-100 text-yellow-700' :
                            template.category === 'blog' ? 'bg-pink-100 text-pink-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {template.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}