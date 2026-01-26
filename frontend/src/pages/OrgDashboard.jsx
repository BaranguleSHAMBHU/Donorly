import React, { useState, useEffect } from 'react';
import { Menu, Bell, Building2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle.jsx';

// Components
import Sidebar from '../components/dashboard/Sidebar.jsx';
import StatsOverview from '../components/dashboard/StatsOverview.jsx';
import BloodInventory from '../components/dashboard/BloodInventory.jsx';
import UpcomingCamps from '../components/dashboard/UpcomingCamps.jsx';
import DonorManagement from '../components/dashboard/DonorManagement.jsx'; // Import the new component
import InventoryManager from '../components/dashboard/InventoryManager.jsx'; // 👈 NEW
import CampManager from '../components/dashboard/CampManager.jsx';           // 👈 NEW
import Analytics from '../components/dashboard/Analytics.jsx';               // 👈 NEW

const OrgDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [org, setOrg] = useState({ orgName: 'Organization' });
  const [camps, setCamps] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Theme constants
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    primary: isDarkMode ? 'text-teal-400' : 'text-teal-600',
  };

  useEffect(() => {
    // ... (Keep existing fetch logic)
    const storedOrg = localStorage.getItem("orgUser");
    if(storedOrg) setOrg(JSON.parse(storedOrg));
    // Simulate camps for now
    setCamps([
      { _id: 1, campName: "City Mall Drive", date: "2026-02-10", startTime: "10:00", location: "City Mall" },
      { _id: 2, campName: "Tech Park Event", date: "2026-02-15", startTime: "09:00", location: "Sector 5" }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("orgToken");
    localStorage.removeItem("orgUser");
    navigate("/org-login");
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fadeIn">
            <StatsOverview isDarkMode={isDarkMode} totalCamps={camps.length} />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Critical Alert Banner - Developer Thinking: Show urgency */}
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-center gap-3 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-300">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Critical Stock Alert: <span className="font-bold">A- Negative</span> and <span className="font-bold">O- Negative</span> reserves are below 10 units.</p>
                  <button className="ml-auto text-xs font-bold underline hover:text-red-600">Request Stock</button>
                </div>
                <BloodInventory isDarkMode={isDarkMode} />
              </div>
              <UpcomingCamps camps={camps} isDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case 'inventory':
      // ✅ Now uses the full manager instead of the read-only widget
        return <InventoryManager isDarkMode={isDarkMode} />;
      case 'camps':
      // ✅ Now uses the full table manager
      return (
         <div className="max-w-6xl">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Drives</h2>
              <button onClick={() => navigate('/org-add-camp')} className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform">
                + New Camp
              </button>
           </div>
           <CampManager camps={camps} isDarkMode={isDarkMode} />
         </div>
      );
      case 'donors': // This maps to the "Live Donor Check-in" sidebar item
        return <DonorManagement isDarkMode={isDarkMode} />;
      
      case 'certificates':
        return <DonorManagement isDarkMode={isDarkMode} />; // Reusing for now, logic can check view prop

      case 'reports':
      // ✅ Now uses the Analytics component
      return <Analytics isDarkMode={isDarkMode} />;
      default:
        return <div className="p-10 text-center text-gray-500">Feature coming in next update.</div>;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />
      
      {/* Top Navbar */}
      <nav className={`sticky top-0 z-30 border-b px-6 py-3 flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2"><Menu /></button>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Donorly <span className="text-teal-500 text-xs uppercase ml-1">Partner</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold">{org.orgName}</p>
            <p className={`text-[10px] uppercase font-bold tracking-wider ${theme.primary}`}>Verified Partner</p>
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
              {activeView === 'dashboard' ? `Welcome back, ${org.orgName}` : 
               activeView === 'donors' ? 'Donor Management Console' : 
               activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default OrgDashboard;