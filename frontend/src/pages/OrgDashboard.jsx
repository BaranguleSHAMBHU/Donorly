import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, Building2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle.jsx';

// Components
import Sidebar from '../components/dashboard/Sidebar.jsx';
import StatsOverview from '../components/dashboard/StatsOverview.jsx';
import BloodInventory from '../components/dashboard/BloodInventory.jsx'; // ✅ The new interactive component
import UpcomingCamps from '../components/dashboard/UpcomingCamps.jsx';
import DonorManagement from '../components/dashboard/DonorManagement.jsx';
import CampManager from '../components/dashboard/CampManager.jsx';
import Analytics from '../components/dashboard/Analytics.jsx';

const OrgDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [org, setOrg] = useState({ orgName: 'Organization' });
  const [camps, setCamps] = useState([]); 
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Theme constants
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    primary: isDarkMode ? 'text-teal-400' : 'text-teal-600',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get Logged In Org Data
      const storedOrg = localStorage.getItem("orgUser");
      const token = localStorage.getItem("orgToken");

      if (!token || !storedOrg) {
        navigate("/org-login");
        return;
      }

      const orgData = JSON.parse(storedOrg);
      setOrg(orgData);

      try {
        // 2. Fetch ALL Camps
        const res = await axios.get("http://localhost:5000/api/camps");

        // 3. Filter My Camps
        const myCamps = res.data.filter(camp => {
           const campOrgId = camp.organizationId?._id || camp.organizationId;
           const myOrgId = orgData._id || orgData.id;
           return String(campOrgId) === String(myOrgId);
        });

        setCamps(myCamps);

      } catch (error) {
        console.error("Failed to load camps", error);
        toast.error("Could not load your camps.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("orgToken");
    localStorage.removeItem("orgUser");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fadeIn">
            <StatsOverview isDarkMode={isDarkMode} totalCamps={camps.length} />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Critical Alert Banner */}
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-center gap-3 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-300">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Critical Stock Alert: <span className="font-bold">A- Negative</span> reserves are below 10 units.</p>
                </div>
                {/* ✅ New Inventory UI */}
                <BloodInventory isDarkMode={isDarkMode} />
              </div>
              <UpcomingCamps camps={camps} isDarkMode={isDarkMode} />
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="max-w-5xl space-y-6">
             <div>
                <h2 className="text-xl font-bold">Stock Management</h2>
                <p className={theme.subtext}>Update live inventory levels and monitor shortages.</p>
             </div>
             {/* ✅ REUSED THE NEW INTERACTIVE COMPONENT HERE */}
             <BloodInventory isDarkMode={isDarkMode} />
          </div>
        );

      case 'camps':
        return (
           <div className="max-w-6xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Drives</h2>
                <button 
                  onClick={() => navigate('/org-add-camp')} 
                  className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform"
                >
                  + New Camp
                </button>
             </div>
             <CampManager camps={camps} isDarkMode={isDarkMode} />
           </div>
        );
      
      case 'donors': return <DonorManagement isDarkMode={isDarkMode} />;
      case 'certificates': return <DonorManagement isDarkMode={isDarkMode} />;
      case 'reports': return <Analytics isDarkMode={isDarkMode} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />
      
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
               activeView === 'inventory' ? 'Inventory Control' :
               activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
          </div>
          
          {loading ? (
             <div className="flex items-center justify-center h-64">
               <p className="opacity-50">Loading your data...</p>
             </div>
          ) : (
             renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default OrgDashboard;