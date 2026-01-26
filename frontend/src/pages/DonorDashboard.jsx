import React, { useState, useEffect } from 'react';
import { Menu, Bell, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle.jsx';

// Components
import Sidebar from '../components/donor/Sidebar.jsx'; // We will create this
import DonorHome from '../components/donor/DonorHome.jsx'; // The main overview
import DonationHistory from '../components/donor/DonationHistory.jsx'; // Timeline
import HealthInsights from '../components/donor/HealthInsights.jsx'; // Charts
import FindCamps from '../components/donor/FindCamps.jsx'; // 👈 IMPORT THIS
import Rewards from '../components/donor/Rewards.jsx';
import Profile from '../components/donor/Profile.jsx';

const DonorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ fullName: 'Donor' });
  const [activeView, setActiveView] = useState('dashboard');
  
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Theme Config
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    primary: 'text-rose-600',
  };

  useEffect(() => {
    const token = localStorage.getItem("donorToken");
    const storedUser = localStorage.getItem("donorUser");

    if (!token || !storedUser) {
      navigate("/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("donorToken");
    localStorage.removeItem("donorUser");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/donor-login"), 500);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DonorHome user={user} isDarkMode={isDarkMode} />;
      case 'profile': // 👈 ADD THIS CASE
        return <Profile user={user} isDarkMode={isDarkMode} />;
      case 'history':
        return <DonationHistory isDarkMode={isDarkMode} />;
      case 'health':
        return <HealthInsights isDarkMode={isDarkMode} />;
      case 'camps':
        return <FindCamps isDarkMode={isDarkMode} />;
      case 'rewards':
        return <Rewards isDarkMode={isDarkMode} />;
      default:
        return <DonorHome user={user} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <Toaster position="top-right" />

      {/* Top Navbar */}
      <nav className={`sticky top-0 z-30 border-b px-6 py-3 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-lg font-bold block leading-tight">Donorly</span>
              <span className="text-xs font-medium uppercase tracking-wide text-rose-500">Lifesaver</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <Bell className="w-5 h-5 text-gray-500" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold">{user.fullName}</p>
            <p className={`text-xs ${theme.subtext}`}>{user.bloodGroup || 'O+'} Donor</p>
          </div>
        </div>
      </nav>

      <div className="flex max-w-[1600px] mx-auto">
        <Sidebar 
          isOpen={sidebarOpen} setIsOpen={setSidebarOpen} 
          handleLogout={handleLogout} isDarkMode={isDarkMode}
          activeView={activeView} setActiveView={setActiveView}
        />

        <main className="flex-1 p-6 lg:p-10 min-w-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">
              {activeView === 'dashboard' ? `Welcome back, ${user.fullName.split(' ')[0]}` : 
               activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;