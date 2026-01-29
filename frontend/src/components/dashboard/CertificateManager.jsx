import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, FileText, Award, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const CertificateManager = ({ isDarkMode }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Theme Helpers
  const theme = {
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-900',
    tableHeader: isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-gray-50 text-gray-500',
    row: isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50',
  };

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const storedOrg = JSON.parse(localStorage.getItem("orgUser"));
        const token = localStorage.getItem("orgToken");

        // 1. Fetch All Camps
        const res = await axios.get("http://localhost:5000/api/camps");
        
        // 2. Filter My Camps
        const myCamps = res.data.filter(c => {
            const campOrgId = c.organizationId?._id || c.organizationId;
            return String(campOrgId) === String(storedOrg._id || storedOrg.id);
        });

        // 3. Flatten all donors from all camps who have 'Donated' status
        // Note: This relies on your backend populating registeredDonors correctly
        // Since getCamps might not return deep population of 'donationId', 
        // a better approach in production is a dedicated /api/org/donations endpoint.
        // For now, we will do multiple requests to get details (Simpler for current setup)
        
        const allDonatedDonors = [];

        // We need to fetch details for each camp to check donation status
        // (Optimized: In real app, make one backend call for this report)
        await Promise.all(myCamps.map(async (camp) => {
            try {
                const campDetail = await axios.get(`http://localhost:5000/api/camps/${camp._id}`);
                
                // Filter only those who Donated
                const donated = (campDetail.data.registeredDonors || []).filter(d => d.status === 'Donated');
                
                donated.forEach(d => {
                    allDonatedDonors.push({
                        ...d,
                        campName: camp.campName,
                        campDate: camp.date,
                        campId: camp._id
                    });
                });
            } catch (err) {
                console.error(err);
            }
        }));

        setDonors(allDonatedDonors);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load certificate records");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  const filteredDonors = donors.filter(d => 
    d.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold mb-1">Certificate Repository</h2>
           <p className={theme.subtext}>View and reprint certificates for all past donations.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2.5 rounded-xl border outline-none w-full sm:w-64 ${theme.input}`}
          />
        </div>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${theme.card}`}>
        {loading ? (
            <div className="p-12 text-center opacity-50">Loading records...</div>
        ) : filteredDonors.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
                <Award className="w-12 h-12 text-gray-300 mb-3" />
                <p className="font-bold text-lg text-gray-400">No certificates issued yet.</p>
                <p className="text-sm text-gray-400">Donors must be checked-in first.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className={`text-xs uppercase tracking-wider ${theme.tableHeader}`}>
                    <th className="p-5">Donor</th>
                    <th className="p-5">Camp Details</th>
                    <th className="p-5">Donation Date</th>
                    <th className="p-5 text-right">Certificate</th>
                </tr>
                </thead>
                <tbody className={`text-sm ${theme.text}`}>
                {filteredDonors.map((donor, idx) => (
                    <tr key={`${donor._id}-${idx}`} className={`border-b transition-colors ${theme.row}`}>
                    <td className="p-5">
                        <div className="font-bold">{donor.fullName}</div>
                        <div className={`text-xs ${theme.subtext}`}>{donor.phone}</div>
                    </td>
                    <td className="p-5">
                        <div className="font-medium">{donor.campName}</div>
                    </td>
                    <td className="p-5">
                        <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3 opacity-50" />
                            {new Date(donor.campDate).toLocaleDateString()}
                        </div>
                    </td>
                    <td className="p-5 text-right">
                        <a 
                            href={`http://localhost:5000/api/camps/${donor.campId}/certificate/${donor._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-all text-xs border border-indigo-100"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download PDF</span>
                        </a>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManager;