// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, Droplet, Calendar, Users, FileText, 
  LogOut, Plus, ShieldCheck, Stethoscope 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen, handleLogout, isDarkMode, activeView, setActiveView }) => {
  const navigate = useNavigate();

  const theme = {
    sidebar: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-xl lg:shadow-none',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    primary: isDarkMode ? 'text-teal-400' : 'text-teal-600',
    primaryBg: isDarkMode ? 'bg-teal-900/20' : 'bg-teal-50',
    divider: isDarkMode ? 'border-slate-800' : 'border-gray-200',
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    { id: 'camps', icon: <Calendar className="w-5 h-5" />, label: 'Manage Camps' }, // Renamed
    { id: 'donors', icon: <Users className="w-5 h-5" />, label: 'Live Donor Check-in' }, // NEW
    { id: 'inventory', icon: <Droplet className="w-5 h-5" />, label: 'Blood Stock & Expiry' },
    { id: 'certificates', icon: <ShieldCheck className="w-5 h-5" />, label: 'Issue Certificates' }, // NEW
    { id: 'reports', icon: <FileText className="w-5 h-5" />, label: 'Upload Reports' }, // NEW
  ];

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r transform transition-transform duration-200 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${theme.sidebar}`}>
        <div className="h-full flex flex-col pt-20 lg:pt-6">
          <div className="px-4 mb-6">
            <button 
              onClick={() => navigate('/org-add-camp')}
              className="w-full py-3 flex items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-lg shadow-teal-500/20 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" /> Host New Drive
            </button>
          </div>

          <div className="flex-1 px-4 space-y-1">
            <p className={`px-2 text-xs font-bold uppercase tracking-wider mb-2 ${theme.subtext}`}>Main Menu</p>
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveView(item.id);
                  if(window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  activeView === item.id 
                    ? `${theme.primaryBg} ${theme.primary} border border-teal-500/20 shadow-sm` 
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