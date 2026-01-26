import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`p-3 rounded-full border transition-all duration-300 shadow-lg ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
          : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
      } ${className}`}
      title="Toggle Theme"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;