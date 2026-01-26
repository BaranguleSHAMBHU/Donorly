import React from 'react';
import { Droplet, Bell, MapPin, Users, TrendingUp } from 'lucide-react';

const StatsOverview = ({ isDarkMode, totalCamps }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  const stats = [
    { label: 'Total Units', val: '1,240', icon: Droplet, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Pending Requests', val: '18', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Scheduled Camps', val: totalCamps || 0, icon: MapPin, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Total Donors', val: '8,432', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${theme.card}`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <TrendingUp className={`w-4 h-4 ${theme.subtext}`} />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stat.val}</h3>
          <p className={`text-sm ${theme.subtext}`}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;