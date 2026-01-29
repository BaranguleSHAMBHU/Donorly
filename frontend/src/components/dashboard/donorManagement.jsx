import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Phone, Droplet, ChevronDown, CheckCircle, Bell, FileText, Download, FileUp } from 'lucide-react';
import toast from 'react-hot-toast';
import ReportUploadModal from './ReportUploadModal.jsx'; // ✅ Import the Modal

const DonorManagement = ({ isDarkMode }) => {
  const [camps, setCamps] = useState([]);
  const [selectedCampId, setSelectedCampId] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState(null);

  // 1. Fetch Organization's Camps on Load
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const storedOrg = JSON.parse(localStorage.getItem("orgUser"));
        const token = localStorage.getItem("orgToken");
        
        if (!storedOrg || !token) return;

        const res = await axios.get("http://localhost:5000/api/camps");
        
        // Filter: Only show camps created by THIS logged-in organization
        const myCamps = res.data.filter(c => {
            const campOrgId = c.organizationId?._id || c.organizationId;
            return String(campOrgId) === String(storedOrg._id || storedOrg.id);
        });
        
        setCamps(myCamps);
        
        if (myCamps.length > 0) {
          setSelectedCampId(myCamps[0]._id);
        }
      } catch (error) {
        console.error("Error loading camps", error);
        toast.error("Could not load camps.");
      }
    };
    fetchCamps();
  }, []);

  // 2. Fetch Donors when Selected Camp Changes
  useEffect(() => {
    if (!selectedCampId) return;

    const fetchDonors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/camps/${selectedCampId}`);
        const donorList = (res.data.registeredDonors || []).map(d => ({
            ...d,
            status: d.status || 'Registered' 
        }));
        setDonors(donorList);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load donor list");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [selectedCampId]);

  // 3. Handle Check-In Action
  const handleCheckIn = async (donorId) => {
    try {
        const res = await axios.put(`http://localhost:5000/api/camps/${selectedCampId}/checkin`, 
            { donorId },
            { headers: { Authorization: `Bearer ${localStorage.getItem("orgToken")}` } }
        );

        // Optimistic UI Update
        setDonors(prev => prev.map(d => 
            d._id === donorId ? { ...d, status: 'Donated', donationId: res.data.donationId } : d
        ));
        
        toast.success("Donation recorded successfully!");
        // Refresh list to get the new Donation ID from backend
        // fetchDonors(); // Optional: Uncomment to be safe
    } catch (error) {
        toast.error(error.response?.data?.message || "Check-in failed");
    }
  };

  // 4. Handle Notify Donors
  const handleNotifyDonors = async () => {
    if (!selectedCampId) return;
    
    const confirmNotify = window.confirm("Send a reminder notification to all registered donors?");
    if (!confirmNotify) return;

    try {
      const token = localStorage.getItem("orgToken");
      await axios.post("http://localhost:5000/api/notifications/send-camp-alert", {
        campId: selectedCampId,
        message: "🔔 Reminder: Our blood donation drive is live! Please visit the camp location.",
        type: 'reminder'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Notifications sent successfully!");
    } catch (error) {
      toast.error("Failed to send notifications.");
    }
  };

  // Theme Helpers
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-900',
    tableHeader: isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-gray-50 text-gray-500',
    row: isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50',
  };

  const filteredDonors = donors.filter(d => 
    d.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold mb-1">Live Check-in Console</h2>
           <p className={theme.subtext}>Select a camp to view registered donors.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Camp Selector Dropdown */}
          <div className="relative">
            <select 
              value={selectedCampId}
              onChange={(e) => setSelectedCampId(e.target.value)}
              className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl border outline-none cursor-pointer min-w-[200px] ${theme.input}`}
            >
              <option value="" disabled>Select a Camp</option>
              {camps.map(camp => (
                <option key={camp._id} value={camp._id}>{camp.campName}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search donor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2.5 rounded-xl border outline-none w-full sm:w-48 ${theme.input}`}
            />
          </div>

          {/* Notify Button */}
          <button 
            onClick={handleNotifyDonors}
            disabled={!selectedCampId || donors.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            title="Send reminder to all registered donors"
          >
            <Bell className="w-4 h-4" /> 
            <span className="hidden md:inline">Notify All</span>
          </button>
        </div>
      </div>

      {/* Donors Table */}
      <div className={`rounded-3xl border overflow-hidden ${theme.card}`}>
        {loading ? (
          <div className="p-12 text-center opacity-50">Loading donor list...</div>
        ) : filteredDonors.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
             <Users className="w-12 h-12 text-gray-300 mb-3" />
             <p className="font-bold text-lg text-gray-400">No donors found.</p>
             <p className="text-sm text-gray-400">
               {camps.length === 0 ? "You haven't created any camps yet." : "No one has registered for this camp yet."}
             </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${theme.tableHeader}`}>
                  <th className="p-5">Donor Name</th>
                  <th className="p-5">Blood Group</th>
                  <th className="p-5">Contact</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`text-sm ${theme.text}`}>
                {filteredDonors.map((donor) => (
                  <tr key={donor._id} className={`border-b transition-colors ${theme.row}`}>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                           {donor.fullName?.charAt(0) || 'D'}
                         </div>
                         <div>
                           <p className="font-bold">{donor.fullName || 'Unknown'}</p>
                           <p className={`text-xs ${theme.subtext}`}>ID: #{donor._id.slice(-4)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                        <span className="font-bold text-rose-600 dark:text-rose-400">{donor.bloodGroup || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3 opacity-50" />
                        {donor.phone || "Not Provided"}
                      </div>
                    </td>
                    <td className="p-5">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                         donor.status === 'Donated' 
                           ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                           : 'bg-amber-100 text-amber-700 border-amber-200'
                       }`}>
                         {donor.status || 'Registered'}
                       </span>
                    </td>
                    <td className="p-5 text-right">
                      {donor.status === 'Donated' ? (
                        <div className="flex flex-col gap-2 items-end">
                            <span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1">
                              <CheckCircle className="w-4 h-4" /> Checked In
                            </span>
                            
                            <div className="flex gap-2">
                              {/* Certificate Download */}
                              <a 
                                href={`http://localhost:5000/api/camps/${selectedCampId}/certificate/${donor._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg border border-teal-600 text-teal-600 text-xs font-bold hover:bg-teal-50 transition-colors flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" /> Cert
                              </a>

                              {/* Upload Report Button */}
                              <button 
                                onClick={() => {
                                  // Open Modal and set Donation ID
                                  // Requires backend getCampDetails to populate donationId
                                  setCurrentDonationId(donor.donationId); 
                                  setIsUploadModalOpen(true);
                                }}
                                disabled={!donor.donationId}
                                className="px-3 py-1.5 rounded-lg border border-purple-500 text-purple-600 text-xs font-bold hover:bg-purple-50 flex items-center gap-1 disabled:opacity-50"
                              >
                                <FileUp className="w-3 h-3" /> Report
                              </button>
                            </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleCheckIn(donor._id)}
                          className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-lg shadow-teal-500/20"
                        >
                          Check In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Report Upload Modal Placed Here */}
      <ReportUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        donationId={currentDonationId} 
        onSuccess={() => {
           // Optionally refresh list or just close
        }}
      />
    </div>
  );
};

export default DonorManagement;