import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Users, Building2, 
  CheckCircle, FileText, Info 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle.jsx';

const AddCamp = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    campName: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    targetDonors: '',
    description: '',
    organizerName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.campName || !formData.location || !formData.date) {
      toast.error("Please fill in required fields.");
      return;
    }

    setIsLoading(true);

   try {
  const token = localStorage.getItem("orgToken"); // Get the token

  const res = await fetch("http://localhost:5000/api/camps", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Send token to backend
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed");
  }
  
  toast.success("Camp Scheduled Successfully!");
  setTimeout(() => navigate('/org-dashboard'), 1500);
  
} catch (error) {
  toast.error(error.message);
}
  };

  // Theme Config
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-900',
    label: isDarkMode ? 'text-slate-300' : 'text-slate-700',
    primary: 'bg-teal-600 hover:bg-teal-700',
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 p-6 lg:p-12 ${theme.bg}`}>
      <Toaster position="top-right" />
      
      {/* Header Actions */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white text-slate-600 hover:shadow-sm'}`}
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className={`lg:col-span-2 rounded-3xl border p-8 ${theme.card}`}>
          <div className="mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${theme.text}`}>Schedule a Donation Camp</h1>
            <p className={theme.subtext}>Create a new drive event to notify nearby donors.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Camp Name */}
            <div className="space-y-2">
              <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                <Building2 className="w-4 h-4 text-teal-500" /> Camp Name
              </label>
              <input 
                type="text" 
                name="campName"
                value={formData.campName}
                onChange={handleChange}
                placeholder="e.g. City Plaza Blood Drive"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
              />
            </div>

            {/* Location & Date Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                  <MapPin className="w-4 h-4 text-teal-500" /> Location / Address
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Central Community Hall"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                  <Calendar className="w-4 h-4 text-teal-500" /> Date
                </label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
                />
              </div>
            </div>

            {/* Time Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                  <Clock className="w-4 h-4 text-teal-500" /> Start Time
                </label>
                <input 
                  type="time" 
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                  <Clock className="w-4 h-4 text-teal-500" /> End Time
                </label>
                <input 
                  type="time" 
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
                />
              </div>
            </div>

            {/* Target & Organizer Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                  <Users className="w-4 h-4 text-teal-500" /> Target Donors (Est.)
                </label>
                <input 
                  type="number" 
                  name="targetDonors"
                  value={formData.targetDonors}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                  <Building2 className="w-4 h-4 text-teal-500" /> Organizer Name
                </label>
                <input 
                  type="text" 
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleChange}
                  placeholder="e.g. Red Cross Society"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all ${theme.input}`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className={`text-sm font-medium flex items-center gap-2 ${theme.label}`}>
                <FileText className="w-4 h-4 text-teal-500" /> Description / Notes
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Additional details for donors..."
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none ${theme.input}`}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 ${theme.primary} ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Publish Camp Schedule
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Preview / Tips */}
        <div className="space-y-6">
          
          {/* Live Preview Card */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme.subtext}`}>Donor Preview</h3>
            
            {/* The Card */}
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-gray-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex flex-col items-center justify-center text-teal-700 font-bold text-xs">
                  <span className="text-sm">{formData.date ? new Date(formData.date).getDate() : 'DD'}</span>
                  <span>{formData.date ? new Date(formData.date).toLocaleString('default', { month: 'short' }).toUpperCase() : 'MON'}</span>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-teal-100 text-teal-700 uppercase">Upcoming</span>
              </div>
              
              <h4 className={`font-bold text-lg mb-1 line-clamp-1 ${theme.text}`}>
                {formData.campName || "Camp Name"}
              </h4>
              <p className={`text-sm mb-4 line-clamp-1 ${theme.subtext}`}>
                {formData.location || "Location will appear here"}
              </p>

              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-xs ${theme.subtext}`}>
                  <Clock className="w-3.5 h-3.5" /> 
                  {formData.startTime || "09:00"} - {formData.endTime || "17:00"}
                </div>
                <div className={`flex items-center gap-2 text-xs ${theme.subtext}`}>
                  <Users className="w-3.5 h-3.5" /> 
                  {formData.targetDonors || "0"} Slots Available
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold">
                Register Now
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>Camp Guidelines</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-indigo-200/70' : 'text-indigo-800/70'}`}>
                  Ensure your location has adequate space for beds, waiting areas, and refreshments. Verification is required 24 hours before the event.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AddCamp;