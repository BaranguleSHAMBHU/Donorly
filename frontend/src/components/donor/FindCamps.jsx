import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, Clock, CheckCircle, Navigation, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FindCamps = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null); // Track which camp is registering

  // Get User Info for Registration Check
  const user = JSON.parse(localStorage.getItem("donorUser"));
  const token = localStorage.getItem("donorToken");

  // ✅ FETCH REAL CAMPS
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/camps");
        
        // Transform Data for UI
        const formattedCamps = res.data.map(camp => ({
          id: camp._id,
          name: camp.campName,
          org: camp.organizerName || "Organization",
          date: new Date(camp.date).toLocaleDateString('en-US', { 
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
          }),
          time: `${camp.startTime} - ${camp.endTime}`,
          location: camp.location,
          dist: "2.5 km", // Geo-location is complex, keeping static for now
          // Check if current user ID is in the registeredDonors array
          registered: camp.registeredDonors?.includes(user?.id) || false
        }));

        setCamps(formattedCamps);
      } catch (error) {
        console.error("Error fetching camps:", error);
        toast.error("Failed to load camps");
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [user?.id]); // Re-run if user changes

  // ✅ REAL REGISTRATION
  const handleRegister = async (campId) => {
    if (!token) {
      toast.error("Please login to register");
      return;
    }

    setRegisteringId(campId);

    try {
      await axios.post(
        `http://localhost:5000/api/camps/${campId}/register`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI state locally
      setCamps(prevCamps => prevCamps.map(camp => 
        camp.id === campId ? { ...camp, registered: true } : camp
      ));

      toast.success("Registration Successful! See you there.");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setRegisteringId(null);
    }
  };

  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-900',
  };

  const filteredCamps = camps.filter(camp => 
    camp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    camp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Find Donation Drives</h2>
          <p className={theme.subtext}>Join a camp nearby and save lives.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by location or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-rose-500/20 transition-all ${theme.input}`}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
           <p className="text-center col-span-2 py-10 opacity-50 flex flex-col items-center gap-2">
             <Loader2 className="w-6 h-6 animate-spin" />
             Loading camps...
           </p>
        ) : filteredCamps.length === 0 ? (
           <div className="col-span-2 text-center py-12 rounded-3xl border border-dashed border-gray-300 dark:border-slate-800">
             <p className="font-bold text-gray-500">No camps found matching "{searchTerm}"</p>
           </div>
        ) : (
          filteredCamps.map((camp) => (
            <div key={camp.id} className={`p-6 rounded-3xl border transition-all hover:border-rose-300 dark:hover:border-rose-900 group ${theme.card}`}>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1 block">{camp.org}</span>
                   <h3 className="text-xl font-bold group-hover:text-rose-600 transition-colors">{camp.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md mb-1">{camp.dist}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className={`flex items-center gap-3 text-sm ${theme.subtext}`}>
                  <Calendar className="w-4 h-4 shrink-0" /> {camp.date}
                </div>
                <div className={`flex items-center gap-3 text-sm ${theme.subtext}`}>
                  <Clock className="w-4 h-4 shrink-0" /> {camp.time}
                </div>
                <div className={`flex items-center gap-3 text-sm ${theme.subtext}`}>
                  <MapPin className="w-4 h-4 shrink-0" /> {camp.location}
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => !camp.registered && handleRegister(camp.id)}
                  disabled={camp.registered || registeringId === camp.id}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    camp.registered 
                      ? 'bg-emerald-100 text-emerald-700 cursor-default'
                      : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20'
                  } ${registeringId === camp.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {registeringId === camp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : camp.registered ? (
                    <><CheckCircle className="w-4 h-4" /> Registered</>
                  ) : (
                    'Register Now'
                  )}
                </button>
                
                <button className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <Navigation className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindCamps;