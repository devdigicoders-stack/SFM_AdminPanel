import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import DashboardCharts from '../components/DashboardCharts';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  FiInbox, 
  FiEdit3, 
  FiClock, 
  FiCheckCircle, 
  FiArrowRight, 
  FiAlertCircle, 
  FiTrendingUp, 
  FiPlus, 
  FiUsers, 
  FiShield 
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

export default function AdminDashboard() {
  const { enquiries, blogs, categories, homepageContent } = useAdminData();
  const { adminUser } = useAdminAuth();

  const pendingEnquiries = enquiries.filter(e => e.status === 'Pending');
  const scheduledAudits = enquiries.filter(e => e.status === 'Scheduled');
  const reviewedEnquiries = enquiries.filter(e => e.status === 'Reviewed');
  const completedEnquiries = enquiries.filter(e => e.status === 'Completed');

  const uptimeVal = homepageContent?.uptimeGuarantee || '99.8%';
  const uptimeBadge = homepageContent?.uptimeCompliance || 'ISO / NBC 2016';

  const stats = [
    {
      title: 'Total Audit Enquiries',
      value: enquiries.length,
      sub: `${pendingEnquiries.length} pending reviews`,
      icon: <FiInbox />,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: '+18% this month'
    },
    {
      title: 'Scheduled Site Audits',
      value: scheduledAudits.length,
      sub: 'Active technical teams deployed',
      icon: <FiClock />,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'High Priority'
    },
    {
      title: 'Published Blog Insights',
      value: blogs.length,
      sub: `${categories.length} content categories`,
      icon: <FiEdit3 />,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Knowledge Hub'
    },
    {
      title: 'Facility Uptime Guarantee',
      value: uptimeVal,
      sub: 'Zero statutory non-compliance',
      icon: <FiShield />,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: uptimeBadge
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Top Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#c1121f] border border-red-200">
                Spartans Executive Command
              </span>
              <span className="text-xs text-slate-400 font-semibold">• June 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Welcome back, {adminUser?.name || 'Pranjal Gupta'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Centralized oversight of commercial facility audits, hard engineering SLA tickets, blog content publication, and homepage assets.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              to="/blogs"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b1d3a] text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-all"
            >
              <FiPlus className="text-base text-[#c1121f]" />
              <span>Write Blog Article</span>
            </Link>
            <Link
              to="/enquiries"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-[#c1121f] border border-red-200 text-xs font-bold hover:bg-red-100 transition-all"
            >
              <span>Inspect Enquiries ({pendingEnquiries.length})</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((st, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border ${st.color}`}>
                  {st.icon}
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {st.badge}
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 font-heading tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  {st.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {st.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Charts & Graphs */}
        <DashboardCharts enquiries={enquiries} homepageContent={homepageContent} />

        {/* Recent Facility Inquiries Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Recent Facility Audit & SLA Inquiries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time submissions from commercial properties and prospective clients
              </p>
            </div>
            <Link
              to="/enquiries"
              className="text-xs font-bold text-[#c1121f] hover:underline flex items-center gap-1"
            >
              <span>View All ({enquiries.length})</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <th className="py-3 px-3">Lead ID & Company</th>
                  <th className="py-3 px-3">Facility Type</th>
                  <th className="py-3 px-3">Key Contact</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.slice(0, 4).map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{enq.companyName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{enq.id}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-700">{enq.facilityType}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{enq.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{enq.phone}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 font-medium whitespace-nowrap">
                      {enq.date}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        enq.status === 'Pending' ? 'bg-red-50 text-[#c1121f] border border-red-200' :
                        enq.status === 'Reviewed' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        enq.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/enquiries"
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0b1d3a] hover:text-white text-slate-700 font-bold text-[11px] transition-all inline-block"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
