// ~/app/(main)/documents/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '~/lib/authClient';
import Link from 'next/link';
import DocumentRenderer from '~/components/DocumentRenderer';

interface Document {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  category: string;
  tags: string[];
  published: boolean;
  created: string;
  updated: string;
  expand?: {
    author: {
      id: string;
      username: string;
      email: string;
    };
  };
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/slug/${params.slug}`);
        if (response.ok) {
          const doc = await response.json();
          setDocument(doc);
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

    if (params.slug) {
      fetchDocument();
    }
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = session?.user && document?.expand?.author?.id === session.user.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Tài liệu không tồn tại'}
            </h1>
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

  // Check if user can view unpublished document
  if (!document.published && !isAuthor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tài liệu chưa được xuất bản
            </h1>
            <p className="text-gray-600 mb-6">
              Tài liệu này chưa được tác giả xuất bản công khai.
            </p>
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
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-8">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/documents"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Danh sách tài liệu
              </Link>

              {isAuthor && (
                <div className="flex gap-2">
                  <Link
                    href={`/documents/${document.slug}/edit`}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Chỉnh sửa
                  </Link>
                </div>
              )}
            </div>

            {/* Status */}
            {!document.published && (
              <div className="mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  📝 Bản nháp
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {document.title}
            </h1>

            {/* Description */}
            {document.description && (
              <p className="text-xl text-gray-600 mb-6">
                {document.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Bởi {document.expand?.author?.username || document.expand?.author?.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tạo lúc {formatDate(document.created)}</span>
              </div>

              {document.updated !== document.created && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Cập nhật {formatDate(document.updated)}</span>
                </div>
              )}
            </div>

            {/* Category and Tags */}
            <div className="flex flex-wrap gap-4">
              {document.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Danh mục:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {document.category}
                  </span>
                </div>
              )}

              {document.tags && document.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8">
            <DocumentRenderer
              content={document.content}
              className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-purple-600 prose-pre:bg-gray-100 prose-blockquote:border-l-blue-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/documents"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Xem thêm tài liệu khác
          </Link>
        </div>
      </div>
    </div>
  );
}