import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAdminData } from '../context/AdminDataContext';
import { showToast } from '../utils/alerts';
import { FiShare2, FiSave, FiPhone, FiMail, FiMapPin, FiGlobe, FiLinkedin, FiFacebook, FiInstagram, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ManageSocialLinks() {
  const { socials, updateSocials } = useAdminData();
  const [formData, setFormData] = useState({ ...socials });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSocials(formData);
      showToast('Corporate contact channels & social links updated!', 'success');
    } catch (err) {
      showToast('Error updating social links: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FiShare2 className="text-[#c1121f]" />
            Social Media & Official Contact Links
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update official Spartans Facility Management contact details, WhatsApp direct line, and social profiles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Corporate Contact Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <FiPhone className="text-[#c1121f]" />
              Official Corporate Contact Channels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Contact Phone
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
                  Floating WhatsApp Direct Number
                </label>
                <div className="relative">
                  <FaWhatsapp className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Inbound Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headquarters / Command Hub Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-3 text-slate-400" />
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#c1121f]"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <FiGlobe className="text-[#0b1d3a]" />
              Social Media Handles & Web Presence
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  LinkedIn Company Page
                </label>
                <div className="relative">
                  <FiLinkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facebook Page
                </label>
                <div className="relative">
                  <FiFacebook className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-800" />
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instagram Profile
                </label>
                <div className="relative">
                  <FiInstagram className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-600" />
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tech Partner / Developer Attribution Link
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c1121f]" />
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1d3a] text-white text-xs font-black shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              {isSaving ? (
                <FiLoader className="text-base animate-spin text-[#c1121f]" />
              ) : (
                <FiSave className="text-base" />
              )}
              <span>{isSaving ? 'Saving Channels...' : 'Save Channels & Links'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
