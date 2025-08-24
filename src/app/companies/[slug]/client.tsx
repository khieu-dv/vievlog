'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Star, 
  Users, 
  MapPin, 
  Building2, 
  Globe, 
  Calendar,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Award,
  Heart,
  ArrowLeft,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { companyAPI, type Company, type Review } from '../../../lib/pocketbase';

interface Props {
  slug: string;
}

export default function CompanyDetailClient({ slug }: Props) {
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRating, setFilterRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCompanyData();
  }, [slug]);

  useEffect(() => {
    if (company) {
      loadReviews();
    }
  }, [company, currentPage, filterRating]);

  const loadCompanyData = async () => {
    try {
      const companyData = await companyAPI.getBySlug(slug);
      if (!companyData) {
        notFound();
      }
      setCompany(companyData as unknown as Company);
    } catch (error) {
      console.error('Error loading company:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!company) return;
    
    setReviewsLoading(true);
    try {
      const response = await companyAPI.getReviews(company.id, currentPage, 10);
      setReviews(response.items as unknown as Review[]);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClass = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }[size];

    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${sizeClass} ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingBar = (label: string, rating: number, maxRating: number = 5) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 w-32">{label}</span>
      <div className="flex-1 mx-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(rating / maxRating) * 100}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
        {rating.toFixed(1)}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Company Header Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mr-6"></div>
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          
          {/* Reviews Skeleton */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!company) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/companies"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Về danh sách công ty
      </Link>

      {/* Company Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          {/* Company Logo & Info */}
          <div className="flex items-center mb-4 md:mb-0 md:mr-8">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg mr-6 flex items-center justify-center overflow-hidden">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-sm gap-4">
                {company.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location}
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {company.companySize} nhân viên
                  </div>
                )}
                {company.founded && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Thành lập {company.founded}
                  </div>
                )}
                {company.website && (
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="flex-1 md:max-w-sm">
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white mr-2">
                  {company.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <div className="flex items-center">
                  {renderStars(company.averageRating || 0, 'lg')}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Dựa trên {company.totalReviews || 0} đánh giá
              </p>
            </div>
          </div>
        </div>

        {/* Company Description */}
        {company.description && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div 
              className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: company.description.substring(0, 500) + (company.description.length > 500 ? '...' : '')
              }}
            />
          </div>
        )}

        {/* Industry Badge */}
        {company.expand?.industry && (
          <div className="mt-4">
            <span 
              className="inline-block px-3 py-1 text-sm font-medium rounded-full text-white"
              style={{ backgroundColor: company.expand.industry.color || '#6B7280' }}
            >
              {company.expand.industry.name}
            </span>
          </div>
        )}
      </div>

      {/* Detailed Ratings */}
      {company.expand?.company_stats && company.expand.company_stats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Đánh giá chi tiết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderRatingBar('Môi trường', company.expand.company_stats[0].averageWorkEnvironment || 0)}
              {renderRatingBar('Lương thưởng', company.expand.company_stats[0].averageCompensation || 0)}
              {renderRatingBar('Quản lý', company.expand.company_stats[0].averageManagement || 0)}
            </div>
            <div>
              {renderRatingBar('Phát triển', company.expand.company_stats[0].averageCareerGrowth || 0)}
              {renderRatingBar('Cân bằng', company.expand.company_stats[0].averageWorkLifeBalance || 0)}
              {renderRatingBar('Khuyến nghị', company.expand.company_stats[0].recommendationPercentage || 0, 100)}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Đánh giá từ nhân viên ({company.totalReviews || 0})
          </h2>
          
          {/* Rating Filter */}
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
          >
            <option value={0}>Tất cả đánh giá</option>
            <option value={5}>5 sao</option>
            <option value={4}>4 sao</option>
            <option value={3}>3 sao</option>
            <option value={2}>2 sao</option>
            <option value={1}>1 sao</option>
          </select>
        </div>

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="space-y-6">
              {reviews.map((review, index) => {
                const isExpanded = expandedReviews.has(review.id);
                const hasLongContent = (review.pros?.length || 0) + (review.cons?.length || 0) + (review.generalContent?.length || 0) > 500;
                
                return (
                  <div 
                    key={review.id}
                    className={`border-b border-gray-200 dark:border-gray-700 pb-6 ${
                      index === reviews.length - 1 ? 'border-b-0 pb-0' : ''
                    }`}
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-medium text-gray-900 dark:text-white mr-3">
                              {review.author}
                            </span>
                            <div className="flex items-center mr-3">
                              {renderStars(review.overallRating)}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {review.overallRating}/5
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-3">
                            {review.position && (
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                                {review.position}
                              </span>
                            )}
                            {review.workDuration && (
                              <span>Làm việc: {review.workDuration}</span>
                            )}
                            {review.employmentStatus && (
                              <span>
                                {review.employmentStatus === 'current_employee' ? 'Nhân viên hiện tại' :
                                 review.employmentStatus === 'former_employee' ? 'Cựu nhân viên' :
                                 review.employmentStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {review.reviewDate && new Date(review.reviewDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Review Title */}
                    {review.reviewTitle && (
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        {review.reviewTitle}
                      </h3>
                    )}

                    {/* Review Content */}
                    <div className={`space-y-4 ${!isExpanded && hasLongContent ? 'max-h-48 overflow-hidden relative' : ''}`}>
                      {review.generalContent && (
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {review.generalContent.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      )}

                      {review.pros && (
                        <div>
                          <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Ưu điểm
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 pl-6">
                            {review.pros.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      )}

                      {review.cons && (
                        <div>
                          <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Nhược điểm
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 pl-6">
                            {review.cons.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      )}

                      {review.advice && (
                        <div>
                          <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-2" />
                            Lời khuyên cho ban lãnh đạo
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 pl-6">
                            {review.advice.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      )}

                      {!isExpanded && hasLongContent && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
                      )}
                    </div>

                    {/* Detailed Ratings */}
                    {review.expand?.review_ratings && review.expand.review_ratings.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {review.expand.review_ratings[0].workEnvironment && (
                            <div className="flex items-center">
                              <span className="text-gray-600 dark:text-gray-400 mr-2">Môi trường:</span>
                              <div className="flex items-center">
                                {renderStars(review.expand.review_ratings[0].workEnvironment, 'sm')}
                              </div>
                            </div>
                          )}
                          {review.expand.review_ratings[0].compensation && (
                            <div className="flex items-center">
                              <span className="text-gray-600 dark:text-gray-400 mr-2">Lương:</span>
                              <div className="flex items-center">
                                {renderStars(review.expand.review_ratings[0].compensation, 'sm')}
                              </div>
                            </div>
                          )}
                          {review.expand.review_ratings[0].management && (
                            <div className="flex items-center">
                              <span className="text-gray-600 dark:text-gray-400 mr-2">Quản lý:</span>
                              <div className="flex items-center">
                                {renderStars(review.expand.review_ratings[0].management, 'sm')}
                              </div>
                            </div>
                          )}
                          {review.expand.review_ratings[0].careerGrowth && (
                            <div className="flex items-center">
                              <span className="text-gray-600 dark:text-gray-400 mr-2">Phát triển:</span>
                              <div className="flex items-center">
                                {renderStars(review.expand.review_ratings[0].careerGrowth, 'sm')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    {hasLongContent && (
                      <button
                        onClick={() => toggleReviewExpansion(review.id)}
                        className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Thu gọn <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Xem thêm <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        {(review.helpfulCount || 0) > 0 && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {review.helpfulCount} người thấy hữu ích
                          </div>
                        )}
                        {review.isVerified && (
                          <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                            <Award className="h-4 w-4 mr-1" />
                            Đã xác minh
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Replies */}
                    {review.expand?.review_replies && review.expand.review_replies.length > 0 && (
                      <div className="mt-4 ml-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <div className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                          Phản hồi từ {company.name}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                          {review.expand.review_replies[0].content.replace(/<[^>]*>/g, '')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
          </>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có đánh giá nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy là người đầu tiên đánh giá công ty này
            </p>
          </div>
        )}
      </div>
    </div>
  );
}