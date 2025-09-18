// ~/app/(main)/documents/[slug]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '~/lib/authClient';
import TipTapEditor from '~/components/editor/TipTapEditor';
import Link from 'next/link';
import { mdxTemplates, type MDXTemplate } from '~/lib/mdx-templates';

interface Document {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  published: boolean;
  expand?: {
    author: {
      id: string;
    };
  };
}

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/slug/${params.slug}`);
        if (response.ok) {
          const doc = await response.json();

          // Check if user is the author
          if (!session?.user || doc.expand?.author?.id !== session.user.id) {
            setError('Bạn không có quyền chỉnh sửa tài liệu này');
            return;
          }

          setDocument(doc);
          setFormData({
            title: doc.title,
            slug: doc.slug,
            description: doc.description || '',
            content: doc.content,
            category: doc.category || '',
            tags: doc.tags ? doc.tags.join(', ') : '',
            published: doc.published,
          });
        } else {
          setError('Tài liệu không tồn tại');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Có lỗi xảy ra khi tải tài liệu');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug && session?.user) {
      fetchDocument();
    } else if (session === null) {
      setError('Bạn cần đăng nhập để chỉnh sửa tài liệu');
      setLoading(false);
    }
  }, [params.slug, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setSaving(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        router.push(`/documents/${updatedDoc.slug}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Có lỗi xảy ra khi cập nhật tài liệu');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Có lỗi xảy ra khi cập nhật tài liệu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!document) return;

    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/documents');
      } else {
        alert('Có lỗi xảy ra khi xóa tài liệu');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Có lỗi xảy ra khi xóa tài liệu');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
            <Link
              href="/documents"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Quay lại danh sách tài liệu
            </Link>
          </div>
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
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tài liệu</h1>
                <p className="text-gray-600 mt-1">Cập nhật nội dung tài liệu MDX</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTemplates(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                >
                  📝 Template
                </button>
                <Link
                  href={`/documents/${document?.slug}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Quay lại tài liệu
                </Link>
              </div>
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
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  placeholder="react, javascript, tutorial"
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
                Xuất bản tài liệu
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                Xóa tài liệu
              </button>

              <div className="flex gap-3">
                <Link
                  href={`/documents/${document?.slug}`}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={saving || !formData.title || !formData.slug || !formData.content}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Template Selection Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Áp dụng Template MDX</h2>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-600 mt-2">⚠️ Lưu ý: Template sẽ thay thế toàn bộ nội dung hiện tại</p>
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
                    Hủy
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