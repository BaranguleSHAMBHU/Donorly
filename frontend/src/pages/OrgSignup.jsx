import React, { useState } from 'react';
import { 
  Building2, Mail, Lock, Eye, EyeOff, ArrowRight, 
  Phone, MapPin, Check, Shield, FileBadge, Stethoscope 
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import BackButton from '../components/BackButton.jsx';
import toast, { Toaster } from 'react-hot-toast';

const OrgSignup = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    phone: '',
    orgType: '', // Hospital, Blood Bank, NGO
    licenseNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const orgTypes = ['Hospital', 'Blood Bank', 'NGO', 'Govt. Center'];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.orgName || !formData.email || !formData.phone || !formData.orgType) {
        toast.error("Please fill in all organization details.");
        return;
      }
    }
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.password || !formData.licenseNumber || !formData.address) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      toast.error("Please agree to the Partner Terms.");
      return;
    }

    setIsLoading(true);

    try {
      // Endpoint likely needs to be different for Org
      const res = await fetch("http://localhost:5000/api/org/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          email: formData.email.toLowerCase()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed.");
      } else {
        // Store Org Token (Distinct from donorToken)
        localStorage.setItem("orgToken", data.token);
        localStorage.setItem("orgUser", JSON.stringify(data.organization));
        
        toast.success("Organization registered successfully!");
        setTimeout(() => navigate("/org-dashboard"), 1500); // Redirect to Org Dashboard
      }
    } catch (error) {
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Theme Classes (Teal Variant for Organizations)
  const themeClasses = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-600',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-slate-900',
    inputFocus: isDarkMode ? 'border-teal-500 bg-slate-800' : 'border-teal-600 bg-white',
    accent: isDarkMode ? 'text-teal-400' : 'text-teal-600',
    button: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700',
    progressActive: 'bg-teal-600 text-white',
    progressInactive: isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-gray-200 text-gray-500',
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 ${themeClasses.bg}`}>
      <Toaster position="top-center" toastOptions={{ style: { background: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#333' } }} />
      <BackButton to="/" />
      <div className="absolute top-6 right-6 z-50"><ThemeToggle /></div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 pr-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <span className={`text-3xl font-bold ${themeClasses.text}`}>Donorly <span className="text-teal-500 text-lg block font-medium">for Partners</span></span>
            </div>
            <h1 className={`text-5xl font-bold leading-tight ${themeClasses.text}`}>
              Manage drives & <br />
              <span className="text-teal-500">multiply impact</span>
            </h1>
            <p className={`text-xl leading-relaxed ${themeClasses.subtext}`}>
              The unified platform for hospitals, blood banks, and NGOs to coordinate donations efficiently.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            {[
              { icon: <Shield className="w-5 h-5" />, text: 'Verified Organization Network' },
              { icon: <MapPin className="w-5 h-5" />, text: 'Real-time Camp Location Tracking' },
              { icon: <FileBadge className="w-5 h-5" />, text: 'Digital Certification System' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isDarkMode ? 'bg-slate-800 text-teal-400' : 'bg-white text-teal-600'}`}>
                  {benefit.icon}
                </div>
                <span className={`font-medium ${themeClasses.subtext}`}>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className={`rounded-3xl shadow-2xl p-8 md:p-10 border transition-colors duration-300 ${themeClasses.card}`}>
            
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8 justify-center">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? themeClasses.progressActive : themeClasses.progressInactive}`}>1</div>
               <div className={`w-12 h-1 rounded ${currentStep >= 2 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? themeClasses.progressActive : themeClasses.progressInactive}`}>2</div>
            </div>

            <div className="mb-8 text-center">
              <h2 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>Register Organization</h2>
              <p className={themeClasses.subtext}>
                {currentStep === 1 ? 'Organization Details' : 'Verification & Security'}
              </p>
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${themeClasses.subtext}`}>Organization Name</label>
                  <div className="relative">
                    <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'orgName' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => updateField('orgName', e.target.value)}
                      onFocus={() => setFocusedField('orgName')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} ${focusedField === 'orgName' ? themeClasses.inputFocus : 'border-transparent'}`}
                      placeholder="City General Hospital"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${themeClasses.subtext}`}>Official Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'email' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} ${focusedField === 'email' ? themeClasses.inputFocus : 'border-transparent'}`}
                      placeholder="admin@hospital.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className={`text-sm font-medium ${themeClasses.subtext}`}>Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} focus:${themeClasses.inputFocus} border-transparent`}
                      placeholder="+1 234..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${themeClasses.subtext}`}>Org Type</label>
                    <select
                      value={formData.orgType}
                      onChange={(e) => updateField('orgType', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} focus:${themeClasses.inputFocus} border-transparent`}
                    >
                      <option value="">Select</option>
                      {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <button onClick={handleNext} className={`group w-full py-4 text-white rounded-xl font-semibold mt-6 shadow-lg ${themeClasses.button}`}>
                  Continue <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${themeClasses.subtext}`}>License / Reg. Number</label>
                  <div className="relative">
                    <FileBadge className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'license' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => updateField('licenseNumber', e.target.value)}
                      onFocus={() => setFocusedField('license')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} ${focusedField === 'license' ? themeClasses.inputFocus : 'border-transparent'}`}
                      placeholder="REG-2024-XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${themeClasses.subtext}`}>Address / HQ Location</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} focus:${themeClasses.inputFocus} border-transparent`}
                    placeholder="123 Medical Lane, City"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${themeClasses.subtext}`}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} focus:${themeClasses.inputFocus} border-transparent`}
                      placeholder="Secure password"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${themeClasses.subtext}`}>Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-xl outline-none transition-all ${themeClasses.input} focus:${themeClasses.inputFocus} border-transparent`}
                    placeholder="Confirm password"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group pt-2">
                  <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => updateField('agreeTerms', e.target.checked)} className="peer sr-only" />
                  <div className={`w-5 h-5 border-2 rounded peer-checked:bg-teal-600 peer-checked:border-teal-600 ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className={`text-sm ${themeClasses.subtext}`}>I agree to the <button className="text-teal-600 font-medium">Partner Terms</button></span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleBack} className={`flex-1 py-4 rounded-xl font-semibold ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>Back</button>
                  <button onClick={handleSubmit} disabled={isLoading} className={`flex-1 py-4 text-white rounded-xl font-semibold shadow-lg ${themeClasses.button}`}>
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}></div></div>
              <div className="relative flex justify-center text-sm"><span className={`px-4 ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-gray-500'}`}>Already a partner?</span></div>
            </div>

            <div className="text-center">
              <Link to="/org-login" className={`font-semibold ${themeClasses.accent} hover:underline`}>
                Sign In to Organization Portal
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgSignup;