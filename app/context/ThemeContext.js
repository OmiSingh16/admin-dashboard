'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

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

  useEffect(() => {
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

  return (
    <ThemeContext.Provider value={{ sidebarTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}