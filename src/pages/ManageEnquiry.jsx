import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import EnquiryDetailModal from '../components/EnquiryDetailModal';
import { useAdminData } from '../context/AdminDataContext';
import { showToast, showConfirmDialog } from '../utils/alerts';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiTrash2, 
  FiPhone, 
  FiMail, 
  FiCheckCircle, 
  FiClock, 
  FiPlus 
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

export default function ManageEnquiry() {
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Filtered dataset
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch = 
      enq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || enq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Company Name', 'Contact Person', 'Phone', 'Email', 'City', 'Facility Type', 'Status', 'Date'];
    const rows = filteredEnquiries.map(e => [
      e.id,
      `"${e.companyName}"`,
      `"${e.contactPerson}"`,
      e.phone,
      e.email,
      e.city,
      `"${e.facilityType}"`,
      e.status,
      e.date
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SFM_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FaBuilding className="text-[#c1121f]" />
              Manage Facility Enquiries & Audits
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Inspect incoming facility health audit requests, update SLA status, and export client lists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
            >
              <FiDownload className="text-slate-500 text-sm" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, contact person, email, city or lead ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c1121f] transition-colors"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Pending', 'Reviewed', 'Scheduled', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#0b1d3a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Enquiry Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto mb-3">
                <FiSearch />
              </div>
              <h3 className="text-sm font-black text-slate-800">No enquiries match your search criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or keyword search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Lead ID</th>
                    <th className="py-3.5 px-4">Property / Client</th>
                    <th className="py-3.5 px-4">Key Executive</th>
                    <th className="py-3.5 px-4">City / Area</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Pipeline Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                        {enq.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{enq.companyName}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{enq.facilityType}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{enq.contactPerson}</div>
                        <div className="text-[11px] text-slate-500">{enq.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {enq.city}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {enq.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          enq.status === 'Pending' ? 'bg-red-50 text-[#c1121f] border border-red-200' :
                          enq.status === 'Reviewed' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          enq.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-[#0b1d3a] hover:text-white transition-all cursor-pointer"
                            title="Inspect full details"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              const res = await showConfirmDialog({
                                title: 'Delete Facility Enquiry?',
                                text: `Permanently remove lead ${enq.id} (${enq.companyName})?`,
                                confirmButtonText: 'Yes, Delete Lead',
                                icon: 'warning'
                              });
                              if (res.isConfirmed) {
                                deleteEnquiry(enq.id);
                                showToast(`Lead ${enq.id} deleted successfully`, 'success');
                              }
                            }}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
                            title="Delete record"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <EnquiryDetailModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onStatusChange={(id, newStatus) => {
            updateEnquiryStatus(id, newStatus);
            setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
          }}
        />

      </div>
    </AdminLayout>
  );
}
