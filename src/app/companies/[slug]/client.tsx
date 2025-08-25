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
  ChevronUp,
  X
} from 'lucide-react';
import { companyAPI, reviewAPI, type Company, type Review } from '../../../lib/pocketbase';

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
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set());
  const [submittingReplies, setSubmittingReplies] = useState<Set<string>>(new Set());
  const [addCommentForms, setAddCommentForms] = useState<Set<string>>(new Set());
  const [addCommentContents, setAddCommentContents] = useState<Record<string, string>>({});
  const [addCommentAuthors, setAddCommentAuthors] = useState<Record<string, string>>({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    overallRating: 0,
    generalContent: '',
    authorName: 'Ẩn danh',
    isAnonymous: false
  });
  const [submittingReview, setSubmittingReview] = useState(false);

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
      const response = await companyAPI.getReviews(company.id, currentPage, 10, filterRating);
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

  const toggleRepliesVisibility = (reviewId: string) => {
    const newShowReplies = new Set(showReplies);
    if (newShowReplies.has(reviewId)) {
      newShowReplies.delete(reviewId);
    } else {
      newShowReplies.add(reviewId);
    }
    setShowReplies(newShowReplies);
  };



  const toggleAddCommentForm = (reviewId: string) => {
    const newAddCommentForms = new Set(addCommentForms);
    if (newAddCommentForms.has(reviewId)) {
      newAddCommentForms.delete(reviewId);
      // Clear content and author when closing form
      const newContents = { ...addCommentContents };
      const newAuthors = { ...addCommentAuthors };
      delete newContents[reviewId];
      delete newAuthors[reviewId];
      setAddCommentContents(newContents);
      setAddCommentAuthors(newAuthors);
    } else {
      newAddCommentForms.add(reviewId);
      // Set default author name when opening form
      setAddCommentAuthors(prev => ({
        ...prev,
        [reviewId]: 'Ẩn danh'
      }));
    }
    setAddCommentForms(newAddCommentForms);
  };

  const handleAddCommentContentChange = (reviewId: string, content: string) => {
    setAddCommentContents(prev => ({
      ...prev,
      [reviewId]: content
    }));
  };

  const handleAddCommentAuthorChange = (reviewId: string, author: string) => {
    setAddCommentAuthors(prev => ({
      ...prev,
      [reviewId]: author
    }));
  };

  const submitAddComment = async (reviewId: string) => {
    const content = addCommentContents[reviewId];
    if (!content || !content.trim()) return;

    setSubmittingReplies(prev => new Set([...prev, reviewId]));

    try {
      // Create reply using actual API (preserve line breaks)
      await reviewAPI.createReply({
        review: reviewId,
        author: addCommentAuthors[reviewId] || 'Ẩn danh',
        content: content.trim().replace(/\n/g, '\n'),
        authorType: 'user'
      });

      // Success - close form and clear content
      setAddCommentForms(prev => {
        const newForms = new Set(prev);
        newForms.delete(reviewId);
        return newForms;
      });

      setAddCommentContents(prev => {
        const newContents = { ...prev };
        delete newContents[reviewId];
        return newContents;
      });

      setAddCommentAuthors(prev => {
        const newAuthors = { ...prev };
        delete newAuthors[reviewId];
        return newAuthors;
      });

      // Reload reviews to show new reply
      await loadReviews();

    } catch (error) {
      console.error('Error submitting add comment:', error);
      alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
    } finally {
      setSubmittingReplies(prev => {
        const newSubmitting = new Set(prev);
        newSubmitting.delete(reviewId);
        return newSubmitting;
      });
    }
  };


  const updateReviewForm = (field: string, value: any) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Utility function to format text content with line breaks
  const formatTextContent = (content: string) => {
    if (!content) return '';

    // Remove HTML tags but preserve line breaks
    const cleanText = content.replace(/<[^>]*>/g, '');

    // Split by line breaks and preserve empty lines for spacing
    const lines = cleanText.split(/\r?\n/);

    return lines.map((line, index) => (
      <span key={index}>
        {line.trim() === '' ? '\u00A0' : line} {/* Non-breaking space for empty lines */}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  // Utility function to get avatar letter
  const getAvatarLetter = (name: string) => {
    if (!name || name === 'Ẩn danh') return 'A';
    return name.charAt(0).toUpperCase();
  };

  // Utility function to scroll to reviews section smoothly
  const scrollToReviews = () => {
    // Try to find the reviews section and scroll to it
    const reviewsSection = document.querySelector('[data-reviews-section]');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const submitReview = async () => {
    if (reviewForm.overallRating === 0) return;
    if (!company) return;

    setSubmittingReview(true);

    try {
      // Create review using actual API (preserve line breaks)
      await reviewAPI.create({
        company: company.id,
        author: reviewForm.authorName,
        overallRating: reviewForm.overallRating,
        generalContent: reviewForm.generalContent.replace(/\n/g, '\n'),
        isAnonymous: reviewForm.isAnonymous
      });

      // Success - hide form, reset form and reload reviews
      setShowReviewForm(false);
      setReviewForm({
        overallRating: 0,
        generalContent: '',
        authorName: 'Ẩn danh',
        isAnonymous: false
      });
      await loadReviews();

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi đăng đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmittingReview(false);
    }
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
        className={`${sizeClass} ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  const renderRatingSelector = (currentRating: number, onRatingChange: (rating: number) => void) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange(i + 1)}
        className="p-1 hover:scale-110 transition-transform"
      >
        <Star
          className={`h-6 w-6 ${i < currentRating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-200'
            }`}
        />
      </button>
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

      {/* Company Header - Merged with Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6">
          {/* Company Info Row */}
          <div className="flex items-start gap-4 mb-6">
            {/* Company Logo */}
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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

            {/* Company Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 truncate">
                {company.name}
              </h1>

              {/* Company Attributes */}
              <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {company.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{company.companySize}</span>
                  </div>
                )}
                {company.expand?.industry && (
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    <span
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: company.expand.industry.color || '#6B7280' }}
                    >
                      {company.expand.industry.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Company Description - Hidden on small screens */}
              {company.description && (
                <div className="mb-4 hidden sm:block">
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {formatTextContent(company.description.substring(0, 300) + (company.description.length > 300 ? '...' : ''))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions - Removed Write Review Button */}
            <div className="flex flex-col gap-3">
            </div>
          </div>

          {/* Rating Summary Bar */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {company.averageRating?.toFixed(1) || 'N/A'}
                  </span>
                  <div className="flex items-center">
                    {renderStars(company.averageRating || 0, 'md')}
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({company.totalReviews || 0} đánh giá)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{showReviewForm ? 'Ẩn form đánh giá' : 'Viết đánh giá'}</span>
        </button>
      </div>

      {/* Inline Review Form - Compact Design */}
      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Viết đánh giá cho {company?.name}
            </h2>
            
            <div className="space-y-4">
              {/* Rating and Author in one row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Rating */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đánh giá tổng quan
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateReviewForm('overallRating', star)}
                        className={`p-1 transition-colors ${
                          star <= reviewForm.overallRating
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      ({reviewForm.overallRating}/5)
                    </span>
                  </div>
                </div>

                {/* Author Name */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={reviewForm.authorName}
                    onChange={(e) => updateReviewForm('authorName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white transition-colors"
                    placeholder="Tên của bạn"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nội dung đánh giá
                </label>
                <textarea
                  value={reviewForm.generalContent}
                  onChange={(e) => updateReviewForm('generalContent', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:text-white resize-none transition-colors"
                  placeholder="Chia sẻ trải nghiệm của bạn về công ty này..."
                />
              </div>

              {/* Anonymous option and Submit button */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={reviewForm.isAnonymous}
                    onChange={(e) => updateReviewForm('isAnonymous', e.target.checked)}
                    className="mr-2 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  Đánh giá ẩn danh
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewForm({
                        overallRating: 0,
                        generalContent: '',
                        authorName: 'Ẩn danh',
                        isAnonymous: false
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  
                  <button
                    onClick={submitReview}
                    disabled={reviewForm.overallRating === 0 || !reviewForm.generalContent.trim() || submittingReview}
                    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi đánh giá'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm" data-reviews-section>
        <div className="border-b border-gray-100 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Đánh giá từ nhân viên ({company.totalReviews || 0})
            </h2>

            {/* Rating Filter */}
            <select
              className="px-4 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white bg-white shadow-sm"
              value={filterRating}
              onChange={(e) => {
                setFilterRating(Number(e.target.value));
                setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
              }}
            >
              <option value={0}>Tất cả</option>
              <option value={5}>5 sao</option>
              <option value={4}>4 sao</option>
              <option value={3}>3 sao</option>
              <option value={2}>2 sao</option>
              <option value={1}>1 sao</option>
            </select>
          </div>
        </div>

        <div className="p-8">
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
                      className={`pb-6 mb-6 ${index !== reviews.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                        }`}
                    >
                      {/* Review Header - congtytui.me style */}
                      <div className="flex items-start gap-3 mb-3">
                        {/* Avatar placeholder */}
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-white uppercase">
                            {review.author.charAt(0)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {review.author}
                            </span>
                            <div className="flex items-center">
                              {renderStars(review.overallRating, 'sm')}
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {review.reviewDate && new Date(review.reviewDate).toLocaleDateString('vi-VN')}
                          </div>
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
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {formatTextContent(review.generalContent)}
                            </p>
                          </div>
                        )}

                        {review.pros && (
                          <div>
                            <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Ưu điểm
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 pl-6 leading-relaxed">
                              {formatTextContent(review.pros)}
                            </p>
                          </div>
                        )}

                        {review.cons && (
                          <div>
                            <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Nhược điểm
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 pl-6 leading-relaxed">
                              {formatTextContent(review.cons)}
                            </p>
                          </div>
                        )}

                        {review.advice && (
                          <div>
                            <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                              <Award className="h-4 w-4 mr-2" />
                              Lời khuyên cho ban lãnh đạo
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 pl-6 leading-relaxed">
                              {formatTextContent(review.advice)}
                            </p>
                          </div>
                        )}

                        {!isExpanded && hasLongContent && (
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
                        )}
                      </div>

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

                      {/* Review Actions - congtytui.me style */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{review.expand?.['review_reactions(review)']?.reduce((acc, reaction) => acc + reaction.count, 0) || 0}</span>
                          </button>

                          <button
                            onClick={() => toggleRepliesVisibility(review.id)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>
                              {showReplies.has(review.id) ? 'Ẩn trả lời' : `Trả lời (${review.expand?.review_replies?.length || 0})`}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {review.isVerified && (
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                              <Award className="h-3 w-3 mr-1" />
                              Xác minh
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Review Replies - congtytui.me style */}
                      {showReplies.has(review.id) && (
                        <div className="mt-4">
                          {/* Show existing replies if any */}
                          {review.expand?.review_replies && review.expand.review_replies.length > 0 && (
                            <>
                              {review.expand.review_replies
                            .sort((a, b) => {
                              // Sort by replyDate first, then by created date, oldest first (newest at bottom)
                              const dateA = new Date(a.replyDate || a.created);
                              const dateB = new Date(b.replyDate || b.created);
                              return dateA.getTime() - dateB.getTime();
                            })
                            .map((reply, replyIndex) => (
                              <div key={reply.id} className="ml-6 border-l-2 border-gray-200 dark:border-gray-600 pl-4 pt-3 pb-2">
                                <div className="flex items-start gap-3">
                                  {/* Reply Avatar */}
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${reply.isOfficial || reply.authorType === 'company'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-400 text-white'
                                    }`}>
                                    {reply.author.charAt(0).toUpperCase()}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-sm font-medium ${reply.isOfficial || reply.authorType === 'company'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {reply.isOfficial || reply.authorType === 'company'
                                          ? `${company.name}`
                                          : reply.author
                                        }
                                      </span>
                                      {reply.isOfficial && (
                                        <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                                          Official
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {reply.replyDate
                                          ? new Date(reply.replyDate).toLocaleDateString('vi-VN')
                                          : new Date(reply.created).toLocaleDateString('vi-VN')
                                        }
                                      </span>
                                    </div>

                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {formatTextContent(reply.content)}
                                    </div>

                                    {/* Reply Actions */}
                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                      {reply.expand?.['review_reactions(reply)']?.[0]?.count !== undefined && (
                                        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                          <ThumbsUp className="w-3 h-3" />
                                          <span>{reply.expand['review_reactions(reply)'][0].count}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                              </div>
                            ))}
                            </>
                          )}

                          {/* Add Reply Button - Always show when replies section is open */}
                          <div className="ml-6 mt-3 pt-2 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                            <button
                              onClick={() => toggleAddCommentForm(review.id)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                            >
                              {addCommentForms.has(review.id) ? 'Hủy' : '+ Thêm bình luận'}
                            </button>
                          </div>

                          {/* Add Comment Form */}
                          {addCommentForms.has(review.id) && (
                            <div className="ml-6 mt-3 pl-4 border-l-2 border-blue-200 dark:border-blue-600">
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                                <div className="flex gap-3">
                                  {/* User Avatar */}
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <span className="text-white text-sm font-medium">
                                      {getAvatarLetter(addCommentAuthors[review.id] || 'Ẩn danh')}
                                    </span>
                                  </div>

                                  <div className="flex-1 space-y-3">
                                    {/* Author and Content in one row for compact design */}
                                    <div className="grid grid-cols-1 gap-3">
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={addCommentAuthors[review.id] || ''}
                                          onChange={(e) => handleAddCommentAuthorChange(review.id, e.target.value)}
                                          placeholder="Tên hiển thị"
                                          className="w-32 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                                        />
                                        <div className="flex-1"></div>
                                      </div>

                                      <textarea
                                        value={addCommentContents[review.id] || ''}
                                        onChange={(e) => handleAddCommentContentChange(review.id, e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && e.ctrlKey) {
                                            e.preventDefault();
                                            submitAddComment(review.id);
                                          }
                                        }}
                                        placeholder="Viết bình luận của bạn..."
                                        className="w-full p-3 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white resize-none transition-colors"
                                        rows={3}
                                      />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        Ctrl+Enter để gửi nhanh
                                      </span>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => toggleAddCommentForm(review.id)}
                                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                        >
                                          Hủy
                                        </button>
                                        <button
                                          onClick={() => submitAddComment(review.id)}
                                          disabled={!addCommentContents[review.id]?.trim() || submittingReplies.has(review.id)}
                                          className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                        >
                                          {submittingReplies.has(review.id) ? (
                                            <>
                                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                              Gửi...
                                            </>
                                          ) : (
                                            'Gửi'
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                        scrollToReviews();
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Trước
                    </button>

                    <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Trang {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        scrollToReviews();
                      }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Sau
                    </button>
                  </div>
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

    </div>
  );
}