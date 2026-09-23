import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useAdminData } from '../context/AdminDataContext';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiTrash2, 
  FiShare2, 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiExternalLink,
  FiEye
} from 'react-icons/fi';
import { showToast, showConfirmDialog } from '../utils/alerts';

export default function ViewBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, deleteBlog } = useAdminData();

  const article = blogs.find(
    b => b.id === id || b.slug === id || String(b.id) === String(id)
  );

  const handleDelete = async () => {
    if (!article) return;
    const result = await showConfirmDialog({
      title: 'Delete Article?',
      text: `Are you sure you want to permanently delete "${article.title}"?`,
      confirmButtonText: 'Yes, Delete Article',
      icon: 'warning'
    });

    if (result.isConfirmed) {
      deleteBlog(article.id);
      showToast('Article deleted successfully', 'success');
      navigate('/blogs');
    }
  };

  const handleShare = () => {
    if (!article) return;
    const publicUrl = `http://localhost:5173/blogs/${article.id}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: publicUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(publicUrl);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  if (!article) {
    return (
      <AdminLayout>
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto my-12">
          <h2 className="text-xl font-bold text-slate-900">Article Not Found</h2>
          <p className="text-xs text-slate-500">The article you are trying to preview does not exist.</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1d3a] text-white text-xs font-bold shadow hover:bg-slate-800 transition-all"
          >
            <FiArrowLeft />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#c1121f] transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              article.published !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {article.published !== false ? '● Live on Website' : 'Draft / Unpublished'}
            </span>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1.5 cursor-pointer font-bold"
              title="Share Link"
            >
              <FiShare2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <Link
              to={`/blogs?edit=${article.id}`}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#0b1d3a] hover:bg-slate-100 transition-colors text-xs flex items-center gap-1.5 font-bold"
              title="Edit Article"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors text-xs flex items-center gap-1.5 cursor-pointer font-bold"
              title="Delete Article"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Article Full Preview Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Feature Cover Image */}
          {article.image && (
            <div className="relative h-80 sm:h-96 w-full bg-slate-900 overflow-hidden border-b border-slate-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 text-slate-900 shadow">
                  {article.category}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            {!article.image && (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 inline-block border border-slate-200">
                {article.category}
              </span>
            )}

            <h1 className="text-2xl sm:text-4xl font-black text-[#0b1d3a] font-display leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                <FiUser className="text-[#c1121f]" /> By {article.author || 'Pranjal Gupta'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="text-slate-400" /> Published: {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FiClock className="text-slate-400" /> {article.readTime || '4 min read'}
              </span>
            </div>

            {/* Excerpt Callout */}
            {article.excerpt && (
              <div className="p-5 rounded-2xl bg-red-50/70 border-l-4 border-[#c1121f] text-xs sm:text-sm font-medium text-slate-800 italic leading-relaxed">
                "{article.excerpt}"
              </div>
            )}

            {/* Rich HTML Content */}
            <div
              className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 prose max-w-none font-sans
                [&>h2]:text-lg [&>h2]:font-black [&>h2]:text-[#0b1d3a] [&>h2]:mt-6 [&>h2]:mb-2
                [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-4 [&>h3]:mb-1
                [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-[#c1121f] [&>blockquote]:pl-4 [&>blockquote]:italic"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
