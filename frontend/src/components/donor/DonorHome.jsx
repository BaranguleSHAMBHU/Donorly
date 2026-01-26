import React from 'react';
import { QrCode, Calendar, MapPin, ChevronRight, Droplet, ArrowUpRight } from 'lucide-react';

const DonorHome = ({ user, isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      
      {/* Left Column: Digital Card & Upcoming */}
      <div className="lg:col-span-1 space-y-8">
        
        {/* Digital Donor Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-rose-800 text-white p-6 shadow-2xl shadow-rose-900/20">
          {/* Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">Verified Donor</span>
              <Droplet className="w-6 h-6 text-rose-200 fill-rose-200" />
            </div>
            
            <div className="text-center mb-8">
              <div className="bg-white p-3 rounded-2xl w-32 h-32 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <p className="text-rose-100 text-xs">Scan at camp to check-in</p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-rose-200 text-sm">Donor Name</p>
                <p className="font-bold text-lg">{user.fullName}</p>
              </div>
              <div className="text-right">
                <p className="text-rose-200 text-sm">Group</p>
                <p className="font-bold text-3xl">{user.bloodGroup || 'O+'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointment */}
        <div className={`p-6 rounded-3xl border ${theme.card}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Next Appointment</h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">CONFIRMED</span>
          </div>
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex flex-col items-center justify-center text-rose-700 font-bold text-xs">
              <span className="text-sm">28</span>
              <span>JAN</span>
            </div>
            <div>
              <h4 className="font-bold">City Plaza Drive</h4>
              <p className={`text-xs ${theme.subtext}`}>09:00 AM • Main Hall</p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50 transition-colors">
            Get Directions
          </button>
        </div>
      </div>

      {/* Right Column: Stats & Recommendations */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Health Stats Row */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Last Donation', val: '95 days ago', color: 'text-slate-700 dark:text-white' },
            { label: 'Hemoglobin', val: '14.2 g/dL', color: 'text-emerald-500' },
            { label: 'Blood Pressure', val: '120/80', color: 'text-blue-500' }
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${theme.card}`}>
              <p className={`text-xs ${theme.subtext} mb-1`}>{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Recommended Camps */}
        <div className={`p-6 rounded-3xl border ${theme.card}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recommended Camps Nearby</h3>
            <button className="text-rose-600 text-sm font-semibold flex items-center hover:underline">
              View Map <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Tech Park Blood Drive', dist: '1.2 km', date: 'Feb 02', slots: 12 },
              { name: 'University Campus', dist: '3.5 km', date: 'Feb 10', slots: 45 },
              { name: 'Community Center', dist: '5.0 km', date: 'Feb 15', slots: 8 }
            ].map((camp, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border hover:border-rose-300 transition-all cursor-pointer ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-100 hover:bg-rose-50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-800 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{camp.name}</h4>
                    <p className={`text-xs ${theme.subtext}`}>{camp.dist} away • {camp.date}</p>
                  </div>
                </div>
                <button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90">
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DonorHome;