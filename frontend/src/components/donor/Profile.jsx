import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Calendar, Droplet, Edit3, Save, Shield } from "lucide-react";
import toast from "react-hot-toast";

const Profile = ({ isDarkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // FETCH PROFILE
 useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from LocalStorage
        const token = localStorage.getItem("donorToken");
        if (!token) {
          console.error("No token found");
          return;
        }

        // 1. Use Full Backend URL
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;

        // 2. Format Date for Input Field (Extract YYYY-MM-DD)
        if (userData.dob) {
          userData.dob = userData.dob.split('T')[0];
        }

        // 3. Ensure no fields are undefined (prevents uncontrolled input warnings)
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          dob: userData.dob || '',
          bloodGroup: userData.bloodGroup || '',
          gender: userData.gender || 'Male', // Default if missing
          address: userData.address || '',
        });

      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // LOADING STATE
  if (!formData) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  // UPDATE HANDLER
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("donorToken");
      const res = await axios.put("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  const theme = {
    card: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200 shadow-sm",
    input: isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-gray-50 border-gray-200 text-slate-900",
    label: isDarkMode ? "text-slate-400" : "text-slate-500",
    text: isDarkMode ? "text-white" : "text-slate-800",
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">My Profile</h2>
          <p className={theme.label}>Manage your personal information and contact details.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            isEditing 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20' 
              : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className={`lg:col-span-1 p-6 rounded-3xl border text-center ${theme.card}`}>
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 p-1">
              <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                {/* Placeholder Avatar */}
                <User className="w-16 h-16 text-rose-500" /> 
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-white dark:border-slate-900">
               <Shield className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
          
          <h3 className={`text-xl font-bold mb-1 ${theme.text}`}>{formData.fullName}</h3>
          <p className={`text-sm mb-6 ${theme.label}`}>Donor ID: #DNR-{formData._id ? formData._id.slice(-6).toUpperCase() : '8821'}</p>

          <div className={`p-4 rounded-2xl text-left ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
             <p className="text-xs font-bold uppercase text-rose-500 mb-2">Medical Status</p>
             <div className="flex justify-between text-sm mb-1">
               <span className={theme.label}>Blood Group</span>
               <span className="font-bold">{formData.bloodGroup}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className={theme.label}>Status</span>
               <span className="font-bold text-emerald-500">Eligible</span>
             </div>
          </div>
        </div>

        {/* Right Column: Detailed Form */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${theme.card}`}>
          <form className="space-y-6">
            
            {/* Personal Details */}
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-gray-100 text-gray-400'}`}>Personal Information</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${theme.input} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${theme.input} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Gender</label>
                  <select 
                    name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${theme.input} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Blood Group (Read Only)</label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" value={formData.bloodGroup} disabled
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none opacity-50 cursor-not-allowed ${theme.input}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-gray-100 text-gray-400'}`}>Contact Details</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${theme.input} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${theme.input} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className={`text-xs font-bold ${theme.label}`}>Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea 
                      name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} rows="2"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none ${theme.input} ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl text-sm font-bold border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Save Changes
                </button>
              </div>
            )}

          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;