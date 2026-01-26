import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const BackButton = ({ to = "/" }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <button 
      onClick={() => navigate(to)}
      className={`absolute top-6 left-6 z-50 p-3 rounded-full border transition-all duration-300 shadow-lg group ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white' 
          : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50 hover:text-rose-600'
      }`}
      title="Go Back"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
    </button>
  );
};

export default BackButton;