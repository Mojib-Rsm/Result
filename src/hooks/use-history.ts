'use client';

import { useState, useEffect } from 'react';
import type { HistoryItem } from '@/types';

const HISTORY_KEY = 'bd-results-history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(HISTORY_KEY);
      if (item) {
        setHistory(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to parse history from localStorage', error);
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
    setHistory(prevHistory => {
      // Avoid duplicates based on roll, reg, and exam
      const exists = prevHistory.some(
        h => h.roll === item.roll && h.reg === item.reg && h.exam === item.exam
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
