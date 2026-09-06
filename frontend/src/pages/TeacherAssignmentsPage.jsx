import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, FileText, Send, Sparkles, User, ExternalLink, Bot, Loader2, Trash2, Edit, X, Link as LinkIcon, Upload } from 'lucide-react';
import api from '../utils/api';

const TeacherAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [viewSubmissionsAssignmentId, setViewSubmissionsAssignmentId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('Class 7A');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState(10);
  const [status, setStatus] = useState('draft'); // 'draft' or 'published'
  const [fileUrl, setFileUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  // Grade State
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, sRes] = await Promise.all([
        api.get('/teacher/assignments'),
        api.get('/teacher/submissions')
      ]);
      setAssignments(aRes.data || []);
      setSubmissions(sRes.data || []);
    } catch (err) {
      console.error('Fetch teacher assignments error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    api.get('/teacher/classes').then(r => {
      const cls = r.data || [];
      setClasses(cls);
      if (cls.length > 0) setClassId(cls[0]._id);
    }).catch(err => console.error('Fetch classes error:', err));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSubject('Mathematics');
    setClassName('Class 7A');
    setDueDate('');
    setTotalPoints(10);
    setStatus('draft');
    setFileUrl('');
    setExternalUrl('');
    setShowAiInput(false);
    setAiTopic('');
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setTitle(item.title || '');
      setDescription(item.description || '');
      setSubject(item.subject || 'Mathematics');
      setClassName(item.className || 'Class 7A');
      setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '');
      setTotalPoints(item.totalPoints || 10);
      setStatus(item.status || 'draft');
      setFileUrl(item.attachments?.[0] || '');
      setExternalUrl(item.links?.[0] || '');
    } else {
      resetForm();
    }
    setShowCreateModal(true);
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-assignment', {
        topic: aiTopic,
        subject,
        grade: '7',
        count: numQuestions
      });
      if (res.data?.content) {
        setDescription(res.data.content);
        if (!title) setTitle(`${aiTopic} Practice Assignment`);
      }
    } catch (err) {
      console.error('AI Generate Assignment error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAssignment = async (targetStatus = status) => {
    if (!title.trim()) {
      alert('Please provide an assignment title.');
      return;
    }

    const payload = {
      title,
      description,
      subject,
      classId, dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalPoints: Number(totalPoints) || 10,
      attachments: fileUrl ? [fileUrl] : [],
      links: externalUrl ? [externalUrl] : [],
      status: targetStatus
    };

    try {
      if (editingId) {
        await api.patch(`/teacher/assignments/${editingId}`, payload);
        setMessage('Assignment updated successfully! ✅');
      } else {
        await api.post('/teacher/assignments', payload);
        setMessage(targetStatus === 'published' ? 'Assignment published to class! 🚀' : 'Assignment saved as draft! 📝');
      }
      setShowCreateModal(false);
      resetForm();
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Save assignment error:', err);
      alert('Error saving assignment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      if (currentStatus === 'draft') {
        await api.post(`/teacher/assignments/${id}/publish`);
        setMessage('Assignment published to students! 🚀');
      } else {
        await api.patch(`/teacher/assignments/${id}`, { status: 'draft' });
        setMessage('Assignment moved to drafts. 📝');
      }
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Publish assignment error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(`/teacher/assignments/${id}`);
      setMessage('Assignment deleted 🗑️');
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Delete assignment error:', err);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    try {
      await api.post(`/teacher/submissions/${gradingSubmission._id}/grade`, {
        score: Number(score),
        feedback
      });
      setMessage('Grade and Feedback saved successfully! ✅');
      setGradingSubmission(null);
      setScore('');
      setFeedback('');
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Grade error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto w-full">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-md">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-text flex items-center gap-2">
            📝 Assignments & Grading Suite
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Create, publish, and review student homework assignments, worksheets, and attachments.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Assignment</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-brand-orange font-bold text-xs shadow-sm">
          {message}
        </div>
      )}

      {/* Assignment List Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-brand-text">Class Assignments</h3>

        {loading ? (
          <div className="text-center py-8 text-xs font-bold text-brand-muted">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-orange-100 space-y-2">
            <FileText className="w-12 h-12 text-brand-orange mx-auto opacity-50" />
            <h4 className="font-bold text-base text-brand-text">No assignments created yet</h4>
            <p className="text-xs text-brand-muted">Click "+ Create Assignment" to create your first class task.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {assignments.map(item => (
              <div key={item._id} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-2.5 py-0.5 rounded-full border border-orange-200">
                      {item.subject} • {item.className}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize border ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {item.status === 'published' ? 'Published ✓' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-brand-muted font-semibold">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-brand-text">{item.title}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    onClick={() => handlePublishToggle(item._id, item.status)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      item.status === 'draft'
                        ? 'bg-brand-orange text-white border-brand-orange hover:bg-orange-600'
                        : 'bg-white text-brand-muted border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    {item.status === 'draft' ? '🚀 Publish' : 'Draft'}
                  </button>

                  <button
                    onClick={() => setViewSubmissionsAssignmentId(item._id === viewSubmissionsAssignmentId ? null : item._id)}
                    className="px-3.5 py-2 bg-brand-orange-light text-brand-orange font-bold text-xs rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors"
                  >
                    Submissions ({item.submittedCount || 0})
                  </button>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 rounded-xl text-gray-500 hover:text-brand-orange hover:bg-brand-orange-light transition-colors"
                    title="Edit Assignment"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Submissions List (PRD Item 21: Rahul Submitted, Priya Submitted, Aman Pending) */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4">
        <h3 className="font-display font-bold text-xl text-brand-text">Student Submissions & Review</h3>

        <div className="space-y-3">
          {submissions.length === 0 ? (
            <p className="text-xs text-brand-muted italic">No student submissions submitted yet.</p>
          ) : (
            submissions.map(sub => (
              <div key={sub._id} className="p-4 rounded-2xl bg-brand-orange-light/30 border border-orange-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-orange bg-white px-2.5 py-0.5 rounded-full border border-orange-200">
                      👤 {sub.studentName}
                    </span>
                    <span className="text-[11px] text-brand-muted">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-brand-text">
                    {sub.assignment?.title || sub.assignmentId?.title || 'Fractions Assignment'}
                  </h4>
                  <p className="text-xs text-brand-muted italic line-clamp-2">
                    "{sub.textAnswer || 'Attachment submitted'}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {sub.status === 'Graded' ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      Graded ({sub.score}/10)
                    </span>
                  ) : (
                    <button
                      onClick={() => { setGradingSubmission(sub); setScore(sub.score || 8); setFeedback(sub.feedback || 'Good work!'); }}
                      className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      Grade Work
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE / EDIT ASSIGNMENT MODAL (PRD Item 14, 15, 16, 17) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 border border-orange-100 my-8 flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center pb-3 border-b border-orange-100 shrink-0">
              <h3 className="font-display font-bold text-xl text-brand-text flex items-center gap-2">
                {editingId ? '✏️ Edit Assignment' : '📝 Create Assignment'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 font-bold hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Subject</label>
                  <input
    type="text"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    placeholder="e.g. Mathematics, Science..."
    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-bold focus:outline-none"
  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Class / Target Group</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-bold focus:outline-none"
                  >
                    <option value="">🌐 All Classes (Publish to All Students)</option>
                    {(Array.isArray(classes) ? classes : []).map(cl => (
                      <option key={cl._id} value={cl._id}>{cl.className} (Code: {cl.classCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water Cycle Diagram & Worksheet"
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Total Points</label>
                  <input
                    type="number"
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(e.target.value)}
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* AI Assignment Generator Toggle (PRD Item 15) */}
              <div className="bg-brand-orange-light/60 rounded-2xl p-4 border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-brand-text flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-brand-orange" />
                    🤖 AI Assignment Assistant
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAiInput(!showAiInput)}
                    className="text-xs font-bold text-brand-orange hover:underline"
                  >
                    {showAiInput ? 'Hide AI' : '🤖 Create with AI'}
                  </button>
                </div>

                {showAiInput && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
      type="text"
      value={aiTopic}
      onChange={(e) => setAiTopic(e.target.value)}
      placeholder="e.g. Fractions Quiz"
      className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
    />
    <input
      type="number"
      min="1"
      max="20"
      value={numQuestions}
      onChange={(e) => setNumQuestions(e.target.value)}
      title="Number of questions"
      className="w-16 bg-white border border-purple-200 rounded-xl px-2 py-2 text-xs focus:outline-none text-center"
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
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Instructions & Questions (Editable)</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed assignment instructions and questions..."
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-4 text-xs font-medium focus:outline-none leading-relaxed"
                />
              </div>

              {/* Attachments & External Link Inputs (PRD Item 14) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">Attached PDF / File</label>
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
                      className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>

                <div>
                  <label className="block text-xs font-bold text-brand-text mb-1">External Reference Link (Optional)</label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="Paste video / web link..."
                    className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Sticky Action Bar (PRD Item 17: Save Draft vs Publish Assignment) */}
            <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => handleSaveAssignment('draft')}
                className="px-5 py-3 bg-white text-brand-text border border-orange-300 font-bold text-xs rounded-2xl hover:bg-orange-50 transition-colors"
              >
                💾 Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSaveAssignment('published')}
                className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>🚀 Publish Assignment</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Grading Modal (PRD Section 21) */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95 border border-orange-100">
            <div className="flex justify-between items-center pb-3 border-b border-orange-100">
              <div>
                <span className="text-xs font-bold text-brand-orange">Student: {gradingSubmission.studentName}</span>
                <h3 className="font-display font-bold text-lg text-brand-text">Grade Submission</h3>
              </div>
              <button onClick={() => setGradingSubmission(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <div className="bg-brand-orange-light/40 p-4 rounded-2xl border border-orange-100 text-xs space-y-2">
              <span className="font-bold text-brand-muted uppercase tracking-wider block">Submitted Answer:</span>
              <p className="text-brand-text font-medium leading-relaxed">
                {gradingSubmission.textAnswer || 'File uploaded'}
              </p>
              {gradingSubmission.fileUrl && (
                <a href={gradingSubmission.fileUrl} target="_blank" rel="noreferrer" className="text-brand-orange font-bold flex items-center gap-1 mt-1 underline">
                  <ExternalLink className="w-3.5 h-3.5" /> View Uploaded Attachment
                </a>
              )}
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Score (out of 10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  required
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g. 9"
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">Feedback for Student</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Great explanation! Next time remember to simplify step 3."
                  className="w-full bg-brand-orange-light/40 border border-orange-200 rounded-2xl p-3 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-500 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-orange text-white font-bold text-xs rounded-2xl shadow-md hover:bg-orange-600"
                >
                  Save Score & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherAssignmentsPage;
