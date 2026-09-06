
import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, FileText, Send, Sparkles, User, ExternalLink, Bot, Loader2, Trash2, Edit, X, Eye, Award } from 'lucide-react';
import api from '../utils/api';

const TeacherQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('Class 7A');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [status, setStatus] = useState('draft');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      marks: 1
    }
  ]);

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);

  // Results Modal State
  const [viewResultsQuiz, setViewResultsQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [message, setMessage] = useState('');

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/quizzes');
      setQuizzes(res.data || []);
    } catch (err) {
      console.error('Fetch quizzes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/teacher/classes');
      setClasses(res.data || []);
      if (res.data?.length > 0) {
        setClassId(res.data[0]._id);
        setClassName(res.data[0].className);
      }
    } catch (err) {
      console.error('Fetch classes error:', err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchClasses();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSubject('Mathematics');
    setTimeLimitMinutes(15);
    setStatus('draft');
    setQuestions([
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        marks: 1
      }
    ]);
    setShowAiInput(false);
    setAiTopic('');
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setTitle(item.title || '');
      setDescription(item.description || '');
      setSubject(item.subject || 'Mathematics');
      setClassId(item.classId?._id || item.classId || '');
      setClassName(item.className || 'Class 7A');
      setTimeLimitMinutes(item.timeLimitMinutes || 15);
      setStatus(item.status || 'draft');
      setQuestions(item.questions?.length > 0 ? item.questions : [
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          marks: 1
        }
      ]);
    } else {
      resetForm();
    }
    setShowCreateModal(true);
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        marks: 1
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qIndex].options];
      opts[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return updated;
    });
  };

  const handleGenerateAIQuiz = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-quiz', {
        topic: aiTopic,
        subject,
        count: numQuestions
      });

      if (res.data?.questions?.length > 0) {
        const formatted = res.data.questions.map(q => ({
          questionText: q.question,
          options: q.options || ['', '', '', ''],
          correctAnswerIndex: q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : 0,
          explanation: q.explanation || '',
          marks: 1
        }));
        setQuestions(formatted);
        if (!title) setTitle(`${aiTopic} Quiz`);
        if (!description) setDescription(`Multiple choice test on ${aiTopic}`);
      }
    } catch (err) {
      console.error('AI Generate Quiz error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (targetStatus = status) => {
    if (!title.trim()) {
      alert('Please provide a quiz title.');
      return;
    }

    const payload = {
      title,
      description,
      subject,
      classId,
      timeLimitMinutes: Number(timeLimitMinutes),
      questions,
      status: targetStatus
    };

    try {
      if (editingId) {
        await api.patch(`/teacher/quizzes/${editingId}`, payload);
        setMessage('Quiz updated successfully! ✅');
      } else {
        await api.post('/teacher/quizzes', payload);
        setMessage(targetStatus === 'published' ? 'Quiz published to class! 🚀' : 'Quiz saved as draft! 📝');
      }
      setShowCreateModal(false);
      resetForm();
      fetchQuizzes();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Save quiz error:', err);
      alert('Error saving quiz: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      if (currentStatus === 'draft') {
        await api.post(`/teacher/quizzes/${id}/publish`);
        setMessage('Quiz published to students! 🚀');
      } else {
        await api.patch(`/teacher/quizzes/${id}`, { status: 'draft' });
        setMessage('Quiz moved to drafts. 📝');
      }
      fetchQuizzes();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz? All student attempts will also be permanently removed.')) return;
    try {
      await api.delete(`/teacher/quizzes/${id}`);
      setMessage('Quiz deleted successfully 🗑️');
      fetchQuizzes();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Delete quiz error:', err);
    }
  };

  const handleViewResults = async (quiz) => {
    setViewResultsQuiz(quiz);
    setResultsLoading(true);
    try {
      const res = await api.get(`/teacher/quizzes/${quiz._id}/results`);
      setQuizResults(res.data);
    } catch (err) {
      console.error('Fetch results error:', err);
    } finally {
      setResultsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-orange-100 shadow-md">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-text flex items-center gap-2">
            📝 Quiz Management & Results
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Create structured multiple choice quizzes, publish them directly to your classes, and track student scores and averages.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Quiz</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-brand-orange font-bold text-xs shadow-sm">
          {message}
        </div>
      )}

      {/* Quiz List */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-brand-text">Class Quizzes</h3>

        {loading ? (
          <div className="text-center py-8 text-xs font-bold text-brand-muted">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-orange-100 space-y-2">
            <Award className="w-12 h-12 text-brand-orange mx-auto opacity-50" />
            <h4 className="font-bold text-base text-brand-text">No quizzes created yet</h4>
            <p className="text-xs text-brand-muted">Click "+ Create Quiz" to author your first assessment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {quizzes.map(item => (
              <div key={item._id} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange-light px-2.5 py-0.5 rounded-full border border-orange-200">
                      {item.subject} • {item.className || item.classId?.className || 'Class'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize border ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {item.status === 'published' ? 'Published ✓' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-brand-muted font-semibold">
                      ⏱️ {item.timeLimitMinutes || 15} mins • {item.questions?.length || 0} Questions • {item.totalMarks} Marks
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-brand-text">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                  <button
                    onClick={() => handleViewResults(item)}
                    className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-brand-purple border border-purple-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Results</span>
                  </button>

                  <button
                    onClick={() => handlePublishToggle(item._id, item.status)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                      item.status === 'published'
                        ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {item.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 text-brand-muted hover:text-brand-orange hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-brand-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Modal */}
      {viewResultsQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 border border-orange-100">
            
            <div className="p-6 bg-brand-orange text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/20">
                  {viewResultsQuiz.subject}
                </span>
                <h3 className="font-display font-bold text-xl mt-1">{viewResultsQuiz.title} — Results</h3>
              </div>
              <button
                onClick={() => { setViewResultsQuiz(null); setQuizResults(null); }}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {resultsLoading ? (
                <div className="text-center py-12 text-xs font-bold text-brand-muted">Loading results...</div>
              ) : !quizResults || quizResults.attempts?.length === 0 ? (
                <div className="text-center py-12 text-xs font-bold text-brand-muted">
                  No students have attempted this quiz yet.
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center">
                      <div className="text-[10px] font-bold text-brand-muted uppercase">Total Submissions</div>
                      <div className="font-display font-bold text-2xl text-brand-orange mt-0.5">
                        {quizResults.stats.totalAttempts}
                      </div>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-center">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase">Class Average Score</div>
                      <div className="font-display font-bold text-2xl text-emerald-700 mt-0.5">
                        {quizResults.stats.averageScore} / {quizResults.stats.totalMarks}
                      </div>
                    </div>
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-center">
                      <div className="text-[10px] font-bold text-brand-purple uppercase">Average Accuracy</div>
                      <div className="font-display font-bold text-2xl text-brand-purple mt-0.5">
                        {quizResults.stats.averagePercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Student Table */}
                  <div className="border border-orange-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-orange-50/50 text-brand-muted uppercase font-bold border-b border-orange-100">
                        <tr>
                          <th className="p-3.5">Student Name</th>
                          <th className="p-3.5">Student ID / Email</th>
                          <th className="p-3.5">Score</th>
                          <th className="p-3.5">Percentage</th>
                          <th className="p-3.5">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-50 font-medium text-brand-text">
                        {quizResults.attempts.map(attempt => (
                          <tr key={attempt._id} className="hover:bg-orange-50/20 transition-colors">
                            <td className="p-3.5 font-bold flex items-center gap-2">
                              <User className="w-4 h-4 text-brand-orange" />
                              {attempt.studentName || attempt.studentId?.name || 'Student'}
                            </td>
                            <td className="p-3.5 text-brand-muted">
                              {attempt.studentId?.studentId || attempt.studentId?.email || 'N/A'}
                            </td>
                            <td className="p-3.5 font-extrabold text-brand-orange">
                              {attempt.score} / {attempt.totalMarks}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                attempt.percentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {attempt.percentage}%
                              </span>
                            </td>
                            <td className="p-3.5 text-brand-muted text-[11px]">
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Create / Edit Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 border border-orange-100">
            
            <div className="p-6 bg-brand-orange text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-xl">
                {editingId ? 'Edit Quiz' : 'Create New Multiple Choice Quiz'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* AI Generator Panel */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-orange" />
                    <span className="text-xs font-bold text-brand-orange">AI Quiz Generator (Gemini)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAiInput(!showAiInput)}
                    className="text-xs text-brand-orange font-bold hover:underline"
                  >
                    {showAiInput ? 'Hide AI' : 'Generate with AI'}
                  </button>
                </div>

                {showAiInput && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Enter topic (e.g., Photosynthesis, Fraction Multiplication, Solar System)..."
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="flex-1 bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                      />
                      <select
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(Number(e.target.value))}
                        className="bg-white border border-orange-200 rounded-xl px-3 py-2.5 text-xs text-brand-text font-bold"
                      >
                        <option value={3}>3 Questions</option>
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleGenerateAIQuiz}
                        disabled={aiLoading || !aiTopic.trim()}
                        className="px-4 py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                      >
                        {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Generate
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Quiz Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Fractions Chapter 3 Quiz"
                    className="w-full bg-brand-orange-light/30 border border-orange-200 rounded-xl px-4 py-2.5 text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Target Class / Section *</label>
                  <select
                    value={classId}
                    onChange={(e) => {
                      setClassId(e.target.value);
                      const cls = classes.find(c => c._id === e.target.value);
                      if (cls) setClassName(cls.className);
                      else setClassName('All Classes');
                    }}
                    className="w-full bg-brand-orange-light/30 border border-orange-200 rounded-xl px-4 py-2.5 text-xs text-brand-text font-bold"
                  >
                    <option value="">🌐 All Classes (Publish to All Students)</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.className} (Code: {c.classCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-brand-orange-light/30 border border-orange-200 rounded-xl px-4 py-2.5 text-xs text-brand-text font-bold"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(e.target.value)}
                    className="w-full bg-brand-orange-light/30 border border-orange-200 rounded-xl px-4 py-2.5 text-xs text-brand-text font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instructions or topics covered in this quiz..."
                  className="w-full bg-brand-orange-light/30 border border-orange-200 rounded-xl px-4 py-2 text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                />
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-orange-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-brand-text">
                    Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-brand-orange border border-orange-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-5 rounded-2xl bg-orange-50/30 border border-orange-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-brand-orange uppercase">
                          Question {qIdx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-xs text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Type question here..."
                          value={q.questionText}
                          onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                          className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-xs text-brand-text font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                        />
                      </div>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-brand-muted">
                          Options & Correct Answer (Select the radio button for the correct option):
                        </label>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={q.correctAnswerIndex === oIdx}
                              onChange={() => handleQuestionChange(qIdx, 'correctAnswerIndex', oIdx)}
                              className="w-4 h-4 text-brand-orange focus:ring-brand-orange cursor-pointer"
                            />
                            <span className="text-xs font-bold text-brand-muted w-4">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <input
                              type="text"
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                              className="flex-1 bg-white border border-orange-200 rounded-xl px-3.5 py-2 text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-text text-xs font-bold transition-all"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
              >
                Publish to Class 🚀
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherQuizzesPage;
