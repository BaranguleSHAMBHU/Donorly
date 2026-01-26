import React from 'react';

const BloodInventory = ({ isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    itemBg: isDarkMode ? 'border-slate-800 bg-slate-950/50' : 'border-gray-100 bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    primary: isDarkMode ? 'text-teal-400' : 'text-teal-600',
  };

  const inventory = [
    { group: 'A+', units: 45, status: 'Stable' },
    { group: 'A-', units: 12, status: 'Low' },
    { group: 'B+', units: 58, status: 'High' },
    { group: 'B-', units: 8, status: 'Critical' },
    { group: 'O+', units: 62, status: 'High' },
    { group: 'O-', units: 5, status: 'Critical' },
    { group: 'AB+', units: 24, status: 'Stable' },
    { group: 'AB-', units: 3, status: 'Critical' },
  ];

  return (
    <div className={`lg:col-span-2 rounded-3xl border p-6 ${theme.card}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Live Inventory</h3>
        <button className={`text-sm font-semibold hover:underline ${theme.primary}`}>Update Stock</button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {inventory.map((item, i) => (
          <div key={i} className={`p-4 rounded-2xl border text-center transition-all hover:scale-105 ${theme.itemBg}`}>
            <div className={`text-2xl font-black mb-1 ${theme.text}`}>{item.group}</div>
            <div className={`text-sm font-medium mb-3 ${
              item.status === 'Critical' ? 'text-red-500' : item.status === 'Low' ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {item.units} units
            </div>
            <div className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full inline-block ${
              item.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 
              item.status === 'Low' ? 'bg-amber-500/10 text-amber-500' : 
              'bg-emerald-500/10 text-emerald-500'
            }`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodInventory;