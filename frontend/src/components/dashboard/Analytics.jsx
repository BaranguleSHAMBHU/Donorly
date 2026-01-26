import React from 'react';
import { Download, FileText, PieChart, TrendingUp, Users } from 'lucide-react';

const Analytics = ({ isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  const reports = [
    { name: 'Monthly Donation Summary', date: 'Jan 2026', size: '2.4 MB' },
    { name: 'Camp Performance Report', date: 'Dec 2025', size: '1.8 MB' },
    { name: 'Inventory Usage Log', date: 'Q4 2025', size: '4.1 MB' },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      
      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Collection Rate', val: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Avg Donor Age', val: '28 Yrs', icon: Users, color: 'text-blue-500' },
          { label: 'Camp Efficiency', val: '92%', icon: PieChart, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${theme.card}`}>
             <div className="flex items-center gap-3 mb-2">
               <stat.icon className={`w-5 h-5 ${stat.color}`} />
               <p className={`text-sm font-bold ${theme.subtext}`}>{stat.label}</p>
             </div>
             <p className={`text-2xl font-bold ${theme.text}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Downloadable Reports */}
      <div className={`rounded-3xl border p-6 ${theme.card}`}>
        <h3 className="text-xl font-bold mb-6">Generated Reports</h3>
        <div className="space-y-4">
          {reports.map((report, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-bold ${theme.text}`}>{report.name}</p>
                  <p className={`text-xs ${theme.subtext}`}>Generated: {report.date} • {report.size}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;