
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/types';
import { getDatabase, ref, runTransaction, push, set } from "firebase/database";
import { app as firebaseApp } from '@/lib/firebase';

const VISIT_SESSION_KEY = 'visit-counted';

export function useHistory() {
  const [isInitialized, setIsInitialized] = useState(false);
  const db = getDatabase(firebaseApp);

  const incrementVisitCount = useCallback(() => {
    try {
      if (sessionStorage.getItem(VISIT_SESSION_KEY)) {
        return; 
      }
      const visitsRef = ref(db, 'stats/visits');
      runTransaction(visitsRef, (currentValue) => (currentValue || 0) + 1);
      sessionStorage.setItem(VISIT_SESSION_KEY, 'true');
    } catch (error) {
      console.error("Firebase visit count increment failed: ", error);
    }
  }, [db]);

  useEffect(() => {
    incrementVisitCount();
    setIsInitialized(true);
  }, [incrementVisitCount]);

  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'timestamp'>) => {
    try {
      const searchesRef = ref(db, 'stats/searches');
      runTransaction(searchesRef, (currentValue) => (currentValue || 0) + 1);
      
      const historyRef = ref(db, 'history');
      const newHistoryRef = push(historyRef);

      const itemWithTimestamp: HistoryItem = {
        ...item,
        timestamp: Date.now()
      };

      await set(newHistoryRef, itemWithTimestamp);
    } catch (error) {
       console.error("Firebase history write failed: ", error);
    }
  }, [db]);

  return { addHistoryItem, isInitialized };
}
