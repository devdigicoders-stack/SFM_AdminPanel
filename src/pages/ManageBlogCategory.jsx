import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAdminData } from '../context/AdminDataContext';
import { showToast, showConfirmDialog } from '../utils/alerts';
import { FiFolder, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function ManageBlogCategory() {
  const { categories, saveCategory, deleteCategory, blogs } = useAdminData();
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Please enter category name', 'warning');
      return;
    }

    setIsAdding(true);
    try {
      const slug = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      await saveCategory({
        name: newCatName.trim(),
        slug: slug
      });
      showToast(`Category "${newCatName}" created!`, 'success');
      setNewCatName('');
    } catch (err) {
      showToast('Error creating category', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (cat) => {
    if (!editName.trim()) {
      showToast('Category name cannot be empty', 'warning');
      return;
    }
    const slug = editName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    await saveCategory({
      id: cat.id,
      oldName: cat.name,
      name: editName.trim(),
      slug: slug
    });
    showToast('Category updated!', 'success');
    setEditingId(null);
  };

  const handleDelete = async (cat) => {
    const result = await showConfirmDialog({
      title: 'Delete Category?',
      text: `Are you sure you want to delete category "${cat.name}"?`,
      confirmButtonText: 'Yes, Delete',
      icon: 'warning'
    });

    if (result.isConfirmed) {
      deleteCategory(cat.id);
      showToast(`Category "${cat.name}" deleted!`, 'success');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FiFolder className="text-[#c1121f]" />
            Manage Blog Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize knowledge base articles into engineering disciplines, AI telemetry, and compliance pillars.
          </p>
        </div>

        {/* Add Category Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
            Create New Category
          </h2>

          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Energy Audits, Fire Safety, MEP Overhauls..."
              className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#c1121f]"
            />
            <button
              type="submit"
              disabled={isAdding}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0b1d3a] text-white text-xs font-black hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAdding ? <FiLoader className="w-4 h-4 animate-spin text-[#c1121f]" /> : <FiPlus />}
              <span>{isAdding ? 'Adding...' : 'Add Category'}</span>
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Active Category Pillars ({categories.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const articleCount = blogs.filter(b => b.category === cat.name || b.categoryId === cat.id).length;
              const isEditing = editingId === cat.id;

              return (
                <div key={cat.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-[#c1121f] text-xs font-bold text-slate-900 focus:outline-none flex-1 max-w-sm"
                      />
                      <button
                        onClick={() => handleSaveEdit(cat)}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Save"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Cancel"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span>{cat.name}</span>
                        <span className="text-[10px] font-mono font-medium text-slate-400">({cat.slug})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {articleCount} published {articleCount === 1 ? 'article' : 'articles'} in this topic
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 rounded-lg text-slate-500 hover:text-[#0b1d3a] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Rename Category"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

