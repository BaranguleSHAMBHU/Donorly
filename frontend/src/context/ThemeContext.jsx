// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check localStorage first, default to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Update localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Optional: Add a class to the body for global tailwind overrides if needed
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Define your theme colors centrally here to avoid repetition
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-gray-100',
    text: isDarkMode ? 'text-slate-100' : 'text-gray-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-gray-500',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    cardHover: isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-white hover:shadow-md',
    border: isDarkMode ? 'border-slate-800' : 'border-gray-200',
    input: isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-300 text-gray-700 placeholder:text-gray-400',
    nav: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    sidebar: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-xl lg:shadow-none',
    divider: isDarkMode ? 'border-slate-800' : 'border-gray-100',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);