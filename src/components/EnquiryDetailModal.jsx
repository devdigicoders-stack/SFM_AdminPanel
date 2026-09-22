import React from 'react';
import { 
  FiX, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiCalendar, 
  FiCheckCircle, 
  FiLayers,
  FiFileText
} from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

export default function EnquiryDetailModal({ enquiry, onClose, onStatusChange }) {
  if (!enquiry) return null;

  const statuses = ['Pending', 'Reviewed', 'Scheduled', 'Completed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-black bg-[#0b1d3a] text-white">
              {enquiry.id}
            </span>
            <h3 className="text-base font-black text-slate-900">
              Facility Health Audit Lead Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Status Quick Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
            <div className="text-xs">
              <span className="text-slate-500 font-semibold">Current Pipeline Status:</span>
              <span className="ml-2 font-black text-slate-900">{enquiry.status}</span>
            </div>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => onStatusChange(enquiry.id, st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    enquiry.status === st
                      ? 'bg-[#c1121f] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FaBuilding className="text-[#0b1d3a]" /> Company / Property
              </div>
              <div className="text-sm font-black text-slate-900">
                {enquiry.companyName}
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                {enquiry.facilityType} • {enquiry.city}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FiUser className="text-[#c1121f]" /> Key Contact Person
              </div>
              <div className="text-sm font-black text-slate-900">
                {enquiry.contactPerson}
              </div>
              <div className="text-xs text-slate-500 font-semibold flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1"><FiPhone /> {enquiry.phone}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FiMail /> Official Email Address
              </div>
              <div className="text-xs font-bold text-slate-800 break-all">
                {enquiry.email}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FiLayers /> Estimated Area / Scale
              </div>
              <div className="text-xs font-bold text-slate-800">
                {enquiry.sqFootage || '100,000+ sq ft'}
              </div>
            </div>

          </div>

          {/* Requested Services */}
          <div>
            <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
              Requested Technical & FM Services Scope
            </div>
            <div className="flex flex-wrap gap-2">
              {enquiry.servicesNeeded?.map((svc, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <FiCheckCircle className="text-emerald-600 w-3.5 h-3.5" />
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Special Requirements / Notes */}
          {enquiry.notes && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <FiFileText className="text-amber-700" />
                Special Requirements & Client Notes
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {enquiry.notes}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <FiCalendar /> Submitted: {enquiry.date}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
