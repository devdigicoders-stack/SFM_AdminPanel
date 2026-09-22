import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';
import { showToast } from '../utils/alerts';
import { FiUser, FiSave, FiMail, FiPhone, FiShield, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function AdminProfile() {
  const { adminUser, updateProfile } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: adminUser?.name || 'Pranjal Gupta',
    email: adminUser?.email || 'admin@spartansfacility.com',
    role: adminUser?.role || 'Super Administrator',
    phone: adminUser?.phone || '+91-8299726346',
    avatar: adminUser?.avatar || 'PG'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      showToast(res.message || 'Profile changes saved successfully!', 'success');
    } catch (err) {
      showToast('Error updating profile: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FiUser className="text-[#c1121f]" />
            Administrator Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your executive account credentials and notification endpoints.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600 text-base" />
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Avatar & Role Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-[#0b1d3a] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-[#c1121f]">
              {formData.avatar || 'AD'}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">{formData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#c1121f] border border-red-200">
                  {formData.role}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Spartans Facility Management
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initials / Avatar Badge
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Admin Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security Privilege
                </label>
                <div className="relative">
                  <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    disabled
                    value="Full Super-Admin Control"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b1d3a] text-white text-xs font-black shadow-md hover:bg-slate-800 transition-all cursor-pointer"
              >
                {isSaving ? (
                  <FiLoader className="text-base animate-spin text-[#c1121f]" />
                ) : (
                  <FiSave className="text-base" />
                )}
                <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
