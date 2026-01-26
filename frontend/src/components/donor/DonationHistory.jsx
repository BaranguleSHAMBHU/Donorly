import React from 'react';
import { Calendar, MapPin, Droplet, CheckCircle, Clock } from 'lucide-react';

const DonationHistory = ({ isDarkMode }) => {
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    timelineLine: isDarkMode ? 'bg-slate-800' : 'bg-rose-100',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    dateBox: isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600',
  };

  const history = [
    { 
      id: 1, 
      date: '2025-10-15', 
      location: 'City Hospital', 
      type: 'Whole Blood', 
      amount: '450ml', 
      status: 'Completed',
      credits: '+50' 
    },
    { 
      id: 2, 
      date: '2025-06-20', 
      location: 'Red Cross Camp', 
      type: 'Whole Blood', 
      amount: '450ml', 
      status: 'Completed',
      credits: '+50' 
    },
    { 
      id: 3, 
      date: '2025-02-10', 
      location: 'Metro Blood Bank', 
      type: 'Platelets', 
      amount: '300ml', 
      status: 'Completed',
      credits: '+75' 
    }
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold">Donation Journey</h2>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
          Next Eligible: NOW
        </span>
      </div>

      <div className="relative pl-8 border-l-2 space-y-12 border-rose-200/50 dark:border-slate-800 ml-4">
        
        {/* Timeline Items */}
        {history.map((item, index) => (
          <div key={item.id} className="relative group">
            {/* Dot on Timeline */}
            <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-slate-950 ${index === 0 ? 'bg-rose-600 shadow-lg shadow-rose-500/30' : 'bg-slate-300 dark:bg-slate-700'}`}></div>

            <div className={`p-6 rounded-3xl border transition-all hover:shadow-lg ${theme.card}`}>
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-bold shrink-0 ${theme.dateBox}`}>
                    <span>{new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-lg">{new Date(item.date).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.location}</h3>
                    <p className={`text-xs ${theme.subtext} flex items-center gap-1`}>
                      <Clock className="w-3 h-3" /> {new Date(item.date).getFullYear()} • {item.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <p className="text-xs font-bold text-rose-500">{item.credits} Impact Pts</p>
                      <p className={`text-xs ${theme.subtext}`}>{item.amount}</p>
                   </div>
                   <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              {/* Certificate Download Button (Mini) */}
              <div className="pt-4 mt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-end">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                  Download Certificate &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Start of Journey */}
        <div className="relative">
          <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-rose-100 border-4 border-white dark:border-slate-950 dark:bg-slate-800"></div>
          <p className={`text-sm italic ${theme.subtext} pl-2`}>Joined Donorly Network</p>
        </div>

      </div>
    </div>
  );
};

export default DonationHistory;