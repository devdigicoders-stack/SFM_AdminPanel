import React, { useState } from 'react';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiList, 
  FiLink, 
  FiCode, 
  FiType, 
  FiEye, 
  FiEdit 
} from 'react-icons/fi';

/**
 * Robust WYSIWYG Rich Text Editor for Spartans FM Blog & Knowledge Hub
 * Supports Headings, Lists, Bold, Italic, Underline, Quotes, Links, and Live Preview
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Write comprehensive technical blog content...' }) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const applyFormat = (tagOpen, tagClose = '') => {
    const textarea = document.getElementById('sfm-rich-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'Sample text';
    const replacement = `${tagOpen}${selectedText}${tagClose}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 50);
  };

  const handleHeading2 = () => applyFormat('<h2>', '</h2>\n');
  const handleHeading3 = () => applyFormat('<h3>', '</h3>\n');
  const handleBold = () => applyFormat('<strong>', '</strong>');
  const handleItalic = () => applyFormat('<em>', '</em>');
  const handleUnderline = () => applyFormat('<u>', '</u>');
  const handleBulletList = () => applyFormat('<ul>\n  <li>', '</li>\n  <li>Additional point</li>\n</ul>\n');
  const handleBlockquote = () => applyFormat('<blockquote>', '</blockquote>\n');
  const handleCodeBlock = () => applyFormat('<code>', '</code>');
  const handleLink = () => {
    const url = prompt('Enter Destination URL:', 'https://spartansfacility.com');
    if (url) {
      applyFormat(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-[#0b1d3a] transition-all">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={handleHeading2}
            className="p-2 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Heading 2 (H2)"
          >
            H2
          </button>
          <button
            type="button"
            onClick={handleHeading3}
            className="p-2 rounded-lg text-xs font-black text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Heading 3 (H3)"
          >
            H3
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1"></span>

          <button
            type="button"
            onClick={handleBold}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Bold"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleItalic}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Italic"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleUnderline}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Underline"
          >
            <FiUnderline className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1"></span>

          <button
            type="button"
            onClick={handleBulletList}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Bullet List"
          >
            <FiList className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleBlockquote}
            className="p-2 rounded-lg text-xs font-serif font-black text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Quote Callout"
          >
            “ ”
          </button>
          <button
            type="button"
            onClick={handleCodeBlock}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Code Inline"
          >
            <FiCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLink}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200 hover:text-[#0b1d3a] transition-colors"
            title="Insert Link"
          >
            <FiLink className="w-4 h-4" />
          </button>
        </div>

        {/* Write / Live Preview Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'write' ? 'bg-white text-[#0b1d3a] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiEdit className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-[#0b1d3a] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>Live View</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'write' ? (
        <textarea
          id="sfm-rich-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={12}
          className="w-full p-4 text-xs sm:text-sm text-slate-800 focus:outline-none font-mono leading-relaxed bg-white resize-y"
        ></textarea>
      ) : (
        <div className="p-6 min-h-[280px] bg-slate-50/50 overflow-y-auto">
          {value ? (
            <div
              className="prose prose-sm max-w-none text-slate-800 font-sans leading-relaxed space-y-3 [&>h2]:text-lg [&>h2]:font-black [&>h2]:text-slate-900 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-slate-800 [&>ul]:list-disc [&>ul]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-[#c1121f] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-700"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              Nothing to preview yet. Switch to Editor mode and begin writing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
