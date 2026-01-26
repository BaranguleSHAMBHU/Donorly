// src/components/Navbar.js
import React from 'react';
import { Heart, Search, Bell, User, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import the hook

const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${theme.nav}`}>
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className={`lg:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Donorly
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Other Icons... */}
            <button className={`p-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <Bell className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;