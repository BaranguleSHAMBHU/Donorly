import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const UpcomingCamps = ({ camps, loading, isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    itemBorder: isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50',
    dateBox: isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600',
  };

  return (
    <div className={`rounded-3xl border p-6 h-full flex flex-col ${theme.card}`}>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-teal-500" /> Upcoming Camps
      </h3>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {loading ? (
          <p className={`text-center py-4 ${theme.subtext}`}>Loading schedules...</p>
        ) : camps.length === 0 ? (
          <div className="text-center py-8">
            <p className={theme.subtext}>No camps scheduled yet.</p>
          </div>
        ) : (
          camps.map((camp) => (
            <div key={camp._id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-colors ${theme.itemBorder}`}>
              {/* Date Box */}
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-xs font-bold shrink-0 ${theme.dateBox}`}>
                <span>{new Date(camp.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                <span className="text-lg">{new Date(camp.date).getDate()}</span>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{camp.campName}</h4>
                <div className={`flex items-center gap-3 mt-1 text-xs ${theme.subtext}`}>
                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {camp.startTime}</span>
                   <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" /> {camp.location}</span>
                </div>
              </div>

              {/* Status Dot */}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Confirmed"></span>
            </div>
          ))
        )}
      </div>

      <button className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm border transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}>
        View All Schedules
      </button>
    </div>
  );
};

export default UpcomingCamps;