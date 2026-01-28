import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Menu, Bell, Heart, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle.jsx';

// Components
import Sidebar from '../components/donor/Sidebar.jsx';
import DonorHome from '../components/donor/DonorHome.jsx';
import DonationHistory from '../components/donor/DonationHistory.jsx';
import HealthInsights from '../components/donor/HealthInsights.jsx';
import FindCamps from '../components/donor/FindCamps.jsx';
import Rewards from '../components/donor/Rewards.jsx';
import Profile from '../components/donor/Profile.jsx';

const DonorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ fullName: 'Donor' });
  const [stats, setStats] = useState(null); 
  const [activeView, setActiveView] = useState('dashboard');
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const notificationRef = useRef(null); // To close dropdown when clicking outside

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Theme Config
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    primary: 'text-rose-600',
  };

  // 1. Fetch Data (User, Stats, Notifications)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("donorToken");
      const storedUser = localStorage.getItem("donorUser");

      if (!token || !storedUser) {
        navigate("/login");
        return;
      }

      try {
        setUser(JSON.parse(storedUser));

        // A. Fetch Stats
        const statsRes = await axios.get("http://localhost:5000/api/auth/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);

        // B. Fetch Notifications
        const notifRes = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notifRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
        if (error.response?.status === 401) {
             navigate("/login");
        }
      }
    };

    fetchData();

    // Optional: Poll for new notifications every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);

  }, [navigate]);

  // 2. Handle Click Outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("donorToken");
    localStorage.removeItem("donorUser");
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/donor-login"), 500);
  };

  // 3. Mark Notification as Read
  const handleMarkRead = async (id) => {
    try {
       const token = localStorage.getItem("donorToken");
       await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
         headers: { Authorization: `Bearer ${token}` }
       });
       
       // Update UI locally immediately
       setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) { 
        console.error("Failed to mark read", error); 
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DonorHome user={user} stats={stats} isDarkMode={isDarkMode} />;
      case 'profile':
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
        return <DonorHome user={user} stats={stats} isDarkMode={isDarkMode} />;
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
          
          {/* --- Notification Bell Area --- */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-xl border overflow-hidden z-50 animate-fadeIn ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                  <h4 className={`font-bold ${theme.text}`}>Notifications</h4>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center opacity-50 text-sm flex flex-col items-center gap-2">
                        <Bell className="w-8 h-8 opacity-20" />
                        No new notifications
                    </div>
                  ) : (
                    notifications.map(note => (
                      <div 
                        key={note._id} 
                        onClick={() => handleMarkRead(note._id)}
                        className={`p-4 border-b last:border-0 cursor-pointer transition-colors flex gap-3 ${
                          !note.isRead 
                            ? (isDarkMode ? 'bg-slate-800/50' : 'bg-blue-50/50') 
                            : (isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50')
                        } ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}
                      >
                        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!note.isRead ? 'bg-rose-500' : 'bg-transparent'}`}></div>
                        <div>
                          <p className={`text-sm leading-snug ${theme.text}`}>{note.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {/* --- End Notification Area --- */}

          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold">{user.fullName}</p>
            <p className={`text-[10px] uppercase font-bold tracking-wider ${theme.subtext}`}>{user.bloodGroup || 'O+'} Donor</p>
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