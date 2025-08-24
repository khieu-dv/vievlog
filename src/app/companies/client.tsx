'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, Users, MapPin, Building2 } from 'lucide-react';
import { companyAPI, industryAPI, type Company } from '../../lib/pocketbase';

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

        const response = await companyAPI.search(searchQuery || '', filters);
        setCompanies(response.items as unknown as Company[]);
        setTotalPages(response.totalPages);
      } else {
        // Get all companies with pagination
        const response = await companyAPI.getAll(currentPage, 20);
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
  }, [searchQuery, selectedIndustry, selectedSize, minRating, currentPage]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('');
    setSelectedSize('');
    setMinRating(0);
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Đánh giá công ty
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Khám phá đánh giá chân thực từ nhân viên về các công ty hàng đầu
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm công ty..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ngành nghề
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">Tất cả ngành</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          {/* Company Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quy mô
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                handleFilterChange();
              }}
            >
              <option value="">Tất cả quy mô</option>
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Đánh giá tối thiểu
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={minRating}
              onChange={(e) => {
                setMinRating(Number(e.target.value));
                handleFilterChange();
              }}
            >
              <option value={0}>Tất cả đánh giá</option>
              <option value={4}>4+ sao</option>
              <option value={3}>3+ sao</option>
              <option value={2}>2+ sao</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block group"
              >
                <div className="flex items-center mb-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {company.location && (
                        <div className="flex items-center mr-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          {company.location}
                        </div>
                      )}
                      {company.companySize && (
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {company.companySize} người
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                {company.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {company.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                )}

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {renderStars(company.averageRating || 0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {company.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {company.totalReviews || 0} đánh giá
                  </span>
                </div>

                {/* Industry Badge */}
                {company.expand?.industry && (
                  <div className="mt-3">
                    <span 
                      className="inline-block px-2 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: company.expand.industry.color || '#6B7280' }}
                    >
                      {company.expand.industry.name}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Trước
              </button>
              
              <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Trang {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Sau
              </button>
            </div>
          )}

          {/* No Results */}
          {companies.length === 0 && !loading && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy công ty nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Thử thay đổi bộ lọc tìm kiếm của bạn
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}