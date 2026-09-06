import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, AlertTriangle, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import api from '../utils/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/teacher/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Fetch teacher dashboard error:', err);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    totalClasses: 4,
    totalStudents: 32,
    pendingReviews: 5,
    totalAssignments: 8
  };

  const classPerformance = data?.classPerformance || [
    { id: '1', name: 'Class 7A', subject: 'Mathematics', averageScore: 78, studentCount: 32 },
    { id: '2', name: 'Class 7B', subject: 'Science', averageScore: 84, studentCount: 28 }
  ];

  const strugglingStudents = data?.strugglingStudents || [
    { id: 'st-1', name: 'Rahul Sharma', class: 'Class 7A', topic: 'Fractions', score: 58 },
    { id: 'st-2', name: 'Ananya Verma', class: 'Class 7A', topic: 'Fractions', score: 62 },
    { id: 'st-3', name: 'Karan Patel', class: 'Class 7B', topic: 'Algebra Basics', score: 54 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto">
      
      {/* Header (PRD Section 22) */}
      <div className="bg-brand-orange-light rounded-4xl p-6 sm:p-8 border border-orange-200 shadow-sm">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-brand-orange px-3 py-1 rounded-full border border-orange-200 mb-3">
          <Sparkles className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
          <span>Teacher Dashboard</span>
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-brand-text">
          Good morning, Mrs. Sharma 👋
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Monitor class performance, review submissions, and support struggling students.
        </p>
      </div>

      {/* Top 4 Stats Cards (PRD Section 22) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
            <Users className="w-7 h-7 text-brand-orange" />
          </div>
          <div>
            <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Classes</span>
            <h3 className="font-display font-bold text-2xl text-brand-text">{stats.totalClasses}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
            <Users className="w-7 h-7 text-brand-orange" />
          </div>
          <div>
            <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Students</span>
            <h3 className="font-display font-bold text-2xl text-brand-text">126</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
            <FileText className="w-7 h-7 text-brand-orange" />
          </div>
          <div>
            <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Assignments</span>
            <h3 className="font-display font-bold text-2xl text-brand-text">8</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
            <AlertTriangle className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <span className="text-xs text-brand-muted font-bold uppercase tracking-wider">Pending</span>
            <h3 className="font-display font-bold text-2xl text-orange-700">12</h3>
          </div>
        </div>

      </div>

      {/* Quick Action Suite Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-orange-100 hover:border-brand-orange shadow-md space-y-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-xl">
              📚
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-brand-text">Content Management Suite</h3>
              <p className="text-xs text-brand-muted">Create notes, upload PDFs/videos, and use AI help.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/teacher-content')}
            className="w-full py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Content Suite</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-orange-100 hover:border-brand-orange shadow-md space-y-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-orange-light text-brand-orange rounded-2xl flex items-center justify-center font-bold text-xl">
              📝
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-brand-text">Assignment System</h3>
              <p className="text-xs text-brand-muted">Create assignments with AI & review submissions.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/teacher-assignments')}
            className="w-full py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Assignments System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* My Classes Grid (PRD Section 22) */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4">
        <h3 className="font-display font-bold text-xl text-brand-text">My Classes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-brand-orange-light/50 border border-orange-200 flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-lg text-brand-text">Class 7A</h4>
              <p className="text-xs text-brand-muted font-medium mt-0.5">32 Students • Math & Science</p>
            </div>
            <button
              onClick={() => navigate('/teacher-classes')}
              className="px-5 py-2.5 bg-brand-orange text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-orange-600 transition-colors"
            >
              Open Class
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-brand-orange-light/50 border border-orange-200 flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-lg text-brand-text">Class 7B</h4>
              <p className="text-xs text-brand-muted font-medium mt-0.5">30 Students • Mathematics</p>
            </div>
            <button
              onClick={() => navigate('/teacher-classes')}
              className="px-5 py-2.5 bg-white text-brand-orange border border-orange-300 font-bold text-xs rounded-2xl shadow-sm hover:bg-orange-50 transition-colors"
            >
              Open Class
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;
