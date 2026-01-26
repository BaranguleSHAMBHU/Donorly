import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Calendar, Check, Shield } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import BackButton from '../components/BackButton.jsx';
import toast, { Toaster } from 'react-hot-toast'; // 1. Import Toast

const Register = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Basic validation for Step 1
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.dob || !formData.bloodGroup) {
        toast.error("Please fill in all details to proceed.");
        return;
      }
    }
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validation for Step 2
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please set a password.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      toast.error("You must agree to the terms.");
      return;
    }

    setIsLoading(true);

    // Normalize email
    const payload = {
      ...formData,
      email: formData.email.toLowerCase()
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed. Please try again.");
      } else {
        // Success Logic
        localStorage.setItem("donorToken", data.token);
        localStorage.setItem("donorUser", JSON.stringify(data.donor));
        
        toast.success("Account created successfully! Welcome to Donorly.");
        
        // Delay redirect slightly so user sees the success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      toast.error("Server connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const pass = formData.password;
    if (pass.length === 0) return { strength: 0, label: '', color: '' };
    if (pass.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (pass.length < 10) return { strength: 50, label: 'Fair', color: 'bg-amber-500' };
    if (pass.length < 12 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) 
      return { strength: 75, label: 'Good', color: 'bg-teal-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = passwordStrength();

  // 🎨 Theme Classes Helper
  const themeClasses = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-gray-600',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400',
    inputFocus: isDarkMode ? 'border-rose-500 bg-slate-800' : 'border-rose-300 bg-white',
    iconBg: isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-rose-600',
    progressInactive: isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-gray-200 text-gray-500',
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 ${themeClasses.bg}`}>
      
      {/* Toast Container */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: isDarkMode ? '#1e293b' : '#fff',
            color: isDarkMode ? '#fff' : '#333',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: '#10b981', secondary: 'white' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: '#ef4444', secondary: 'white' },
          },
        }}
      />

      {/* 2. Add Back Button (Top Left) */}
      <BackButton to="/" />
      
      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-rose-900/20' : 'bg-rose-300 opacity-10'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDarkMode ? 'bg-teal-900/20' : 'bg-teal-300 opacity-10'}`} style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 pr-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <span className={`text-3xl font-bold ${themeClasses.text}`}>Donorly</span>
            </div>
            <h1 className={`text-5xl font-bold leading-tight ${themeClasses.text}`}>
              Start your journey as a<br />
              <span className="text-rose-600">lifesaver</span>
            </h1>
            <p className={`text-xl leading-relaxed ${themeClasses.subtext}`}>
              Join thousands of donors making a real difference in their communities.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4 pt-8">
            {[
              { icon: <Shield className="w-5 h-5" />, text: 'Your data is private and encrypted' },
              { icon: <Heart className="w-5 h-5" />, text: 'Track every life-saving donation' },
              { icon: <Calendar className="w-5 h-5" />, text: 'Never miss a donation opportunity' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all ${themeClasses.iconBg}`}>
                  {benefit.icon}
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="pt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= 1 ? 'bg-rose-600 text-white' : themeClasses.progressInactive
              }`}>1</div>
              <div className={`flex-1 h-1 rounded transition-all ${
                currentStep >= 2 ? 'bg-rose-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= 2 ? 'bg-rose-600 text-white' : themeClasses.progressInactive
              }`}>2</div>
            </div>
            <div className={`flex justify-between text-sm ${themeClasses.subtext}`}>
              <span>Personal Info</span>
              <span>Account Setup</span>
            </div>
          </div>

          {/* Quote */}
          <div className={`pt-8 border-l-4 pl-6 ${isDarkMode ? 'border-rose-900' : 'border-rose-300'}`}>
            <p className={`italic text-lg ${themeClasses.subtext}`}>
              "The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you."
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className={`rounded-3xl shadow-2xl p-8 md:p-10 border transition-colors duration-300 ${themeClasses.card}`}>
            
            {/* Mobile Logo & Progress */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <span className={`text-2xl font-bold ${themeClasses.text}`}>Donorly</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className={`flex-1 h-2 rounded transition-all ${currentStep >= 1 ? 'bg-rose-600' : 'bg-gray-200'}`}></div>
                <div className={`flex-1 h-2 rounded transition-all ${currentStep >= 2 ? 'bg-rose-600' : 'bg-gray-200'}`}></div>
              </div>
              <p className={`text-sm text-center ${themeClasses.subtext}`}>Step {currentStep} of 2</p>
            </div>

            <div className="mb-8">
              <h2 className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>Create Account</h2>
              <p className={themeClasses.subtext}>
                {currentStep === 1 ? 'Tell us about yourself' : 'Secure your account'}
              </p>
            </div>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Full Name</label>
                  <div className={`relative transition-all ${focusedField === 'fullName' ? 'scale-[1.02]' : ''}`}>
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'fullName' ? 'text-rose-600' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all outline-none ${themeClasses.input} ${
                        focusedField === 'fullName' ? `${themeClasses.inputFocus} shadow-lg` : 'border-transparent hover:border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email Address</label>
                  <div className={`relative transition-all ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'email' ? 'text-rose-600' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all outline-none ${themeClasses.input} ${
                        focusedField === 'email' ? `${themeClasses.inputFocus} shadow-lg` : 'border-transparent hover:border-gray-200'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone & DOB Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Phone</label>
                    <div className={`relative transition-all ${focusedField === 'phone' ? 'scale-[1.02]' : ''}`}>
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focusedField === 'phone' ? 'text-rose-600' : 'text-gray-400'
                      }`} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-10 pr-3 py-4 border-2 rounded-xl transition-all outline-none text-sm ${themeClasses.input} ${
                          focusedField === 'phone' ? `${themeClasses.inputFocus} shadow-lg` : 'border-transparent hover:border-gray-200'
                        }`}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Birth Date</label>
                    <div className={`relative transition-all ${focusedField === 'dob' ? 'scale-[1.02]' : ''}`}>
                      <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        focusedField === 'dob' ? 'text-rose-600' : 'text-gray-400'
                      }`} />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateField('dob', e.target.value)}
                        onFocus={() => setFocusedField('dob')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full pl-10 pr-3 py-4 border-2 rounded-xl transition-all outline-none text-sm ${themeClasses.input} ${
                          focusedField === 'dob' ? `${themeClasses.inputFocus} shadow-lg` : 'border-transparent hover:border-gray-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Blood Group</label>
                  <div className="grid grid-cols-4 gap-2">
                    {bloodGroups.map(group => (
                      <button
                        key={group}
                        onClick={() => updateField('bloodGroup', group)}
                        className={`py-3 rounded-xl font-semibold transition-all ${
                          formData.bloodGroup === group
                            ? 'bg-rose-600 text-white shadow-lg scale-105'
                            : isDarkMode 
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-transparent' 
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="group w-full py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-semibold text-lg hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Step 2: Account Setup */}
            {currentStep === 2 && (
              <div className="space-y-5">
                
                {/* Password */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Password</label>
                  <div className={`relative transition-all ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'password' ? 'text-rose-600' : 'text-gray-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all outline-none ${themeClasses.input} ${
                        focusedField === 'password' ? `${themeClasses.inputFocus} shadow-lg` : 'border-transparent hover:border-gray-200'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Password strength</span>
                        <span className={`font-semibold ${
                          strength.strength < 50 ? 'text-red-600' : 
                          strength.strength < 75 ? 'text-amber-600' : 'text-green-600'
                        }`}>{strength.label}</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${strength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Confirm Password</label>
                  <div className={`relative transition-all ${focusedField === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'confirmPassword' ? 'text-rose-600' : 'text-gray-400'
                    }`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all outline-none ${themeClasses.input} ${
                        focusedField === 'confirmPassword' ? `${themeClasses.inputFocus} shadow-lg` : 'border-transparent hover:border-gray-200'
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600">Passwords don't match</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group pt-2">
                  <div className="relative mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField('agreeTerms', e.target.checked)}
                      className="peer sr-only" 
                    />
                    <div className={`w-5 h-5 border-2 rounded peer-checked:border-rose-600 peer-checked:bg-rose-600 transition-all ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-gray-300 bg-white'}`}></div>
                    <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className={`text-sm leading-relaxed ${themeClasses.subtext}`}>
                    I agree to the{' '}
                    <button className="text-rose-600 hover:text-rose-700 font-medium">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-rose-600 hover:text-rose-700 font-medium">Privacy Policy</button>
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleBack}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                      isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.agreeTerms}
                    className="flex-1 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-semibold hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-gray-500'}`}>Or sign up with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="grid grid-cols-2 gap-4">
              <button className={`py-3 px-4 border-2 rounded-xl transition-all flex items-center justify-center gap-2 group ${
                isDarkMode ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-800' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className={`font-medium group-hover:text-opacity-80 ${themeClasses.text}`}>Google</span>
              </button>
              <button className={`py-3 px-4 border-2 rounded-xl transition-all flex items-center justify-center gap-2 group ${
                isDarkMode ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-800' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className={`font-medium group-hover:text-opacity-80 ${themeClasses.text}`}>GitHub</span>
              </button>
            </div>

            {/* Sign In Link */}
            <p className={`mt-8 text-center ${themeClasses.subtext}`}>
              Already have an account?{' '}
              <Link to="/donor-login" className="px-5 py-2 text-sm font-medium text-rose-600 hover:text-rose-500 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;