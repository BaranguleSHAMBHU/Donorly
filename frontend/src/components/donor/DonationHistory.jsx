import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, Calendar, MapPin, CheckCircle } from 'lucide-react';

const DonationHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = JSON.parse(localStorage.getItem("donorUser"));
      // Fetch all camps, filter for ones where this user is registered AND status is 'Donated'
      // Note: For a real app, you'd want a dedicated endpoint like /api/donors/my-history
      // For now, we can filter client-side if the dataset is small
      
      const res = await axios.get("http://localhost:5000/api/camps");
      const myDonations = res.data.filter(camp => 
        camp.registeredDonors.some(d => (d._id === user.id || d === user.id))
        // && check status if you added status to schema
      );
      setHistory(myDonations);
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">My Certificates</h3>
      
      {history.map(camp => (
        <div key={camp._id} className="p-6 rounded-2xl border bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 flex justify-between items-center group hover:border-rose-200 transition-all">
          
          <div>
            <h4 className="font-bold text-lg text-slate-800 dark:text-white">{camp.campName}</h4>
            <div className="flex gap-4 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(camp.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {camp.location}</span>
            </div>
          </div>

          <a 
            href={`http://localhost:5000/api/camps/${camp._id}/certificate/${JSON.parse(localStorage.getItem("donorUser")).id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Certificate</span>
          </a>

        </div>
      ))}
    </div>
  );
};

export default DonationHistory;