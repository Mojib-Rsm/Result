'use client';

import React, { createContext, useContext } from 'react';

export interface AuthUser {
  uid: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
