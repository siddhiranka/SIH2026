import React, { useState, useEffect } from 'react';
import { Users, Key, AlertCircle, Plus, Loader2 } from 'lucide-react';
import api from '../utils/api';

const TeacherClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/teacher/classes');
      setClasses(res.data);
    } catch (err) {
      console.error('Fetch classes error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.post('/teacher/classes', {
        className: newClassName,
        subjectName: 'General Studies',
        grade: '7'
      });
      setNewClassName('');
      setIsCreating(false);
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating class');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
            🏫 My Classes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create classes, generate access codes, and manage your students.
          </p>
        </div>
        
        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-brand-orange text-white font-bold text-sm rounded-2xl shadow-md hover:bg-orange-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Class
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-3xl p-6 border border-brand-orange shadow-md max-w-md animate-in slide-in-from-top-4">
          <h3 className="font-display font-bold text-lg text-brand-text mb-4">Create New Class</h3>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1">Class Name</label>
              <input
                type="text"
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="e.g. Class 7A"
                className="w-full bg-brand-bg border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 py-2.5 bg-brand-orange text-white font-bold text-xs rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-text">No classes yet</h3>
          <p className="text-sm text-brand-muted mt-1">Create a class to generate a class code for your students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-brand-text">{cls.className}</h3>
                  <p className="text-xs font-bold text-brand-orange mt-1">Grade {cls.grade} • {cls.subjectName}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-brand-bg rounded-2xl p-4 border border-gray-100 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Class Code</span>
                  <span className="font-display font-bold text-lg text-brand-text tracking-widest">{cls.classCode}</span>
                </div>
                <button
                  onClick={() => {
    try {
      navigator.clipboard.writeText(cls.classCode);
      alert('Class Code ' + cls.classCode + ' copied to clipboard!');
    } catch(e) {
      alert('Copy failed. The code is: ' + cls.classCode);
    }
  }}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:border-brand-orange hover:text-brand-orange transition-colors"
                >
                  Copy
                </button>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-brand-muted">
                  {cls.students?.length || 0} Students Joined
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherClassesPage;
