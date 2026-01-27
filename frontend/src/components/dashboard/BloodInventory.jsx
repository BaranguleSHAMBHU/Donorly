import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplet, RefreshCw, AlertTriangle, Plus, Minus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const BloodInventory = ({ isDarkMode }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // Track which item is updating

  // 1. Fetch Real Inventory on Load
  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("orgToken");
      const res = await axios.get("http://localhost:5000/api/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The backend returns { stock: [...] }, so we set that array
      setInventory(res.data.stock || []);
    } catch (error) {
      console.error("Failed to load inventory", error);
      // Fallback mock data if backend is empty/fails, so UI doesn't break
      setInventory([
        { bloodGroup: 'A+', units: 0, status: 'Critical' },
        { bloodGroup: 'B+', units: 0, status: 'Critical' },
        { bloodGroup: 'O+', units: 0, status: 'Critical' },
        { bloodGroup: 'AB+', units: 0, status: 'Critical' },
        { bloodGroup: 'A-', units: 0, status: 'Critical' },
        { bloodGroup: 'B-', units: 0, status: 'Critical' },
        { bloodGroup: 'O-', units: 0, status: 'Critical' },
        { bloodGroup: 'AB-', units: 0, status: 'Critical' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 2. Handle Stock Update (+ or -)
  const updateStock = async (bloodGroup, change) => {
    setUpdating(bloodGroup); // Show spinner on specific card

    // Optimistic Update (Update UI immediately for speed)
    const oldInventory = [...inventory];
    const newInventory = inventory.map(item => {
      if (item.bloodGroup === bloodGroup) {
        const newUnits = Math.max(0, item.units + change);
        let newStatus = 'Stable';
        if (newUnits < 5) newStatus = 'Critical';
        else if (newUnits < 15) newStatus = 'Low';
        
        return { ...item, units: newUnits, status: newStatus };
      }
      return item;
    });
    setInventory(newInventory);

    try {
      const token = localStorage.getItem("orgToken");
      
      // Calculate new quantity for API
      const targetItem = newInventory.find(i => i.bloodGroup === bloodGroup);
      
      await axios.put("http://localhost:5000/api/inventory", {
        bloodGroup,
        quantity: targetItem.units
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Optional: Silent success or small toast
      // toast.success(`${bloodGroup} updated`);

    } catch (error) {
      toast.error("Update failed, reverting...");
      setInventory(oldInventory); // Revert on failure
    } finally {
      setUpdating(null);
    }
  };

  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    itemBg: isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-gray-100',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  // Helper to get color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Low': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getProgressColor = (status) => {
    switch(status) {
      case 'Critical': return 'bg-rose-500';
      case 'Low': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className={`rounded-3xl border p-6 ${theme.card}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${theme.text}`}>
            <Droplet className="w-5 h-5 text-rose-500 fill-rose-500" /> Live Inventory
          </h3>
          <p className={`text-xs mt-1 ${theme.subtext}`}>Real-time blood availability across all groups.</p>
        </div>
        <button 
          onClick={fetchInventory}
          className={`p-2 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${loading ? 'animate-spin' : ''}`}
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${theme.subtext}`} />
        </button>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {inventory.map((item, i) => (
          <div 
            key={i} 
            className={`relative p-4 rounded-2xl border transition-all group hover:scale-[1.02] hover:shadow-lg ${theme.itemBg} ${item.status === 'Critical' ? 'animate-pulse-slow border-rose-500/30' : ''}`}
          >
            {/* Header: Blood Group & Status Badge */}
            <div className="flex justify-between items-start mb-3">
              <div className={`text-2xl font-black ${theme.text}`}>
                {item.bloodGroup}
              </div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                {item.status.toUpperCase()}
              </div>
            </div>

            {/* Units & Controls */}
            <div className="flex items-center justify-between mb-3">
               <button 
                 onClick={() => updateStock(item.bloodGroup, -1)}
                 disabled={item.units === 0 || updating === item.bloodGroup}
                 className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors disabled:opacity-30"
               >
                 <Minus className="w-4 h-4" />
               </button>

               <div className={`text-xl font-bold ${updating === item.bloodGroup ? 'opacity-50' : ''} ${theme.text}`}>
                 {item.units}
               </div>

               <button 
                 onClick={() => updateStock(item.bloodGroup, 1)}
                 disabled={updating === item.bloodGroup}
                 className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors"
               >
                 <Plus className="w-4 h-4" />
               </button>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${getProgressColor(item.status)}`}
                 style={{ width: `${Math.min((item.units / 50) * 100, 100)}%` }} // Assumes 50 is "full" for visual scaling
               ></div>
            </div>

            {/* Subtext */}
            <div className="mt-2 text-[10px] text-right opacity-50 flex items-center justify-end gap-1">
               {item.status === 'Stable' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
               <span>{item.units > 0 ? 'In Stock' : 'Out of Stock'}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Alert if Critical */}
      {inventory.some(i => i.status === 'Critical') && (
        <div className="mt-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Critical Shortage Alert</p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
              Low stock detected for: {inventory.filter(i => i.status === 'Critical').map(i => i.bloodGroup).join(', ')}. Please initiate a drive immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodInventory;