import React from 'react';
import { NavLink } from 'react-router-dom';
import SfmLogo from './SfmLogo';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  FiGrid, 
  FiInbox, 
  FiEdit3, 
  FiFolder, 
  FiImage, 
  FiHome, 
  FiTool, 
  FiShare2, 
  FiUser, 
  FiKey, 
  FiLogOut,
  FiExternalLink,
  FiX
} from 'react-icons/fi';

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { enquiries, blogs } = useAdminData();
  const { logout } = useAdminAuth();

  const pendingCount = enquiries.filter(e => e.status === 'Pending').length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    { name: 'Manage Enquiry', path: '/enquiries', icon: <FiInbox />, badge: pendingCount > 0 ? pendingCount : null },
    { name: 'Manage Blog', path: '/blogs', icon: <FiEdit3 />, badge: blogs.length },
    { name: 'Manage Blog Category', path: '/categories', icon: <FiFolder /> },
    { name: 'Manage Banner / Slider', path: '/banners', icon: <FiImage /> },
    { name: 'Homepage Content', path: '/homepage-content', icon: <FiHome /> },
    { name: 'Service Content', path: '/services', icon: <FiTool /> },
    { name: 'Social Media & Links', path: '/social-links', icon: <FiShare2 /> },
    { name: 'My Profile', path: '/profile', icon: <FiUser /> },
    { name: 'Change Password', path: '/change-password', icon: <FiKey /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 shadow-sm lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header */}
        <div>
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <SfmLogo size="sm" showTagline={false} lightMode={true} />
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            SFM Executive Portal
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0b1d3a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0b1d3a] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#c1121f] text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-[#c1121f] transition-colors shadow-sm"
          >
            <span>View Public Website</span>
            <FiExternalLink />
          </a>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-[#c1121f] hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
          >
            <FiLogOut />
            <span>Logout Session</span>
          </button>
        </div>

      </aside>
    </>
  );
}
