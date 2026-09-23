import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAdminData } from '../context/AdminDataContext';
import { showToast, showConfirmDialog } from '../utils/alerts';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiCheck, 
  FiX, 
  FiImage, 
  FiExternalLink, 
  FiLayers, 
  FiEye, 
  FiArrowRight, 
  FiSliders,
  FiZap,
  FiLoader,
  FiUpload,
  FiLink
} from 'react-icons/fi';

import { uploadImageAPI } from '../services/api';

export default function ManageBanner() {
  const { banners, saveBanner, deleteBanner } = useAdminData();
  const [editingBanner, setEditingBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    badge: 'Enterprise SLA',
    image: '',
    active: true,
    ctaText: 'Request Facility Health Audit',
    ctaLink: '/contact',
    secondaryCtaText: 'Explore Vigyani.ai Hub',
    secondaryCtaLink: '/vigyani-ai'
  });

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        tagline: banner.tagline || '',
        badge: banner.badge || 'Enterprise SLA',
        image: banner.image || '',
        active: banner.active !== false,
        ctaText: banner.ctaText || 'Request Facility Health Audit',
        ctaLink: banner.ctaLink || '/contact',
        secondaryCtaText: banner.secondaryCtaText || 'Explore Vigyani.ai Hub',
        secondaryCtaLink: banner.secondaryCtaLink || '/vigyani-ai'
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        tagline: 'Spartans Facility Management • June 2026 Profile',
        badge: 'B2B Hard Services',
        image: '',
        active: true,
        ctaText: 'Request Facility Health Audit',
        ctaLink: '/contact',
        secondaryCtaText: 'Explore Vigyani.ai Hub',
        secondaryCtaLink: '/vigyani-ai'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
      return;
    }

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB', 'warning');
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await uploadImageAPI(file);
      if (res && res.url) {
        setFormData(prev => ({ ...prev, image: res.url }));
        showToast('Banner image uploaded to backend server uploads successfully!', 'success');
      } else {
        throw new Error('Upload response missing image url');
      }
    } catch (err) {
      console.warn('Backend banner upload failed, using local preview:', err.message);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result }));
        showToast('Image attached locally', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a banner headline.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveBanner({
        ...(editingBanner ? { id: editingBanner.id } : {}),
        ...formData
      });
      showToast(editingBanner ? 'Banner updated successfully!' : 'New banner published live!', 'success');
      handleCloseModal();
    } catch (err) {
      showToast('Error saving banner: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (banner) => {
    const result = await showConfirmDialog({
      title: 'Delete Hero Slide?',
      text: `Are you sure you want to permanently delete "${banner.title}"?`,
      confirmButtonText: 'Yes, Delete Slide',
      icon: 'warning'
    });

    if (result.isConfirmed) {
      deleteBanner(banner.id);
      showToast('Banner slide deleted successfully', 'success');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FiImage className="text-[#c1121f]" />
              Manage Dynamic Banners & Sliders
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add banner images, headlines, sub-headings, badges, and CTA redirect targets dynamically rendered on the public website.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c1121f] text-white text-xs font-black shadow-md hover:bg-red-700 transition-all cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Create New Hero Banner</span>
          </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((ban, idx) => (
            <div
              key={ban.id}
              className={`bg-white rounded-2xl border ${ban.active ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-75'} shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#0b1d3a] transition-all`}
            >
              {/* Banner Image Preview Header */}
              {ban.image && (
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-slate-100">
                  <img
                    src={ban.image}
                    alt={ban.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>
                  
                  {/* Badge & Status Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur text-slate-900 shadow">
                      {ban.badge || 'Slide #' + (idx + 1)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ban.active ? 'bg-emerald-500 text-white shadow' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {ban.active ? '● Active Slide' : 'Draft / Inactive'}
                    </span>
                  </div>

                  {/* Headline Preview on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                      {ban.tagline}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  {!ban.image && (
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#c1121f]">
                        Slide #{idx + 1} • {ban.tagline}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ban.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {ban.active ? 'Active Slide' : 'Draft / Inactive'}
                      </span>
                    </div>
                  )}

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {ban.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5 line-clamp-2">
                    {ban.subtitle}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-500">Primary CTA:</span>
                    <span className="px-2 py-0.5 rounded bg-red-50 text-[#c1121f] font-bold flex items-center gap-1">
                      {ban.ctaText} → {ban.ctaLink}
                    </span>
                  </div>
                  {ban.secondaryCtaText && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-500">Secondary CTA:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                        {ban.secondaryCtaText} → {ban.secondaryCtaLink}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => saveBanner({ ...ban, active: !ban.active })}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      ban.active 
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {ban.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(ban)}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#0b1d3a] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Banner"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ban)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Banner"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 my-8 max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-[#c1121f] flex items-center justify-center font-bold">
                    <FiSliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {editingBanner ? 'Edit Hero Banner Slide' : 'Create New Hero Banner Slide'}
                    </h3>
                    <p className="text-[11px] text-slate-500">Configure text, hero photo, badges, and CTAs</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                
                {/* Image Input: Link / Upload */}
                <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Banner Image (URL ya File Upload)
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Image Hatao (Remove)
                      </button>
                    )}
                  </div>

                  {/* Input Options: Direct URL & File Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                        <FiLink className="text-slate-400" /> Image Web Link (URL)
                      </span>
                      <input
                        type="text"
                        value={formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium bg-white focus:outline-none focus:border-[#c1121f]"
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                        <FiUpload className="text-slate-400" /> Ya Device Se Upload Karein
                      </span>
                      <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-colors">
                        <FiUpload className="w-4 h-4 text-[#c1121f]" />
                        <span>Choose Banner File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Image Live Preview */}
                  {formData.image ? (
                    <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-36 max-w-full">
                      <img
                        src={formData.image}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                        Live Preview
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-800 text-[11px] flex items-center gap-2">
                      <FiImage className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>Koi default image nahi hai. Aap upar link paste kar sakte hain ya nayi image upload kar sakte hain. Agar khali chhodenge to website pe koi placeholder image nahi aayegi.</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                      placeholder="e.g. Enterprise SLA / AI Telemetry"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tagline / Presentation Sub-label
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                      placeholder="e.g. Spartans Facility Management • June 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Main Slide Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#c1121f]"
                    placeholder="e.g. Strategic Repairs & Maintenance Partner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sub-heading / Value Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                    placeholder="e.g. Pan-India B2B Hard Services & Engineering Excellence..."
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Call To Action Button Configuration
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Primary CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                        placeholder="Request Health Audit"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Primary CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                        placeholder="/contact"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Secondary CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryCtaText}
                        onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                        placeholder="Explore Vigyani.ai Hub"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Secondary CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryCtaLink}
                        onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#c1121f]"
                        placeholder="/vigyani-ai"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="bannerActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-slate-300 text-[#c1121f] focus:ring-[#c1121f]"
                  />
                  <label htmlFor="bannerActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Display actively on public website hero slider
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0b1d3a] text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-md flex items-center gap-2"
                  >
                    {isSubmitting && <FiLoader className="w-4 h-4 animate-spin text-[#c1121f]" />}
                    <span>{isSubmitting ? 'Saving...' : editingBanner ? 'Update Banner' : 'Publish Banner to Website'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

