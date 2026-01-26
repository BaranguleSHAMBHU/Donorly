import React from 'react';
import { Award, Star, Shield, Gift, Lock } from 'lucide-react';

const Rewards = ({ isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    progressBg: isDarkMode ? 'bg-slate-800' : 'bg-gray-100',
  };

  const badges = [
    { name: "First Drop", desc: "Completed 1st Donation", icon: <Star className="w-6 h-6 text-yellow-500" />, unlocked: true },
    { name: "Regular Hero", desc: "3 Donations in a Year", icon: <Shield className="w-6 h-6 text-blue-500" />, unlocked: true },
    { name: "Lifesaver", desc: "10 Lifetime Donations", icon: <Award className="w-6 h-6 text-purple-500" />, unlocked: false },
    { name: "Camp Champion", desc: "Attended 5 Camps", icon: <Award className="w-6 h-6 text-rose-500" />, unlocked: false },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Your Impact Rewards</h2>
        <p className={theme.subtext}>Earn badges and points for every life you save.</p>
      </div>

      {/* Points Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl mb-8">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-indigo-200 font-medium mb-1">Current Balance</p>
            <h3 className="text-5xl font-bold">450 <span className="text-lg font-medium opacity-70">pts</span></h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-xs">
            <p className="text-sm font-medium mb-2 flex items-center gap-2"><Gift className="w-4 h-4" /> Next Reward</p>
            <p className="text-xs text-indigo-100 mb-3">Free Health Checkup Coupon (500 pts)</p>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[90%]"></div>
            </div>
            <p className="text-[10px] text-right mt-1">50 pts to go</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <h3 className="font-bold text-lg mb-4">Achievement Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, i) => (
          <div key={i} className={`p-5 rounded-2xl border text-center relative ${theme.card} ${!badge.unlocked && 'opacity-60'}`}>
            {!badge.unlocked && <div className="absolute top-3 right-3"><Lock className="w-4 h-4 text-gray-400" /></div>}
            
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? 'bg-gray-50 dark:bg-slate-800' : 'bg-gray-100 dark:bg-slate-800 grayscale'}`}>
              {badge.icon}
            </div>
            
            <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-500">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;