import { useState, useEffect, useCallback } from 'react';

export const useRoadmapProgress = (userId?: string) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => new Set());

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
        setCompletedItems(new Set(completedArray));
      } else {
        setCompletedItems(new Set());
      }
    } catch (error) {
      console.error('Error loading completion status:', error);
      setCompletedItems(new Set());
    }
  }, [getStorageKey]);

  // Save completion status to localStorage
  const saveCompletionStatus = useCallback((newCompletedItems: Set<string>) => {
    try {
      const key = getStorageKey();
      const completedArray = Array.from(newCompletedItems);
      localStorage.setItem(key, JSON.stringify(completedArray));
      
      // Dispatch a custom event to notify other components
      const event = new CustomEvent('roadmapProgressUpdate', {
        detail: { userId, completedItems: completedArray }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving completion status:', error);
    }
  }, [getStorageKey, userId]);

  // Toggle completion status for an item
  const toggleItemCompletion = useCallback((itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      
      // Save to localStorage
      saveCompletionStatus(newSet);
      
      return newSet;
    });
  }, [saveCompletionStatus]);

  // Check if an item is completed
  const isItemCompleted = useCallback((itemId: string) => {
    return completedItems.has(itemId);
  }, [completedItems]);

  // Get progress statistics for specific items
  const getProgressStats = useCallback((items: { id: string }[]) => {
    // Count only completed items that are in the current items array
    const completed = items.filter(item => completedItems.has(item.id)).length;
    const total = items.length;
    const progress = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;
    return { total, completed, progress };
  }, [completedItems]);

  // Load completion status on mount and user change
  useEffect(() => {
    loadCompletionStatus();
  }, [loadCompletionStatus]);

  // Listen for custom progress update events
  useEffect(() => {
    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string; completedItems: string[] }>;
      const { userId: eventUserId, completedItems: eventCompletedItems } = customEvent.detail;
      if (eventUserId === userId) {
        setCompletedItems(new Set(eventCompletedItems));
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
    completedItems,
    toggleItemCompletion,
    isItemCompleted,
    getProgressStats,
    loadCompletionStatus
  };
};