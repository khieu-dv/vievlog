import { useState, useEffect, useCallback } from 'react';

export const useRoadmapProgress = (userId?: string) => {
  const [completedPosts, setCompletedPosts] = useState<Set<string>>(() => new Set());

  const getStorageKey = useCallback(() => {
    return `roadmap_completed_${userId ?? 'anonymous'}`;
  }, [userId]);

  // Load completion status from localStorage
  const loadCompletionStatus = useCallback(() => {
    try {
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        const completedArray = JSON.parse(stored) as string[];
        setCompletedPosts(new Set(completedArray));
      } else {
        setCompletedPosts(new Set());
      }
    } catch (error) {
      console.error('Error loading completion status:', error);
      setCompletedPosts(new Set());
    }
  }, [getStorageKey]);

  // Save completion status to localStorage
  const saveCompletionStatus = useCallback((newCompletedPosts: Set<string>) => {
    try {
      const key = getStorageKey();
      const completedArray = Array.from(newCompletedPosts);
      localStorage.setItem(key, JSON.stringify(completedArray));
      
      // Dispatch a custom event to notify other components
      const event = new CustomEvent('roadmapProgressUpdate', {
        detail: { userId, completedPosts: completedArray }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving completion status:', error);
    }
  }, [getStorageKey, userId]);

  // Toggle completion status for a post
  const togglePostCompletion = useCallback((postId: string) => {
    setCompletedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      
      // Save to localStorage
      saveCompletionStatus(newSet);
      
      return newSet;
    });
  }, [saveCompletionStatus]);

  // Check if a post is completed
  const isPostCompleted = useCallback((postId: string) => {
    return completedPosts.has(postId);
  }, [completedPosts]);

  // Get progress statistics
  const getProgressStats = useCallback((totalPosts: number) => {
    const completed = completedPosts.size;
    const progress = totalPosts > 0 ? Math.round((completed / totalPosts) * 100) : 0;
    return { total: totalPosts, completed, progress };
  }, [completedPosts]);

  // Load completion status on mount and user change
  useEffect(() => {
    loadCompletionStatus();
  }, [loadCompletionStatus]);

  // Listen for custom progress update events
  useEffect(() => {
    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string; completedPosts: string[] }>;
      const { userId: eventUserId, completedPosts: eventCompletedPosts } = customEvent.detail;
      if (eventUserId === userId) {
        setCompletedPosts(new Set(eventCompletedPosts));
      }
    };

    window.addEventListener('roadmapProgressUpdate', handleProgressUpdate);
    return () => window.removeEventListener('roadmapProgressUpdate', handleProgressUpdate);
  }, [userId]);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey()) {
        loadCompletionStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [getStorageKey, loadCompletionStatus]);

  // Reload when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      loadCompletionStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadCompletionStatus]);

  return {
    completedPosts,
    togglePostCompletion,
    isPostCompleted,
    getProgressStats,
    loadCompletionStatus
  };
};