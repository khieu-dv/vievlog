'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Users, MapPin, Building2, MessageSquare } from 'lucide-react';
import { companyAPI, industryAPI, type Company } from '../../lib/pocketbase';
import { renderStars } from '../../utils/starUtils';

interface Industry {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export default function CompaniesClient() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('-totalReviews,-averageRating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const companySizes = [
    { value: '1-10', label: '1-10 nhân viên' },
    { value: '11-50', label: '11-50 nhân viên' },
    { value: '51-200', label: '51-200 nhân viên' },
    { value: '201-500', label: '201-500 nhân viên' },
    { value: '501-1000', label: '501-1000 nhân viên' },
    { value: '1001-5000', label: '1001-5000 nhân viên' },
    { value: '5000+', label: '5000+ nhân viên' },
  ];

  const loadIndustries = useCallback(async () => {
    try {
      const response = await industryAPI.getAll();
      setIndustries(response as unknown as Industry[]);
    } catch (error: any) {
      if (!error.message?.includes('autocancelled')) {
        console.error('Error loading industries:', error);
      }
    }
  }, []);

  const loadCompanies = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      if (searchQuery || selectedIndustry || selectedSize || minRating > 0) {
        // Use search with filters
        const filters: any = {};
        if (selectedIndustry) filters.industry = selectedIndustry;
        if (selectedSize) filters.companySize = selectedSize;
        if (minRating > 0) filters.minRating = minRating;

        const response = await companyAPI.search(searchQuery || '', filters, sortBy);
        setCompanies(response.items as unknown as Company[]);
        setTotalPages(response.totalPages);
      } else {
        // Get all companies with pagination
        const response = await companyAPI.getAll(currentPage, 20, '', sortBy);
        setCompanies(response.items as unknown as Company[]);
        setTotalPages(response.totalPages);
      }
    } catch (error: any) {
      if (!error.name?.includes('AbortError') && !error.message?.includes('autocancelled')) {
        console.error('Error loading companies:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedIndustry, selectedSize, minRating, currentPage, sortBy]);

  useEffect(() => {
    loadIndustries();
  }, []);

  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce the API call by 300ms
    searchTimeoutRef.current = setTimeout(() => {
      loadCompanies();
    }, 300);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [loadCompanies]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top smoothly when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    setSelectedSize('');
    setMinRating(0);
    setSortBy('-totalReviews,-averageRating');
    setCurrentPage(1);
  };


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header Section - Upwork style */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {companies.length > 0 
                ? totalPages > 1 
                  ? `Trang ${currentPage}/${totalPages} - Hiển thị ${companies.length} công ty`
                  : `${companies.length} công ty`
                : 'Đang tải...'
              }
            </p>
          </div>
        </div>

        {/* Search Bar - Professional style */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm công ty theo tên hoặc mô tả..."
            className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white shadow-sm hover:shadow-md transition-shadow"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filters Row - Mobile responsive layout */}
        <div className="mb-2">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 md:hidden">Lọc theo:</span>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">Lọc theo:</span>

            {/* Filters grid for mobile */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 flex-1">
              {/* Industry Filter */}
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  handleFilterChange();
                }}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white bg-white min-w-0 active:scale-[0.98] transition-transform touch-manipulation"
              >
                <option value="">Tất cả ngành</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>

              {/* Company Size Filter */}
              <select
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  handleFilterChange();
                }}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white bg-white min-w-0 active:scale-[0.98] transition-transform touch-manipulation"
              >
                <option value="">Quy mô</option>
                {companySizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>

              {/* Rating Filter */}
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  handleFilterChange();
                }}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white bg-white min-w-0 active:scale-[0.98] transition-transform touch-manipulation"
              >
                <option value={0}>Đánh giá</option>
                <option value={4}>4+ sao</option>
                <option value={3}>3+ sao</option>
                <option value={2}>2+ sao</option>
              </select>

              {/* Sort By Filter */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleFilterChange();
                }}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white bg-white min-w-0 active:scale-[0.98] transition-transform touch-manipulation"
              >
                <option value="-totalReviews,-averageRating">Nhiều đánh giá nhất</option>
                <option value="-created">Mới nhất</option>
              </select>

              {/* Clear Filters */}
              {(selectedIndustry || selectedSize || minRating > 0 || sortBy !== '-totalReviews,-averageRating') && (
                <button
                  onClick={clearFilters}
                  className="col-span-2 md:col-span-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.96] active:bg-gray-100 dark:active:bg-gray-600 transition-all touch-manipulation"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Companies List - Upwork Style */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {companies.map((company, index) => (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:shadow-lg active:scale-[0.98] active:shadow-md active:bg-gray-50 dark:active:bg-gray-700 transition-all duration-200 p-4 sm:p-6 group touch-manipulation"
            >
              {/* Mobile-first responsive layout */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Header row for mobile - Logo, Title and Rating */}
                <div className="flex items-start justify-between sm:hidden">
                  {/* Logo + Title on mobile */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-600">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {company.name}
                      </h3>
                      {/* Industry Tag on mobile */}
                      {company.expand?.industry && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md mt-1"
                          style={{
                            backgroundColor: company.expand.industry.color + '15' || '#F3F4F6',
                            color: company.expand.industry.color || '#6B7280'
                          }}
                        >
                          {company.expand.industry.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating on mobile - compact */}
                  <div className="flex flex-col items-end text-right">
                    {(company.averageRating ?? 0) > 0 ? (
                      <>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {company.averageRating?.toFixed(1)}
                          </span>
                          {renderStars(company.averageRating || 0, 'sm')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {company.totalReviews ?? 0} đánh giá
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        Chưa có đánh giá
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop layout - Logo */}
                <div className="relative flex-shrink-0 hidden sm:block">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-600">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-7 w-7 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Desktop Company Header */}
                  <div className="mb-3 hidden sm:block">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xl leading-tight mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {company.name}
                    </h3>

                    {/* Industry Tag for desktop */}
                    {company.expand?.industry && (
                      <span
                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg"
                        style={{
                          backgroundColor: company.expand.industry.color + '15' || '#F3F4F6',
                          color: company.expand.industry.color || '#6B7280'
                        }}
                      >
                        {company.expand.industry.name}
                      </span>
                    )}
                  </div>

                  {/* Company Description Preview */}
                  {company.description && (
                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                        {company.description.replace(/<[^>]*>/g, '').substring(0, 200)}
                        {company.description.length > 200 ? '...' : ''}
                      </p>
                    </div>
                  )}

                  {/* Company Details - Mobile optimized */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {company.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{company.location}</span>
                      </div>
                    )}

                    {company.companySize && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{company.companySize}</span>
                      </div>
                    )}

                    {(company.totalReviews ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5 sm:hidden">
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span>{company.totalReviews} đánh giá</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Rating Section */}
                <div className="hidden sm:flex flex-col items-end justify-start flex-shrink-0">
                  {(company.averageRating ?? 0) > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {company.averageRating?.toFixed(1)}
                        </span>
                        <div className="flex items-center">
                          {renderStars(company.averageRating || 0, 'sm')}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                        Dựa trên {company.totalReviews ?? 0} đánh giá
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm text-gray-400 dark:text-gray-500 mb-1">
                        Chưa có đánh giá
                      </div>
                      <div className="text-xs text-gray-400">
                        Hãy là người đầu tiên
                      </div>
                    </div>
                  )}

                  {/* Action indicator */}
                  <div className="mt-3 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Xem chi tiết →</span>
                  </div>
                </div>

                {/* Mobile action indicator */}
                <div className="sm:hidden text-center mt-2 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Xem chi tiết →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination - Enhanced style similar to congtytui.me */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-12 mb-8 gap-4">
          {/* Page info text */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trang {currentPage} của {totalPages}
          </p>
          
          {/* Pagination controls */}
          <div className="flex flex-wrap items-center justify-center gap-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-2 shadow-sm">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title="Trang trước"
            >
              ‹
            </button>

            {/* First page */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/20"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Page numbers around current page */}
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              
              if (totalPages <= 7) {
                // Show all pages if total pages <= 7
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                // Show first 5 pages + last 2
                if (i < 5) {
                  pageNum = i + 1;
                } else {
                  return null; // Will show ellipsis and last pages separately
                }
              } else if (currentPage >= totalPages - 3) {
                // Show first 2 + last 5 pages
                if (i < 2) {
                  return null; // Will show first pages separately
                } else {
                  pageNum = totalPages - 6 + i;
                }
              } else {
                // Show current page ± 2
                pageNum = currentPage - 3 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50 dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/20'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Last page */}
            {currentPage < totalPages - 2 && totalPages > 7 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="flex items-center justify-center w-9 h-9 text-sm text-gray-400">
                    ...
                  </span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-green-400 dark:hover:bg-green-900/20"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next button */}
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-9 h-9 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              title="Trang sau"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* No Results - Enhanced */}
      {companies.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy công ty phù hợp
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc để tìm thấy nhiều kết quả hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 active:scale-[0.96] active:bg-green-800 transition-all shadow-md touch-manipulation"
              >
                Xóa tất cả bộ lọc
              </button>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-[0.96] active:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600 transition-all touch-manipulation"
              >
                Xóa từ khóa tìm kiếm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}