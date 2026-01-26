import React, { useState } from 'react';
import { Search, CheckCircle, FileText, Send, AlertCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const DonorManagement = ({ isDarkMode }) => {
  // Mock Data: In real app, fetch this based on the selected Camp
  const [donors, setDonors] = useState([
    { id: 1, name: "John Doe", blood: "O+", status: "Registered", date: "2026-01-25" },
    { id: 2, name: "Sarah Smith", blood: "A-", status: "Donated", certificateSent: false, reportUploaded: false },
    { id: 3, name: "Mike Ross", blood: "B+", status: "Donated", certificateSent: true, reportUploaded: true },
  ]);

  const handleStatusChange = (id) => {
    setDonors(donors.map(d => d.id === id ? { ...d, status: "Donated" } : d));
    toast.success("Donor marked as present!");
  };

  const sendCertificate = (id) => {
    setDonors(donors.map(d => d.id === id ? { ...d, certificateSent: true } : d));
    toast.success("Digital Certificate sent to email!");
  };

  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    tableHeader: isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-gray-50 text-gray-500',
    row: isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className={`rounded-3xl border p-6 ${theme.card}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">Live Donor Management</h2>
          <p className={theme.subtext}>Check-in donors, issue certificates, and upload reports.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search donor name..." 
            className={`w-full pl-10 pr-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200'}`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`text-xs uppercase tracking-wider ${theme.tableHeader}`}>
              <th className="p-4 rounded-tl-xl">Donor Name</th>
              <th className="p-4">Blood Group</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
              <th className="p-4 rounded-tr-xl">Medical Report</th>
            </tr>
          </thead>
          <tbody className={`text-sm ${theme.text}`}>
            {donors.map((donor) => (
              <tr key={donor.id} className={`border-b transition-colors ${theme.row}`}>
                <td className="p-4 font-medium">{donor.name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-500 font-bold text-xs">{donor.blood}</span>
                </td>
                <td className="p-4">
                  {donor.status === "Registered" ? (
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded-full w-fit">
                      <AlertCircle className="w-3 h-3" /> Pending Check-in
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                      <CheckCircle className="w-3 h-3" /> Donated
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {donor.status === "Registered" ? (
                    <button 
                      onClick={() => handleStatusChange(donor.id)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-all"
                    >
                      Mark Present
                    </button>
                  ) : (
                    <button 
                      onClick={() => sendCertificate(donor.id)}
                      disabled={donor.certificateSent}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        donor.certificateSent 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {donor.certificateSent ? (
                        <><CheckCircle className="w-3 h-3" /> Sent</>
                      ) : (
                        <><Send className="w-3 h-3" /> Send Cert</>
                      )}
                    </button>
                  )}
                </td>
                <td className="p-4">
                  {donor.status === "Donated" && (
                    <button className={`flex items-center gap-1 text-xs font-medium hover:underline ${
                      donor.reportUploaded ? 'text-emerald-500' : 'text-blue-500'
                    }`}>
                      <FileText className="w-3 h-3" />
                      {donor.reportUploaded ? 'View Report' : 'Upload PDF'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorManagement;