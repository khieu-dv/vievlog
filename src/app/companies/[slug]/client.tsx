'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  Users,
  MapPin,
  Building2,
  ThumbsUp,
  MessageSquare,
  Award,
  Heart,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { companyAPI, reviewAPI, type Company, type Review } from '../../../lib/pocketbase';
import { formatTextContent, getAvatarLetter } from '../../../utils/textUtils';
import { renderStars, renderRatingSelector } from '../../../utils/starUtils';
import { renderRatingBar } from '../../../utils/ratingUtils';

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

  /**
   * Toggles the visibility of replies for a specific review
   * @param reviewId - The ID of the review to toggle replies for
   */
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

  /**
   * Submits a new comment/reply with optimistic UI updates
   * @param reviewId - The ID of the review to add the comment to
   */
  const submitAddComment = async (reviewId: string) => {
    const content = addCommentContents[reviewId];
    if (!content || !content.trim()) return;

    const tempContent = content;
    const tempAuthor = addCommentAuthors[reviewId] || 'Ẩn danh';
    
    // Create optimistic reply immediately
    const optimisticReply = {
      id: `temp_reply_${Date.now()}`,
      author: tempAuthor,
      content: tempContent.trim(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      replyDate: new Date().toISOString(),
      review: reviewId,
      isOptimistic: true,
      authorType: 'user',
      isOfficial: false
    } as any; // Type assertion for optimistic update

    // Immediately add reply to the review and close form
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const currentReplies = review.expand?.review_replies || [];
        return {
          ...review,
          expand: {
            ...review.expand,
            review_replies: [...currentReplies, optimisticReply] as any
          }
        } as any;
      }
      return review;
    }) as any);

    // Close form and clear content
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

    // API call in background
    try {
      const realReply = await reviewAPI.createReply({
        review: reviewId,
        author: tempAuthor,
        content: tempContent.trim().replace(/\n/g, '\n'),
        authorType: 'user'
      });

      // Replace optimistic reply with real one
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId && review.expand?.review_replies) {
          const updatedReplies = review.expand.review_replies.map(reply => 
            reply.id === optimisticReply.id ? (realReply as any) : reply
          );
          return {
            ...review,
            expand: {
              ...review.expand,
              review_replies: updatedReplies as any
            }
          } as any;
        }
        return review;
      }) as any);

    } catch (error) {
      console.error('Error submitting add comment:', error);
      // Remove optimistic reply and restore form
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId && review.expand?.review_replies) {
          const filteredReplies = review.expand.review_replies.filter(reply => reply.id !== optimisticReply.id);
          return {
            ...review,
            expand: {
              ...review.expand,
              review_replies: filteredReplies as any
            }
          } as any;
        }
        return review;
      }) as any);
      
      // Restore form
      setAddCommentForms(prev => new Set([...prev, reviewId]));
      setAddCommentContents(prev => ({
        ...prev,
        [reviewId]: tempContent
      }));
      setAddCommentAuthors(prev => ({
        ...prev,
        [reviewId]: tempAuthor
      }));
      alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.');
    }
  };


  /**
   * Updates a specific field in the review form
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const updateReviewForm = (field: string, value: any) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  /**
   * Scrolls to the reviews section smoothly
   */
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

  /**
   * Submits a new review with optimistic UI updates
   * Creates an optimistic review immediately and replaces with real data on success
   */
  const submitReview = async () => {
    if (reviewForm.overallRating === 0) return;
    if (!company) return;

    const tempReviewForm = { ...reviewForm };
    
    // Create optimistic review immediately
    const optimisticReview = {
      id: `temp_${Date.now()}`, // Temporary ID
      author: tempReviewForm.authorName,
      overallRating: tempReviewForm.overallRating,
      generalContent: tempReviewForm.generalContent,
      isAnonymous: tempReviewForm.isAnonymous,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      reviewDate: new Date().toISOString(),
      company: company?.id || '',
      isOptimistic: true, // Flag to identify optimistic updates
      expand: { review_replies: [] }
    } as any; // Type assertion for optimistic update

    // Immediately add to reviews list and hide form
    setReviews(prev => [optimisticReview, ...prev] as any);
    setShowReviewForm(false);
    setReviewForm({
      overallRating: 0,
      generalContent: '',
      authorName: 'Ẩn danh',
      isAnonymous: false
    });

    // API call in background
    try {
      const realReview = await reviewAPI.create({
        company: company.id,
        author: tempReviewForm.authorName,
        overallRating: tempReviewForm.overallRating,
        generalContent: tempReviewForm.generalContent.replace(/\n/g, '\n'),
        isAnonymous: tempReviewForm.isAnonymous
      });

      // Replace optimistic review with real one
      setReviews(prev => prev.map(review => 
        review.id === optimisticReview.id ? { ...realReview, expand: { review_replies: [] } } as any : review
      ) as any);

    } catch (error) {
      console.error('Error submitting review:', error);
      // Remove optimistic review and restore form
      setReviews(prev => prev.filter(review => review.id !== optimisticReview.id) as any);
      setShowReviewForm(true);
      setReviewForm(tempReviewForm);
      alert('Có lỗi xảy ra khi đăng đánh giá. Vui lòng thử lại.');
    }
  };


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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
          {/* Company Info Row - Mobile responsive */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            {/* Company Logo - Mobile optimized */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
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
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 text-center sm:text-left">
                {company.name}
              </h1>

              {/* Company Attributes - Mobile centered */}
              <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4 text-center sm:text-left">
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

              {/* Company Description - Responsive */}
              {company.description && (
                <div className="mb-4">
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center sm:text-left">
                    {formatTextContent(company.description.substring(0, 200) + (company.description.length > 200 ? '...' : ''))}
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
              {/* Rating and Author - Mobile stacked */}
              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đánh giá tổng quan
                  </label>
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
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
                <div>
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

              {/* Anonymous option and Submit button - Mobile responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 justify-center sm:justify-start">
                  <input
                    type="checkbox"
                    checked={reviewForm.isAnonymous}
                    onChange={(e) => updateReviewForm('isAnonymous', e.target.checked)}
                    className="mr-2 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                  />
                  Đánh giá ẩn danh
                </label>

                <div className="flex items-center justify-center sm:justify-end gap-3">
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
                    disabled={reviewForm.overallRating === 0 || !reviewForm.generalContent.trim()}
                    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    Gửi đánh giá
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
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div className="space-y-3">
              {renderRatingBar('Môi trường', company.expand.company_stats[0].averageWorkEnvironment || 0)}
              {renderRatingBar('Lương thưởng', company.expand.company_stats[0].averageCompensation || 0)}
              {renderRatingBar('Quản lý', company.expand.company_stats[0].averageManagement || 0)}
              {renderRatingBar('Phát triển', company.expand.company_stats[0].averageCareerGrowth || 0)}
              {renderRatingBar('Cân bằng', company.expand.company_stats[0].averageWorkLifeBalance || 0)}
              {renderRatingBar('Khuyến nghị', company.expand.company_stats[0].recommendationPercentage || 0, 100)}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm" data-reviews-section>
        <div className="border-b border-gray-100 dark:border-gray-700 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white text-center sm:text-left">
              Đánh giá từ nhân viên ({company.totalReviews || 0})
            </h2>

            {/* Rating Filter */}
            <select
              className="px-4 py-2.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white bg-white shadow-sm mx-auto sm:mx-0"
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

        <div className="p-4 sm:p-8">
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
                        } ${(review as any)?.isOptimistic ? 'opacity-80 border-l-4 border-blue-400 pl-4 bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
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
                            {(review as any)?.isOptimistic 
                              ? 'Đang đăng...'
                              : review.reviewDate && new Date(review.reviewDate).toLocaleDateString('vi-VN')
                            }
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
                              <div 
                                key={reply.id} 
                                className={`ml-3 sm:ml-6 border-l-2 border-gray-200 dark:border-gray-600 pl-3 sm:pl-4 pt-3 pb-2 ${(reply as any)?.isOptimistic ? 'opacity-80 bg-green-50/30 dark:bg-green-900/10' : ''}`}
                              >
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
                                        {(reply as any)?.isOptimistic 
                                          ? 'Đang gửi...'
                                          : reply.replyDate
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
                          <div className="ml-3 sm:ml-6 mt-3 pt-2 border-l-2 border-gray-200 dark:border-gray-600 pl-3 sm:pl-4">
                            <button
                              onClick={() => toggleAddCommentForm(review.id)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                            >
                              {addCommentForms.has(review.id) ? 'Hủy' : '+ Thêm bình luận'}
                            </button>
                          </div>

                          {/* Add Comment Form - Mobile optimized */}
                          {addCommentForms.has(review.id) && (
                            <div className="ml-3 sm:ml-6 mt-3 pl-3 sm:pl-4 border-l-2 border-blue-200 dark:border-blue-600">
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-700">
                                <div className="space-y-3">
                                  {/* Mobile-first layout - Stack everything */}
                                  <div className="flex items-center gap-2">
                                    {/* User Avatar - smaller on mobile */}
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                      <span className="text-white text-xs sm:text-sm font-medium">
                                        {getAvatarLetter(addCommentAuthors[review.id] || 'Ẩn danh')}
                                      </span>
                                    </div>
                                    
                                    {/* Author name input - wider on mobile */}
                                    <input
                                      type="text"
                                      value={addCommentAuthors[review.id] || ''}
                                      onChange={(e) => handleAddCommentAuthorChange(review.id, e.target.value)}
                                      placeholder="Tên hiển thị"
                                      className="flex-1 sm:w-32 sm:flex-none px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-colors"
                                    />
                                  </div>

                                  {/* Content textarea */}
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

                                  {/* Actions - Mobile responsive */}
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                                    <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center sm:justify-start gap-1">
                                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                      Ctrl+Enter để gửi nhanh
                                    </span>
                                    <div className="flex justify-center sm:justify-end gap-2">
                                      <button
                                        onClick={() => toggleAddCommentForm(review.id)}
                                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                      >
                                        Hủy
                                      </button>
                                      <button
                                        onClick={() => submitAddComment(review.id)}
                                        disabled={!addCommentContents[review.id]?.trim()}
                                        className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                                      >
                                        Gửi
                                      </button>
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