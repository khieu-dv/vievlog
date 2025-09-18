// ~/app/(main)/documents/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '~/lib/authClient';

interface Document {
  id: string;
  title: string;
  slug: string;
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

interface PaginatedResponse {
  items: Document[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export default function DocumentsPage() {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');

  const fetchDocuments = async (page = 1, filterText = '', userOnly = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '12',
      });

      if (filterText) {
        params.append('filter', `title~"${filterText}" || description~"${filterText}"`);
      }

      if (userOnly && session?.user) {
        params.append('userId', session.user.id);
      }

      const response = await fetch(`/api/documents?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPage, filter, viewMode === 'mine');
  }, [currentPage, filter, viewMode, session]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDocuments(1, filter, viewMode === 'mine');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tài liệu</h1>
                <p className="text-gray-600 mt-1">Khám phá và chia sẻ kiến thức</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href="/documents/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tạo tài liệu mới
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Tìm kiếm tài liệu..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>

              {/* View Mode */}
              {session?.user && (
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                      viewMode === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setViewMode('mine')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md border-l ${
                      viewMode === 'mine'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Của tôi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : documents?.items.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tài liệu</h3>
            <p className="mt-1 text-sm text-gray-500">
              {viewMode === 'mine' ? 'Bạn chưa có tài liệu nào.' : 'Chưa có tài liệu nào được tạo.'}
            </p>
            <div className="mt-6">
              <Link
                href="/documents/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tạo tài liệu đầu tiên
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents?.items.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.slug}`}
                  className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {doc.published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Đã xuất bản
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            Bản nháp
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(doc.created)}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h3>

                    {doc.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {doc.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Bởi {doc.expand?.author?.username || doc.expand?.author?.email}</span>
                      </div>

                      {doc.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {doc.category}
                        </span>
                      )}
                    </div>

                    {doc.tags && doc.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{doc.tags.length - 3} khác</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {documents && documents.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  <span className="px-3 py-2 text-sm text-gray-700">
                    Trang {currentPage} / {documents.totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(documents.totalPages, prev + 1))}
                    disabled={currentPage === documents.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}