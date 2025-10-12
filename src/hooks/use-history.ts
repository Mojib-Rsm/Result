
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/types';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const VISIT_SESSION_KEY = 'visit-counted';
const STATS_KEY = 'bd-results-stats';
const LOCAL_HISTORY_KEY = 'bd-results-history-local';

export function useHistory() {
  const [isInitialized, setIsInitialized] = useState(false);
  const db = getFirestore(app);

  useEffect(() => {
    // This effect runs only on the client side after hydration.
    // All localStorage/sessionStorage logic is moved here.
    
    // Increment visit count
    try {
      if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
        const statsRaw = localStorage.getItem(STATS_KEY);
        const stats = statsRaw ? JSON.parse(statsRaw) : { visits: 0, searches: 0 };
        stats.visits += 1;
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
      }
    } catch (error) {
      console.error("Local visit count increment failed: ", error);
    }

    setIsInitialized(true);
  }, []);

  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'timestamp'>) => {
    if (typeof window === 'undefined') return;

    const itemWithTimestamp: HistoryItem = { ...item, timestamp: Date.now() };

    // Save to Firestore
    try {
        await addDoc(collection(db, "search-history"), itemWithTimestamp);
    } catch (error) {
        console.error("Firestore history write failed: ", error);
    }
    
    try {
      // Increment search count in localStorage
      const statsRaw = localStorage.getItem(STATS_KEY);
      const stats = statsRaw ? JSON.parse(statsRaw) : { visits: 0, searches: 0 };
      stats.searches += 1;
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));

      // Add to local history
      const existingHistoryRaw = localStorage.getItem(LOCAL_HISTORY_KEY);
      const existingHistory: HistoryItem[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      
      const isDuplicate = existingHistory.some(h => 
          h.roll === item.roll && h.reg === item.reg && h.exam === item.exam && 
          h.year === item.year && h.board === item.board
      );

      if (!isDuplicate) {
          const newHistory = [itemWithTimestamp, ...existingHistory].slice(0, 50); // Store last 50
          localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(newHistory));
      }
    } catch (error) {
       console.error("Local history write failed: ", error);
    }
  }, [db]);

  const removeHistoryItem = useCallback((timestamp: number) => {
    if (typeof window === 'undefined') return;
    try {
        const existingHistoryRaw = localStorage.getItem(LOCAL_HISTORY_KEY);
        let existingHistory: HistoryItem[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
        existingHistory = existingHistory.filter(item => item.timestamp !== timestamp);
        localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(existingHistory));
    } catch(e) {
        console.error("Could not remove item from local history", e)
    }
  }, []);

  const clearHistory = useCallback(() => {
     if (typeof window === 'undefined') return;
      try {
          localStorage.removeItem(LOCAL_HISTORY_KEY);
          // Also reset stats when clearing history
          const statsRaw = localStorage.getItem(STATS_KEY);
          if (statsRaw) {
              const stats = JSON.parse(statsRaw);
              stats.searches = 0;
              localStorage.setItem(STATS_KEY, JSON.stringify(stats));
          }
      } catch(e) {
          console.error("Could not clear local data", e)
      }
  }, []);

  return { addHistoryItem, removeHistoryItem, clearHistory, isInitialized };
}
