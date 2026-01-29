import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Calendar, MapPin, FileText } from 'lucide-react';

const DonationHistory = ({ isDarkMode }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme Helpers
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("donorToken");
        // 👇 UPDATED: Fetch from the new 'donations' endpoint
        const res = await axios.get("http://localhost:5000/api/auth/donations", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-center opacity-50">Loading history...</div>;

  return (
    <div className="space-y-4">
      <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>My Donation Journey</h3>
      
      {history.length === 0 ? (
        <div className={`p-8 text-center border rounded-2xl ${theme.card}`}>
            <p className="opacity-50">You haven't made any donations yet.</p>
        </div>
      ) : (
        history.map(donation => (
          <div 
            key={donation._id} 
            className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-rose-200 ${theme.card}`}
          >
            
            {/* Camp Info (Accessed via donation.campId) */}
            <div>
              <h4 className={`font-bold text-lg ${theme.text}`}>
                  {donation.campId ? donation.campId.campName : "Unknown Camp"}
              </h4>
              <div className={`flex gap-4 text-sm mt-1 ${theme.subtext}`}>
                <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> 
                    {new Date(donation.date).toLocaleDateString()}
                </span>
                {donation.campId && (
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> 
                        {donation.campId.location}
                    </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                
                {/* 1. Certificate Button */}
                {/* Use donation.campId._id and donation.donorId */}
                {donation.campId && (
                    <a 
                    href={`http://localhost:5000/api/camps/${donation.campId._id}/certificate/${donation.donorId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition-all text-sm border border-rose-100"
                    >
                    <Download className="w-4 h-4" />
                    <span>Certificate</span>
                    </a>
                )}

                {/* 2. Medical Report Button (Now it will work!) */}
                {donation.medicalReport && (
                  <a 
                    href={`http://localhost:5000/${donation.medicalReport}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-600 font-bold hover:bg-purple-600 hover:text-white transition-all text-sm border border-purple-100"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Report</span>
                  </a>
                )}

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default DonationHistory;