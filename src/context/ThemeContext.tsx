/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Global Theme Context & Theme Manager (Light & Dark Mode)
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  isDark: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'gees-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Read persisted theme from localStorage or system preference
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
          return stored;
        }
        if (document.documentElement.classList.contains('dark')) {
          return 'dark';
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch (err) {
        console.warn('[GEES Theme] Unable to read localStorage:', err);
      }
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  // Apply theme class to documentElement and body whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      } catch (e) {}
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
      } catch (e) {}
    }
  }, [isDark]);

  // Synchronize across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Instant zero-latency synchronous DOM & localStorage executor
  const toggleTheme = () => {
    if (typeof window !== 'undefined') {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const nextTheme: ThemeMode = isCurrentlyDark ? 'light' : 'dark';
      
      // 1. Zero-latency DOM execution (instantaneous 120fps visual flip)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = 'dark';
        if (document.body) {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        }
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
        if (document.body) {
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        }
      }

      // 2. Synchronous storage persistence
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (e) {}

      // 3. Update React state for components depending on state
      setThemeState(nextTheme);
    } else {
      setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  const setTheme = (nextTheme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = 'dark';
        if (document.body) {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        }
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
        if (document.body) {
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        }
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (e) {}
    }
    setThemeState(nextTheme);
  };

  const contextValue = useMemo<ThemeContextValue>(() => ({
    isDark,
    theme,
    toggleTheme,
    setTheme,
  }), [isDark, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
