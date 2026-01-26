import React from 'react';
import { Calendar, MapPin, Users, Edit3, Trash2, ExternalLink } from 'lucide-react';

const CampManager = ({ camps, isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    header: isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-gray-50 text-gray-500',
    row: isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className={`rounded-3xl border overflow-hidden ${theme.card}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs uppercase tracking-wider ${theme.header}`}>
              <th className="p-6">Camp Details</th>
              <th className="p-6">Date & Time</th>
              <th className="p-6">Target vs Registered</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`text-sm ${theme.text}`}>
            {camps.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center opacity-50">No camps scheduled.</td></tr>
            ) : (
              camps.map((camp) => (
                <tr key={camp._id} className={`border-b transition-colors ${theme.row}`}>
                  <td className="p-6">
                    <p className="font-bold text-base">{camp.campName}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${theme.subtext}`}>
                      <MapPin className="w-3 h-3" /> {camp.location}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-teal-50 text-teal-700'}`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold">{new Date(camp.date).toLocaleDateString()}</p>
                        <p className={`text-xs ${theme.subtext}`}>{camp.startTime} - 17:00</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="w-full max-w-[120px]">
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span>45 Reg</span>
                        <span className={theme.subtext}>Target: 100</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[45%]"></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Confirmed
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampManager;