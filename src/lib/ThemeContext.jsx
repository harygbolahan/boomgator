import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage for existing theme preference
    const savedTheme = localStorage.getItem('theme');
    // Default to light mode instead of system preference
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Update class on document.documentElement
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Memoize toggle function to avoid recreating it on every render
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Memoize context value to avoid unnecessary re-renders of consuming components
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleDarkMode
  }), [isDarkMode, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 