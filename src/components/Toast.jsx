import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const types = {
    success: {
      bg: 'bg-emerald-900/90 text-white border-emerald-500/50 shadow-emerald-900/30',
      iconBg: 'bg-emerald-500 text-slate-950',
      progressBar: 'bg-emerald-400',
      icon: <FiCheckCircle className="w-5 h-5 text-white" />
    },
    error: {
      bg: 'bg-red-950/95 text-white border-red-600/60 shadow-red-950/40',
      iconBg: 'bg-[#c1121f] text-white',
      progressBar: 'bg-red-500',
      icon: <FiAlertTriangle className="w-5 h-5 text-white" />
    },
    info: {
      bg: 'bg-slate-900/95 text-white border-slate-700 shadow-slate-950/40',
      iconBg: 'bg-sky-500 text-white',
      progressBar: 'bg-sky-400',
      icon: <FiInfo className="w-5 h-5 text-white" />
    }
  };

  const current = types[toast.type] || types.info;

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-md ${current.bg} flex items-start gap-3.5`}>
        
        {/* Icon */}
        <div className={`p-2 rounded-xl flex-shrink-0 flex items-center justify-center ${current.iconBg} shadow-sm`}>
          {current.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-100">
            {toast.title || (toast.type === 'success' ? 'Success' : 'Authentication Error')}
          </h4>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Bottom Progress Bar */}
        <div
          className={`absolute bottom-0 left-0 h-1 ${current.progressBar} w-full animate-[progress_4s_linear]`}
          style={{
            animationDuration: `${(toast.duration || 4000) / 1000}s`
          }}
        ></div>
      </div>
    </div>
  );
}
