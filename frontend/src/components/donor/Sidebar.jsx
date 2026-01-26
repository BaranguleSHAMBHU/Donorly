import React from 'react';
import { 
  Home, Clock, Activity, Award, Calendar, LogOut, MapPin ,User
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, handleLogout, isDarkMode, activeView, setActiveView }) => {
  const theme = {
    sidebar: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-xl lg:shadow-none',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    primary: isDarkMode ? 'text-rose-400' : 'text-rose-600',
    primaryBg: isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50',
    divider: isDarkMode ? 'border-slate-800' : 'border-gray-200',
  };

  const navItems = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Overview' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'My Profile' },
    { id: 'history', icon: <Clock className="w-5 h-5" />, label: 'Donation Journey' },
    { id: 'health', icon: <Activity className="w-5 h-5" />, label: 'Health Insights' },
    { id: 'camps', icon: <MapPin className="w-5 h-5" />, label: 'Find Camps' },
    { id: 'rewards', icon: <Award className="w-5 h-5" />, label: 'Rewards & Badges' },
  ];

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r transform transition-transform duration-200 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${theme.sidebar}`}>
        <div className="h-full flex flex-col pt-20 lg:pt-6">
          
          <div className="px-6 mb-8">
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-rose-600 to-orange-600 text-white shadow-lg`}>
              <p className="text-xs font-medium opacity-90 mb-1">Impact Score</p>
              <h3 className="text-3xl font-bold">12</h3>
              <p className="text-xs opacity-90 mt-1">Lives Saved</p>
            </div>
          </div>

          <div className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveView(item.id);
                  if(window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  activeView === item.id 
                    ? `${theme.primaryBg} ${theme.primary} border border-rose-500/20` 
                    : `${theme.subtext} hover:bg-slate-100 dark:hover:bg-slate-800`
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className={`p-4 border-t ${theme.divider}`}>
            <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors ${theme.subtext}`}>
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 bg-slate-950/50 z-30 backdrop-blur-sm" />}
    </>
  );
};

export default Sidebar;