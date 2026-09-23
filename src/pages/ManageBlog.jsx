import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';
import { useAdminData } from '../context/AdminDataContext';
import { showToast, showConfirmDialog } from '../utils/alerts';
import { 
  FiEdit3, 
  FiPlus, 
  FiTrash2, 
  FiEye, 
  FiCheckCircle, 
  FiX, 
  FiFolder, 
  FiUser, 
  FiClock, 
  FiSearch,
  FiExternalLink,
  FiLoader,
  FiImage,
  FiUpload,
  FiLink,
  FiShare2
} from 'react-icons/fi';

import { uploadImageAPI } from '../services/api';

export default function ManageBlog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { blogs, saveBlog, deleteBlog, categories } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: categories[0]?.name || 'AI & Predictive FM',
    categoryId: categories[0]?.id || '',
    author: 'Pranjal Gupta',
    readTime: '4 min read',
    excerpt: '',
    content: '',
    published: true
  });

  // Handle ?edit=blogId query parameter if coming from View page
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && blogs.length > 0) {
      const found = blogs.find(b => b.id === editId || b.slug === editId);
      if (found) {
        handleOpenEditor(found);
      }
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, blogs]);

  const handleOpenEditor = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        image: blog.image || '',
        category: blog.category,
        categoryId: blog.categoryId || '',
        author: blog.author,
        readTime: blog.readTime || '4 min read',
        excerpt: blog.excerpt,
        content: blog.content,
        published: blog.published !== false
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        image: '',
        category: categories[0]?.name || 'AI & Predictive FM',
        categoryId: categories[0]?.id || '',
        author: 'Pranjal Gupta',
        readTime: '4 min read',
        excerpt: '',
        content: '',
        published: true
      });
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingBlog(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await uploadImageAPI(file);
      if (res && res.url) {
        setFormData(prev => ({ ...prev, image: res.url }));
        showToast('Image uploaded to backend server uploads successfully!', 'success');
      } else {
        throw new Error('Upload response missing image url');
      }
    } catch (err) {
      console.warn('Backend upload failed, falling back:', err.message);
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
      showToast('Please enter a blog title.', 'warning');
      return;
    }
    if (!formData.content.trim()) {
      showToast('Please write blog content.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveBlog({
        ...(editingBlog ? { id: editingBlog.id } : {}),
        ...formData
      });
      showToast(editingBlog ? 'Article updated successfully!' : 'Article published successfully!', 'success');
      handleCloseEditor();
    } catch (err) {
      showToast('Error saving article: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (blog) => {
    const result = await showConfirmDialog({
      title: 'Delete Article?',
      text: `Are you sure you want to permanently delete "${blog.title}"?`,
      confirmButtonText: 'Yes, Delete Article',
      icon: 'warning'
    });

    if (result.isConfirmed) {
      deleteBlog(blog.id);
      showToast('Article deleted successfully', 'success');
    }
  };

  const handleShareArticle = (blog) => {
    const articleUrl = `http://localhost:5173/blogs/${blog.id}`;
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: articleUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(articleUrl);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FiEdit3 className="text-[#c1121f]" />
              Manage Blog & Technical Articles
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add feature images, preview full articles on new page, edit content, share links, and delete posts.
            </p>
          </div>

          <button
            onClick={() => handleOpenEditor()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c1121f] text-white text-xs font-black shadow-md hover:bg-red-700 transition-all cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Create New Article</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by article title, category, or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c1121f]"
            />
          </div>
          <div className="text-xs font-bold text-slate-500">
            Total Articles: <span className="text-slate-900">{blogs.length}</span>
          </div>
        </div>

        {/* Blog Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group overflow-hidden"
            >
              {blog.image && (
                <div 
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="relative -mx-6 -mt-6 mb-4 h-44 bg-slate-900 overflow-hidden border-b border-slate-100 cursor-pointer group/img"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 shadow">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <FiEye className="w-4 h-4" />
                    <span>Click to View Full Article</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {!blog.image && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                      {blog.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      blog.published !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {blog.published !== false ? 'Live' : 'Draft'}
                    </span>
                  </div>
                )}

                <h3 
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="text-base font-black text-slate-900 group-hover:text-[#c1121f] transition-colors leading-snug cursor-pointer"
                >
                  {blog.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>{blog.author}</span>
                  <span>•</span>
                  <span>{blog.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors cursor-pointer"
                    title="View Full Article (Open in New Page)"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareArticle(blog)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0b1d3a] transition-colors cursor-pointer"
                    title="Share Article Link"
                  >
                    <FiShare2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditor(blog)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0b1d3a] transition-colors cursor-pointer"
                    title="Edit with Rich Text Editor"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Article"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Modal with Rich Text Editor */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c1121f]"></span>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingBlog ? 'Edit Technical Article' : 'Draft New Article with Rich Text'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseEditor}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. How AI Predictive Telemetry Prevents HVAC Chiller Failures..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                {/* Article Feature Image Section */}
                <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Feature Image (URL ya File Upload)
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Remove Image
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                        <FiLink className="text-slate-400" /> Image Web Link (URL)
                      </span>
                      <input
                        type="text"
                        value={formData.image.startsWith('data:') ? '' : formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium bg-white focus:outline-none focus:border-[#c1121f]"
                        placeholder="https://example.com/blog-cover.jpg"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                        <FiUpload className="text-slate-400" /> Ya Device Se Upload Karein
                      </span>
                      <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2 rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-colors">
                        <FiUpload className="w-4 h-4 text-[#c1121f]" />
                        <span>Choose Image File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {formData.image && (
                    <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-36 max-w-sm">
                      <img
                        src={formData.image}
                        alt="Blog Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                        Live Preview
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const selectedCat = categories.find(c => c.name === e.target.value);
                        setFormData({ 
                          ...formData, 
                          category: e.target.value,
                          categoryId: selectedCat?.id || ''
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c1121f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Short Summary / Excerpt (Shows on preview cards)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 line takeaway..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                {/* Rich Text Editor Component */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Full Article Body (Rich Text & Live Preview) *</span>
                    <span className="text-[10px] text-slate-400 font-normal">Use toolbar above editor for H2, H3, bold, lists, quotes</span>
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(newContent) => setFormData({ ...formData, content: newContent })}
                    placeholder="<h2>Executive Summary</h2><p>Write your detailed technical content here...</p>"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="blogPublished"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-slate-300 text-[#c1121f] focus:ring-[#c1121f]"
                  />
                  <label htmlFor="blogPublished" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Publish Live (Visible on public SFM Knowledge Hub)
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseEditor}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0b1d3a] text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting && <FiLoader className="w-4 h-4 animate-spin text-[#c1121f]" />}
                    <span>{isSubmitting ? 'Saving Article...' : editingBlog ? 'Update Article' : 'Publish Article'}</span>
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


