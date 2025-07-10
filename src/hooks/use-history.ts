
'use client';

import { useState, useEffect } from 'react';
import type { HistoryItem } from '@/types';

const HISTORY_KEY = 'bd-results-history';
const VISIT_COUNT_KEY = 'app-visits';
const SEARCH_COUNT_KEY = 'app-searches';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code now runs only on the client, after the initial render.
    try {
      // Increment visit count
      const currentVisits = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
      localStorage.setItem(VISIT_COUNT_KEY, (currentVisits + 1).toString());

      // Load history
      const item = window.localStorage.getItem(HISTORY_KEY);
      if (item) {
        setHistory(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to access localStorage', error);
      setHistory([]);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
        try {
            window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Failed to save history to localStorage', error);
        }
    }
  }, [history, isInitialized]);

  const addHistoryItem = (item: HistoryItem) => {
    // Increment search count
     try {
        const currentSearches = parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || '0', 10);
        localStorage.setItem(SEARCH_COUNT_KEY, (currentSearches + 1).toString());
    } catch (error) {
        console.error('Failed to update search count in localStorage', error);
    }

    setHistory(prevHistory => {
      // Avoid duplicates based on roll, reg, and exam
      const exists = prevHistory.some(
        h => h.roll === item.roll && h.reg === item.reg && h.exam === item.exam && h.year === item.year && h.board === item.board
      );
      if (exists) {
        return prevHistory;
      }
      return [item, ...prevHistory].slice(0, 20); // Keep last 20 results
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addHistoryItem, clearHistory, isInitialized };
}
