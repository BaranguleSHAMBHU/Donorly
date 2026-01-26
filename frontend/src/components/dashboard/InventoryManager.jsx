import React, { useState } from 'react';
import { Droplet, Plus, Minus, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryManager = ({ isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    btnBg: isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  // Mock State
  const [inventory, setInventory] = useState([
    { group: 'A+', units: 45, status: 'Stable' },
    { group: 'A-', units: 8, status: 'Critical' }, // Low stock
    { group: 'B+', units: 58, status: 'High' },
    { group: 'B-', units: 12, status: 'Low' },
    { group: 'O+', units: 62, status: 'High' },
    { group: 'O-', units: 4, status: 'Critical' },
    { group: 'AB+', units: 24, status: 'Stable' },
    { group: 'AB-', units: 3, status: 'Critical' },
  ]);

  const updateStock = (index, change) => {
    const newInventory = [...inventory];
    const current = newInventory[index].units;
    
    if (current + change < 0) return; // Prevent negative stock

    newInventory[index].units += change;
    
    // Auto-update status logic
    if (newInventory[index].units < 10) newInventory[index].status = 'Critical';
    else if (newInventory[index].units < 20) newInventory[index].status = 'Low';
    else if (newInventory[index].units > 50) newInventory[index].status = 'High';
    else newInventory[index].status = 'Stable';

    setInventory(newInventory);
    toast.success(`${newInventory[index].group} stock updated`);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Blood Stock Management</h2>
          <p className={theme.subtext}>Update live inventory levels and monitor expiry.</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700">
           <RefreshCw className="w-4 h-4" /> Sync with Central Bank
        </button>
      </div>

      {/* Critical Alerts */}
      {inventory.some(i => i.status === 'Critical') && (
        <div className="mb-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Critical Shortage Alert</p>
            <p className="text-sm">
              The following groups are below safe levels: 
              {inventory.filter(i => i.status === 'Critical').map(i => <span key={i.group} className="font-bold mx-1">{i.group}</span>)}
            </p>
          </div>
        </div>
      )}

      {/* Management Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventory.map((item, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${theme.card} relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${
              item.status === 'Critical' ? 'bg-red-500' : 'bg-teal-500'
            }`}></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-3xl font-black ${theme.text}`}>{item.group}</span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  item.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                  item.status === 'Low' ? 'bg-amber-100 text-amber-700' : 
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-950/50 rounded-xl p-2 mb-4">
                <button 
                  onClick={() => updateStock(i, -1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${theme.btnBg} ${theme.text}`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`text-xl font-bold ${theme.text}`}>{item.units}</span>
                <button 
                  onClick={() => updateStock(i, 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
 
              <div className={`text-xs ${theme.subtext} text-center`}>
                Last updated: Just now
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManager;