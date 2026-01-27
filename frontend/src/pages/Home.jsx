import React, { useState, useEffect } from 'react';
import { 
  MapPin, Shield, Clock, Bell, Heart, Download, Search, 
  CheckCircle, Moon, Sun, User, LayoutDashboard, LogOut, 
  Stethoscope, ArrowRight 
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext.jsx';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // State to track if user is logged in
  const [user, setUser] = useState(null);
  const [isDonorLoggedIn, setIsDonorLoggedIn] = useState(false);
  const [isOrgLoggedIn, setIsOrgLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Check Donor Login
    const storedUser = localStorage.getItem("donorUser");
    const token = localStorage.getItem("donorToken");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsDonorLoggedIn(true);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    // Check Org Login
    const orgToken = localStorage.getItem("orgToken");
    if (orgToken) {
      setIsOrgLoggedIn(true);
    }

    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("donorToken");
    localStorage.removeItem("donorUser");
    localStorage.removeItem("orgToken");
    localStorage.removeItem("orgUser");
    setUser(null);
    setIsDonorLoggedIn(false);
    setIsOrgLoggedIn(false);
    navigate("/");
  };

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Camp Locator Map",
      desc: "Real-time updates on nearby donation centers"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Document Vault",
      desc: "Your reports encrypted and safely stored"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Donation History Timeline",
      desc: "Track your impact over time"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Emergency Nearby Alerts",
      desc: "Get notified when you can help save a life"
    }
  ];

  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-gray-600',
    sectionBg: isDarkMode ? 'bg-slate-900' : 'bg-white',
    featureBg: isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-b from-gray-50 to-white',
    trustBg: isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-teal-50 via-white to-rose-50',
    footer: isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-200'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg}`}>
      
      {/* Navigation */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-rose-700 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className={`text-xl font-semibold ${theme.text}`}>Donorly</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors border ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user && (
            <div className="flex items-center gap-3">
              <Link 
                to="/donor-dashboard" 
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <div className="relative group">
                <button className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                  isDarkMode ? 'bg-rose-900/30 border-rose-800 text-rose-400' : 'bg-rose-100 border-rose-200 text-rose-600'
                }`}>
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName || 'User'}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-24 max-w-6xl mx-auto">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${theme.text}`}>
            Every Donation.<br />
            <span className="text-rose-600">Digitally Remembered.</span>
          </h1>
          
          <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${theme.subtext}`}>
            A unified platform connecting compassionate hearts with those in need. Whether you give or gather, you save lives.
          </p>

          {/* CREATIVE LOGIN SECTION - CONDITIONAL GRID */}
          <div className={`grid gap-6 mx-auto transition-all duration-500 ${
            (isDonorLoggedIn || isOrgLoggedIn) 
              ? 'md:grid-cols-1 max-w-md' // If logged in, show 1 centered card
              : 'md:grid-cols-2 max-w-4xl' // If not logged in, show 2 cards
          }`}>
            
            {/* 🩸 DONOR CARD - Hide if Org is Logged In */}
            {!isOrgLoggedIn && (
              <div className={`group relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-rose-900/50' 
                  : 'bg-white border-rose-100 shadow-xl hover:shadow-rose-100/50'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  isDarkMode ? 'bg-rose-900/20 text-rose-500' : 'bg-rose-50 text-rose-600'
                }`}>
                  <Heart className="w-7 h-7 fill-current" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${theme.text}`}>For Donors</h3>
                <p className={`mb-8 text-lg font-medium italic ${isDarkMode ? 'text-rose-200/80' : 'text-rose-700/80'}`}>
                  "Heroes don't wear capes, they roll up their sleeves. Be the reason someone smiles tomorrow."
                </p>
                
                {isDonorLoggedIn ? (
                  <button 
                    onClick={() => navigate('/donor-dashboard')}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isDarkMode 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200'
                    }`}
                  >
                    Go to Dashboard <LayoutDashboard className="w-5 h-5" />
                  </button>
                ) : (
                  <Link 
                    to="/donor-login" 
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isDarkMode 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200'
                    }`}
                  >
                    Donor Login <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            )}

            {/* 🏥 HOSPITAL CARD - Hide if Donor is Logged In */}
            {!isDonorLoggedIn && (
              <div className={`group relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-teal-900/50' 
                  : 'bg-white border-teal-100 shadow-xl hover:shadow-teal-100/50'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  isDarkMode ? 'bg-teal-900/20 text-teal-500' : 'bg-teal-50 text-teal-600'
                }`}>
                  <Stethoscope className="w-7 h-7" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${theme.text}`}>For Camps & Hospitals</h3>
                <p className={`mb-8 text-lg font-medium italic ${isDarkMode ? 'text-teal-200/80' : 'text-teal-700/80'}`}>
                  "Bridge the gap between hope and healing. Manage your drives and streamline the lifeline."
                </p>

                {isOrgLoggedIn ? (
                  <button 
                    onClick={() => navigate('/org-dashboard')}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isDarkMode 
                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200'
                    }`}
                  >
                    Go to Dashboard <LayoutDashboard className="w-5 h-5" />
                  </button>
                ) : (
                  <Link 
                    to="/org-login" 
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      isDarkMode 
                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200'
                    }`}
                  >
                    Partner Login <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Hero Illustration */}
        <div className="mt-24 relative -z-10 opacity-60">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[500px] bg-gradient-to-r from-rose-400/20 via-amber-200/20 to-teal-400/20 blur-3xl rounded-full"></div>
        </div>
      </section>

      {/* ... Rest of sections (How It Works, Features, Trust, Footer) remain same ... */}
      <section className={`px-6 py-20 transition-colors duration-300 ${theme.sectionBg}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-4 ${theme.text}`}>How Donorly Works</h2>
          <p className={`text-center mb-16 text-lg ${theme.subtext}`}>Three simple steps to make your donation journey seamless</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Search, color: "text-rose-600", bg: isDarkMode ? "bg-rose-900/20" : "bg-rose-100", title: "Discover Nearby Camps", desc: "Browse real-time locations and schedules of donation camps in your area" },
              { icon: Heart, color: "text-teal-600", bg: isDarkMode ? "bg-teal-900/20" : "bg-teal-100", title: "Donate & Upload Report", desc: "After donation, securely upload your blood report for safekeeping" },
              { icon: Download, color: "text-amber-600", bg: isDarkMode ? "bg-amber-900/20" : "bg-amber-100", title: "Get Digital Certificate", desc: "Receive and store your donation certificate digitally, forever accessible" }
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform ${item.bg}`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${theme.text}`}>{item.title}</h3>
                <p className={`${theme.subtext} leading-relaxed`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`px-6 py-20 transition-colors duration-300 ${theme.featureBg}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${theme.text}`}>Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className={`p-8 rounded-3xl border-2 transition-all cursor-pointer ${isDarkMode ? `bg-slate-900 border-slate-800 ${activeFeature === idx ? 'border-rose-500/50 shadow-lg shadow-rose-900/20 scale-105' : 'hover:border-slate-700'}` : `bg-white ${activeFeature === idx ? 'border-rose-300 shadow-xl scale-105' : 'border-gray-100 shadow-lg hover:border-teal-200'}`}`} onMouseEnter={() => setActiveFeature(idx)}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-rose-600 ${isDarkMode ? 'bg-slate-800' : 'bg-gradient-to-br from-rose-50 to-teal-50'}`}>{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-3 ${theme.text}`}>{feature.title}</h3>
                <p className={`${theme.subtext} leading-relaxed`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`px-6 py-12 border-t transition-colors duration-300 ${theme.footer}`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-rose-700 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className={`text-xl font-semibold ${theme.text}`}>Donorly</span>
          </div>
          <p className={`text-sm ${theme.subtext}`}>Making blood donation accessible, memorable, and impactful.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;