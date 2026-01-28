import React from 'react';
import { Calendar, Droplet, Heart, Clock, ArrowRight } from 'lucide-react';

const DonorHome = ({ user, stats, isDarkMode }) => {
  
  // Default values if stats haven't loaded yet
  const data = stats || {
    totalDonations: 0,
    livesSaved: 0,
    lastDonationDate: null,
    nextEligibleDate: new Date()
  };

  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  // Format Dates
  const nextDate = new Date(data.nextEligibleDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const lastDate = data.lastDonationDate 
    ? new Date(data.lastDonationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    : "No donations yet";

  return (
    <div className="space-y-6">
      
      {/* 1. Impact Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lives Saved */}
        <div className={`p-6 rounded-3xl border flex items-center gap-5 ${theme.card}`}>
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${theme.text}`}>{data.livesSaved}</p>
            <p className={`text-sm ${theme.subtext}`}>Lives Impacted</p>
          </div>
        </div>

        {/* Total Donations */}
        <div className={`p-6 rounded-3xl border flex items-center gap-5 ${theme.card}`}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Droplet className="w-7 h-7 fill-current" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${theme.text}`}>{data.totalDonations}</p>
            <p className={`text-sm ${theme.subtext}`}>Total Donations</p>
          </div>
        </div>

        {/* Next Eligible Date */}
        <div className={`p-6 rounded-3xl border flex items-center gap-5 ${theme.card}`}>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className={`text-lg font-bold ${theme.text}`}>{nextDate}</p>
            <p className={`text-sm ${theme.subtext}`}>Next Eligible Date</p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className={`p-6 rounded-3xl border ${theme.card}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold text-lg ${theme.text}`}>Recent Activity</h3>
            <span className={`text-xs px-3 py-1 rounded-full border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
              Last: {lastDate}
            </span>
          </div>

          <div className="space-y-4">
            {data.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((camp) => (
                <div key={camp._id} className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-950/50' : 'border-gray-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-xs">
                      {camp.campName.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${theme.text}`}>{camp.campName}</h4>
                      <p className="text-xs text-gray-400">{new Date(camp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    Completed
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 opacity-50">
                <p>No recent activity found.</p>
                <p className="text-xs mt-1">Join a camp to save lives!</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-1 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500">
          <div className={`h-full rounded-[22px] p-8 flex flex-col justify-center items-start ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
             <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">Urgent Need</span>
             <h3 className={`text-2xl font-bold mb-2 ${theme.text}`}>Ready to save a life?</h3>
             <p className={`text-sm mb-8 leading-relaxed ${theme.subtext}`}>
               There are 3 donation camps happening near <strong>{user.address || 'your location'}</strong> this week. Your donation can make a world of difference.
             </p>
             <button className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2">
               Find a Camp <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DonorHome;