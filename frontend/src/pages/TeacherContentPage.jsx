import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Video, FileText, CheckCircle2, Sparkles, Link as LinkIcon, Upload, Trash2, Edit, Eye, Globe, Bot, Loader2, ArrowRight, X } from 'lucide-react';
import api from '../utils/api';

const TeacherContentPage = () => {
  const [contentList, setContentList] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTypeTab, setActiveTypeTab] = useState('all');
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('Class 7A');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('text'); // 'text', 'file', 'link'
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [status, setStatus] = useState('draft'); // 'draft' or 'published'
  
  // AI Helper state
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  const [message, setMessage] = useState('');

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/content');
      setContentList(res.data || []);
    } catch (err) {
      console.error('Fetch content error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    const fetchClasses = async () => {
      try {
        const res = await api.get('/teacher/classes');
        setClasses(res.data);
        if (res.data.length > 0) setClassId(res.data[0]._id);
      } catch (err) {}
    };
    fetchClasses();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubject('Mathematics');
    setClassName('Class 7A');
    setDescription('');
    setType('text');
    setContent('');
    setFileUrl('');
    setExternalUrl('');
    setStatus('draft');
    setShowAiInput(false);
    setAiTopic('');
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setTitle(item.title || '');
      setSubject(item.subject || 'Mathematics');
      setClassName(item.className || 'Class 7A');
      setDescription(item.description || '');
      setType(item.type || 'text');
      setContent(item.content || '');
      setFileUrl(item.fileUrl || '');
      setExternalUrl(item.externalUrl || '');
      setStatus(item.status || 'draft');
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-content', {
        topic: aiTopic,
        subject,
        grade: '7'
      });
      if (res.data?.content) {
        setContent(res.data.content);
        if (!title) setTitle(`${aiTopic} — Lesson Notes`);
        if (!description) setDescription(`Generated lesson material on ${aiTopic}`);
      }
    } catch (err) {
      console.error('AI Generate Content error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (targetStatus = status) => {
    if (!title.trim()) {
      alert('Please provide a content title.');
      return;
    }

    const payload = {
      title,
      subject,
      classId,
      description,
      type,
      content,
      fileUrl,
      externalUrl,
      status: targetStatus
    };

    try {
      if (editingId) {
        await api.patch(`/teacher/content/${editingId}`, payload);
        setMessage('Content item updated successfully! ✅');
      } else {
        await api.post('/teacher/content', payload);
        setMessage(targetStatus === 'published' ? 'Content published to students! 🚀' : 'Content saved as draft! 📝');
      }
      setShowModal(false);
      resetForm();
      fetchContent();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Save content error:', err);
      alert('Error saving content: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      if (currentStatus === 'draft') {
        await api.post(`/teacher/content/${id}/publish`);
        setMessage('Content published to students! 🚀');
      } else {
        await api.patch(`/teacher/content/${id}`, { status: 'draft' });
        setMessage('Content moved to drafts. 📝');
      }
      fetchContent();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content item?')) return;
    try {
      await api.delete(`/teacher/content/${id}`);
      setMessage('Content item deleted. 🗑️');
      fetchContent();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredContent = contentList.filter(item => {
    const matchesType = activeTypeTab === 'all' || item.type === activeTypeTab;
    const matchesStatus = activeStatusTab === 'all' || item.status === activeStatusTab;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-md">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-text flex items-center gap-2">
            📚 Teacher Content Management
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Create, manage, and publish educational notes, documents, videos, and external links for your classes.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Content</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-brand-orange font-bold text-xs shadow-sm">
          {message}
        </div>
      )}

      {/* Filter Tabs (PRD Item 7: Documents, Videos, Images, Links, Notes) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
        
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'text', label: '📝 Notes & Manual' },
            { id: 'link', label: '🔗 Web Links & Videos' },
            { id: 'file', label: '📄 Files & Documents' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTypeTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTypeTab === tab.id
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'bg-brand-orange-light/50 text-brand-text hover:bg-orange-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-brand-muted">Status:</span>
          {['all', 'published', 'draft'].map(st => (
            <button
              key={st}
              onClick={() => setActiveStatusTab(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all border ${
                activeStatusTab === st
                  ? 'bg-brand-text text-white border-brand-text'
                  : 'bg-white text-brand-muted border-orange-100 hover:border-orange-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Content List Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs font-bold text-brand-muted">Loading content items...</div>
      ) : filteredContent.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-orange-100 space-y-3">
          <BookOpen className="w-12 h-12 text-brand-orange mx-auto opacity-50" />
          <h3 className="font-display font-bold text-base text-brand-text">No content items found</h3>
          <p className="text-xs text-brand-muted">Click "+ Create Content" above to create and publish your first lesson note, link, or document.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Array.isArray(filteredContent) ? filteredContent : []).map(item => (
            <div key={item._id} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4 flex flex-col justify-between hover:border-brand-orange transition-all">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {item.type === 'link' ? '🔗' : item.type === 'file' ? '📄' : '📝'}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-brand-orange bg-brand-orange-light px-2.5 py-0.5 rounded-full border border-orange-200">
                        {item.subject} • {item.className}
                      </span>
                      <h3 className="font-display font-bold text-base text-brand-text mt-1">{item.title}</h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize border ${
                    item.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {item.status === 'published' ? 'Published ✓' : 'Draft'}
                  </span>
                </div>

                <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{item.description}</p>

                {item.content && (
                  <div className="p-3 bg-brand-orange-light/30 rounded-xl text-xs text-brand-text line-clamp-3 font-medium border border-orange-100/60 whitespace-pre-wrap">
                    {item.content}
                  </div>
                )}

                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{item.externalUrl}</span>
                  </a>
                )}
              </div>

              {/* Action Buttons (Item 10 & 11: Edit, Delete, Update, Publish) */}
              <div className="pt-3 border-t border-orange-100 flex items-center justify-between">
                <button
                  onClick={() => handlePublishToggle(item._id, item.status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    item.status === 'draft'
                      ? 'bg-brand-orange text-white border-brand-orange hover:bg-orange-600'
                      : 'bg-white text-brand-muted border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  {item.status === 'draft' ? '🚀 Publish to Students' : 'Move to Draft'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 rounded-xl text-gray-500 hover:text-brand-orange hover:bg-brand-orange-light transition-colors"
                    title="Edit Content"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Content"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CONTENT MODAL (PRD Item 8, 9, 10 & 11) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 border border-orange-100 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <h3 className="font-display font-extrabold text-xl text-brand-text flex items-center gap-2">
                {editingId ? '✏️ Edit Content Item' : '📚 Create Educational Content'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 font-bold hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Subject</label>
                  <input
    type="text"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    placeholder="e.g. Mathematics, History, Coding..."
    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-bold focus:outline-none text-brand-text"
  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Class / Target Group</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-bold focus:outline-none text-brand-text"
                  >
                    <option value="">🌐 All Classes (Publish to All Students)</option>
                    {(Array.isArray(classes) ? classes : []).map(cl => (
                      <option key={cl._id} value={cl._id}>{cl.className} (Code: {cl.classCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Content Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fractions Chapter 3 Notes or Water Cycle Diagram"
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-medium focus:outline-none text-brand-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Description / Summary</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for students..."
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-medium focus:outline-none text-brand-text"
                />
              </div>

              {/* Content Type Selector (PRD Item 8: Upload File, Add Link, Write Content) */}
              <div>
                <label className="block text-xs font-bold text-brand-text mb-2">Content Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'text', label: '📝 Write Notes', icon: BookOpen },
                    { id: 'file', label: '📄 Upload File', icon: Upload },
                    { id: 'link', label: '🔗 Add Link/URL', icon: LinkIcon }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                        type === t.id
                          ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                          : 'bg-white text-brand-text border-orange-200 hover:bg-orange-50'
                      }`}
                    >
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Input based on Type */}
              {type === 'link' && (
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">External Link / Video URL</label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or website URL"
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-medium focus:outline-none text-brand-text"
                  />
                </div>
              )}

              {type === 'file' && (
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Upload File / Document</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if(e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    setFileUrl(reader.result);
    alert('File loaded successfully!');
  };
  reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-2.5 text-xs font-medium focus:outline-none text-brand-text"
                  />
                </div>
              )}

              {/* AI Content Assistant Toggle (PRD Item 9) */}
              <div className="bg-brand-orange-light/60 rounded-2xl p-4 border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-brand-text flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-brand-orange" />
                    🤖 AI Content Assistant
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAiInput(!showAiInput)}
                    className="text-xs font-bold text-brand-orange hover:underline"
                  >
                    {showAiInput ? 'Hide AI' : '🤖 Help me with AI'}
                  </button>
                </div>

                {showAiInput && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="e.g. Explain photosynthesis for Class 7"
                        className="flex-1 bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateWithAI}
                        disabled={aiLoading || !aiTopic.trim()}
                        className="px-4 py-2 bg-brand-orange text-white font-bold text-xs rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1 shrink-0"
                      >
                        {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Generate</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-brand-muted block">AI generates structured lesson notes. You can edit before saving!</span>
                  </div>
                )}
              </div>

              {/* Manual Content / Notes Textarea */}
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Educational Content & Notes (Editable)</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write or edit educational explanation notes here..."
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-4 text-xs font-medium focus:outline-none text-brand-text leading-relaxed"
                />
              </div>

            </div>

            {/* Action Buttons (Item 11: Save Draft vs Publish Content) */}
            <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-5 py-3 bg-white text-brand-text border border-orange-300 font-bold text-xs rounded-2xl hover:bg-orange-50 transition-colors"
              >
                💾 Save as Draft
              </button>

              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>🚀 Publish Content</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherContentPage;
