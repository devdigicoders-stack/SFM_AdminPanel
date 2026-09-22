import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FiMenu, FiBell, FiShield, FiUser } from 'react-icons/fi';

export default function AdminHeader({ onMenuToggle }) {
  const { adminUser } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Mobile Menu Trigger & Portal Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-50 text-[#c1121f] border border-red-200">
            <FiShield className="w-3.5 h-3.5" /> Super-Admin Active
          </span>
          <span className="text-xs font-semibold text-slate-400 hidden md:inline">
            • Facility Uptime Management
          </span>
        </div>
      </div>

      {/* Right Side: Quick Profile & Status */}
      <div className="flex items-center gap-3">
        {/* System Health Pulse */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Core Node: Online</span>
        </div>

        {/* Profile Card Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-[#0b1d3a] hover:bg-slate-50 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0b1d3a] text-white flex items-center justify-center font-black text-xs shadow-sm">
            {adminUser?.avatar || 'PG'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black text-slate-900 leading-none">
              {adminUser?.name || 'Pranjal Gupta'}
            </div>
            <div className="text-[10px] font-bold text-[#c1121f] mt-0.5">
              Super Admin
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
