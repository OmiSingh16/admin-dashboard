'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const defaultTheme = {
  background: 'rgba(15, 25, 45, 0.96)',
  textColor: '#bac4d3',
  activeBg: 'rgba(255, 255, 255, 0.12)',
  activeColor: 'white',
  hoverBg: 'rgba(255, 255, 255, 0.08)',
  iconColor: '#d3d6de',
  underlineColor: '#94a3b8'
};

export function ThemeProvider({ children }) {
  const [sidebarTheme, setSidebarTheme] = useState(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('sidebarTheme');
    if (savedTheme) {
      try {
        setSidebarTheme(JSON.parse(savedTheme));
      } catch (e) {
        console.error('Error loading theme:', e);
      }
    }
  }, []);

  const updateTheme = (newTheme) => {
    setSidebarTheme(newTheme);
    localStorage.setItem('sidebarTheme', JSON.stringify(newTheme));
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ sidebarTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // ✅ ERROR HATAO - Fallback do
  if (!context) {
    console.warn('⚠️ useTheme used outside ThemeProvider - using fallback theme');
    return {
      sidebarTheme: defaultTheme,
      updateTheme: () => console.warn('Theme update not available')
    };
  }
  return context;
}