import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import BackButton from '../components/BackButton.jsx';
import toast, { Toaster } from 'react-hot-toast';

const OrgLogin = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/org/auth/login", { // Separate Endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
      } else {
        localStorage.setItem("orgToken", data.token); // Separate Token Key
        localStorage.setItem("orgUser", JSON.stringify(data.organization));
        
        toast.success(`Welcome back, ${data.organization.orgName}!`);
        setTimeout(() => navigate("/org-dashboard"), 1500);
      }
    } catch (error) {
      toast.error("Connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const themeClasses = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-600',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-slate-900',
    inputFocus: isDarkMode ? 'border-teal-500 bg-slate-800' : 'border-teal-600 bg-white',
    accent: isDarkMode ? 'text-teal-400' : 'text-teal-600',
    button: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700',
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses.bg}`}>
      <Toaster position="top-center" toastOptions={{ style: { background: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#333' } }} />
      <BackButton to="/" />
      <div className="absolute top-6 right-6 z-50"><ThemeToggle /></div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side */}
        <div className="hidden lg:block space-y-8 pr-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className={`text-3xl font-bold ${themeClasses.text}`}>Donorly <span className="text-teal-500 text-lg font-medium">Partner</span></span>
            </div>
            <h1 className={`text-5xl font-bold leading-tight ${themeClasses.text}`}>
              Welcome back, <br />
              <span className="text-teal-500">Partner</span>
            </h1>
            <p className={`text-xl leading-relaxed ${themeClasses.subtext}`}>
              Manage your donation camps, update inventory, and connect with donors.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className={`rounded-3xl shadow-2xl p-8 md:p-10 border transition-colors duration-300 ${themeClasses.card}`}>
            
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${themeClasses.text}`}>Donorly</span>
            </div>

            <div className="mb-8">
              <h2 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>Partner Sign In</h2>
              <p className={themeClasses.subtext}>Enter your organization credentials</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${themeClasses.subtext}`}>Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'email' ? 'text-teal-500' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} ${focusedField === 'email' ? themeClasses.inputFocus : 'border-transparent'}`}
                    placeholder="admin@hospital.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium ${themeClasses.subtext}`}>Password</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'password' ? 'text-teal-500' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} ${focusedField === 'password' ? themeClasses.inputFocus : 'border-transparent'}`}
                    placeholder="Enter password"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}>
                    <Check className="w-3 h-3 text-transparent" />
                  </div>
                  <span className={`text-sm ${themeClasses.subtext}`}>Remember me</span>
                </label>
                <button className={`text-sm font-medium hover:underline ${themeClasses.accent}`}>Forgot password?</button>
              </div>

              <button onClick={handleSubmit} disabled={isLoading} className={`w-full py-4 text-white rounded-xl font-semibold shadow-lg ${themeClasses.button}`}>
                {isLoading ? 'Signing In...' : 'Access Dashboard'}
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}></div></div>
              <div className="relative flex justify-center text-sm"><span className={`px-4 ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-gray-500'}`}>New Partner?</span></div>
            </div>

            <div className="text-center">
              <Link to="/org-signup" className={`font-semibold ${themeClasses.accent} hover:underline`}>
                Register your Organization
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgLogin;