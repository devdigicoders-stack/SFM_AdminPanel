import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';
import { showToast } from '../utils/alerts';
import { FiKey, FiLock, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

export default function ChangePassword() {
  const { changePassword } = useAdminAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        showToast(res.message || 'Master password changed successfully!', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast('Error updating password: ' + err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FiKey className="text-[#c1121f]" />
            Change Admin Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ensure your portal credentials remain secure with regular password updates.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <FiAlertCircle className="text-red-500 text-base flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600 text-base flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  placeholder="Enter current master password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password *
              </label>
              <div className="relative">
                <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Default password was <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">admin123</code>
              </span>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl bg-[#c1121f] text-white text-xs font-black shadow-md hover:bg-red-700 transition-all cursor-pointer flex items-center gap-2"
              >
                {isUpdating && <FiLoader className="w-4 h-4 animate-spin text-white" />}
                <span>{isUpdating ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
