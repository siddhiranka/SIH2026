import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle2, Clock, Send, Sparkles, Mic, Paperclip } from 'lucide-react';
import api from '../utils/api';
import VoiceMicButton from '../components/VoiceMicButton';
import { useAuth } from '../context/AuthContext';

const AssignmentsPage = () => {
  const { updateUserStats } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssign, setSelectedAssign] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/student/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error('Fetch assignments error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssign) return;
    setSubmitting(true);
    setSubmitSuccess('');

    try {
      const formData = new FormData();
      formData.append('textAnswer', textAnswer);
      if (file) {
        formData.append('file', file);
      }

      const res = await api.post(`/student/assignments/${selectedAssign._id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitSuccess('✅ Assignment Submitted Successfully! (+20 Learning Points 🎉)');
      if (res.data.learningPoints) {
        updateUserStats({ learningPoints: res.data.learningPoints });
      }
      setSelectedAssign(null);
      setTextAnswer('');
      setFile(null);
      fetchAssignments();
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitSuccess('Error submitting assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
          📝 Homework & Assignments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your tasks on time. Submit answers via text, image photo, or PDF document.
        </p>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-800 font-bold text-sm">
          {submitSuccess}
        </div>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((item) => (
          <div 
            key={item._id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-brand-purple bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  {item.subject}
                </span>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-brand-text">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">{item.description}</p>
            </div>

            {/* Submission Status or Action */}
            <div className="w-full md:w-auto shrink-0 flex items-center justify-end">
              {item.submission ? (
                <div className="bg-brand-bg p-4 rounded-2xl border border-gray-100 text-right space-y-1 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 justify-end text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{item.submission.status === 'Graded' ? 'Graded' : 'Submitted'}</span>
                  </div>
                  {item.submission.score !== null && item.submission.score !== undefined && (
                    <p className="text-sm font-extrabold text-brand-purple">
                      Score: {item.submission.score} / {item.totalPoints || 10}
                    </p>
                  )}
                  {item.submission.feedback && (
                    <p className="text-xs text-gray-500 italic max-w-xs">"{item.submission.feedback}"</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSelectedAssign(item)}
                  className="w-full md:w-auto px-6 py-3 bg-brand-purple hover:bg-purple-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Start Assignment</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAssign && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-brand-purple bg-purple-50 px-2.5 py-0.5 rounded-md">
                  {selectedAssign.subject}
                </span>
                <h3 className="font-display font-bold text-xl text-brand-text mt-1">{selectedAssign.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedAssign(null)} 
                className="text-gray-400 hover:text-brand-text text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              
              {/* Text Answer */}
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Write Your Answer
                </label>
                <textarea
                  rows={4}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your homework answer step-by-step here..."
                  className="w-full bg-brand-bg border border-gray-200 rounded-2xl p-4 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                />
              </div>

              {/* Voice Assistance */}
              <div className="flex items-center justify-between bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                <span className="text-xs font-bold text-purple-700">Need a voice note?</span>
                <VoiceMicButton onTranscript={(txt) => setTextAnswer(prev => prev + " " + txt)} />
              </div>

              {/* File Upload (Cloudinary) */}
              <div>
                <label className="block text-xs font-bold text-brand-text mb-1">
                  Upload Photo or PDF (Optional)
                </label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-brand-bg hover:border-brand-purple transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Paperclip className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 font-medium">
                    {file ? file.name : "Click to select a photo of your notebook or document file"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssign(null)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-purple hover:bg-purple-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Work'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AssignmentsPage;
