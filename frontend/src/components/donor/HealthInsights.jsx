import React from 'react';
import { Activity, TrendingUp, FileText, Download } from 'lucide-react';

const HealthInsights = ({ isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  // Mock Report Data
  const reports = [
    { date: 'Oct 15, 2025', id: '#REP-9921', result: 'Normal' },
    { date: 'Jun 20, 2025', id: '#REP-8812', result: 'Normal' },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Vitals Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-3xl border ${theme.card}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><Activity className="w-5 h-5" /></div>
            <h3 className="font-bold">Hemoglobin Trend</h3>
          </div>
          {/* Simple CSS Bar Chart Visualization */}
          <div className="flex items-end justify-between h-32 gap-2 mt-4">
            {[12.5, 13.2, 13.0, 13.8, 14.2].map((val, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-rose-500/20 rounded-t-lg relative group-hover:bg-rose-500 transition-all" 
                  style={{ height: `${(val/16)*100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                </div>
                <span className={`text-[10px] ${theme.subtext}`}>Vis {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-3xl border ${theme.card}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <h3 className="font-bold">Recent Vitals</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200 dark:border-gray-700">
              <span className={theme.subtext}>Blood Pressure</span>
              <span className="font-bold">120/80 mmHg</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-200 dark:border-gray-700">
              <span className={theme.subtext}>Pulse Rate</span>
              <span className="font-bold">72 bpm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={theme.subtext}>Iron Level</span>
              <span className="font-bold text-emerald-500">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className={`rounded-3xl border p-6 ${theme.card}`}>
        <h3 className="font-bold mb-4">Medical Reports Vault</h3>
        <div className="space-y-3">
          {reports.map((report, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-bold text-sm">Blood Work Report</p>
                  <p className={`text-xs ${theme.subtext}`}>{report.date} • {report.id}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HealthInsights;