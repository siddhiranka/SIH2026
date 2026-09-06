import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bot, Mic, ArrowRight, Sparkles, Clock, CheckCircle, Users, Key, LogIn, AlertCircle } from 'lucide-react';
import AITutorModal from '../components/AITutorModal';
import api from '../utils/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Join class state
  const [classCode, setClassCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMsg, setJoinMsg] = useState(null); // { type: 'success'|'error', text }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Fetch student dashboard error:', err);
      }
    };
    fetchDashboard();
  }, []);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    setJoinLoading(true);
    setJoinMsg(null);
    try {
      const res = await api.post('/student/update-class', { classCode: classCode.trim() });
      setJoinMsg({ type: 'success', text: res.data.message || 'Joined class successfully! Refresh to see your content.' });
      setClassCode('');
      // Update local user state with new class name
      if (res.data.className) updateUserStats({ className: res.data.className });
    } catch (err) {
      setJoinMsg({ type: 'error', text: err?.response?.data?.message || 'Invalid class code. Please try again.' });
    } finally {
      setJoinLoading(false);
    }
  };

  const subjects = [
    { name: 'Mathematics', icon: '📐', progress: 70, color: '#F47C20' },
    { name: 'Science', icon: '🔬', progress: 60, color: '#4DB8FF' },
    { name: 'English', icon: '📖', progress: 80, color: '#FFD84D' },
    { name: 'Social Science', icon: '🌍', progress: 65, color: '#5BCB93' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto w-full">
      
      {/* Continue Learning Card - Starts Directly With Content (PRD Section 6 & 7) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-100 shadow-md relative overflow-hidden group hover:border-brand-orange transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-orange" />
            Continue Learning
          </span>
          <span className="text-xs font-extrabold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200">
            70% Complete
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-brand-orange bg-brand-orange-light px-2.5 py-1 rounded-lg">
              Mathematics
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-text mt-2">
              Fractions — Chapter 3
            </h3>
            <p className="text-xs text-brand-muted mt-1">
              Understanding Numerators, Denominators & Equivalent Fractions
            </p>
          </div>

          <button
            onClick={() => navigate('/my-learning')}
            className="w-full sm:w-auto px-6 py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-brand-orange-soft/40 rounded-full h-3 overflow-hidden">
          <div className="bg-brand-orange h-3 rounded-full transition-all duration-500 w-[70%]" />
        </div>
      </div>

      {/* Join Class Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-blue-100 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-brand-text">Your Class</h3>
            <p className="text-[11px] text-brand-muted">
              {user?.className ? <>Currently in: <span className="font-bold text-blue-700">{user.className}</span></> : 'Not joined any class yet'}
            </p>
          </div>
        </div>

        <form onSubmit={handleJoinClass} className="flex flex-col sm:flex-row gap-2 mt-3">
          <input
            type="text"
            value={classCode}
            onChange={e => setClassCode(e.target.value.toUpperCase())}
            placeholder="Enter class code (e.g. ABC123)"
            className="flex-1 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2.5 text-xs font-bold tracking-widest focus:outline-none focus:border-blue-400 uppercase placeholder:normal-case placeholder:tracking-normal"
            maxLength={10}
          />
          <button
            type="submit"
            disabled={joinLoading || !classCode.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
          >
            {joinLoading ? <span>Joining…</span> : <><LogIn className="w-3.5 h-3.5" /><span>Join Class</span></>}
          </button>
        </form>

        {joinMsg && (
          <div className={`mt-2 flex items-start gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${joinMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {joinMsg.text}
          </div>
        )}
      </div>

            {/* Functional Student Sections Grid (PRD Section 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Subjects */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-brand-text">My Subjects</h3>
              <button onClick={() => navigate('/my-learning')} className="text-xs font-bold text-brand-orange hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {subjects.map((sub) => (
                <div
                  key={sub.name}
                  onClick={() => navigate('/my-learning')}
                  className="p-4 rounded-2xl bg-brand-orange-light/50 border border-orange-100 hover:border-brand-orange transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sub.icon}</span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-brand-text">{sub.name}</h4>
                      <span className="text-[10px] text-brand-muted font-semibold">{sub.progress}% Mastery</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-orange" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: AI Tutor Card (PRD Section 7) */}
        <div className="space-y-6">
          <div className="bg-brand-orange-light rounded-3xl p-6 border border-orange-200 shadow-md text-center space-y-3 h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-text">Need help with something?</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Ask your AI learning assistant in your language.
            </p>

            <div className="flex flex-col xl:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsAIOpen(true)}
                className="w-full py-2.5 bg-brand-orange text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI</span>
              </button>

              <button
                onClick={() => setIsAIOpen(true)}
                className="w-full py-2.5 bg-white text-brand-orange border border-orange-300 font-bold text-xs rounded-2xl shadow-sm hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Mic className="w-4 h-4" />
                <span>🎤 Speak</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Assignment / Quiz */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm text-brand-text">
                {dashboardData?.upcomingAssignments?.[0] ? 'Upcoming Assignment' : dashboardData?.upcomingQuizzes?.[0] ? 'Available Quiz' : 'Upcoming Tasks'}
              </h3>
              <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                {dashboardData?.upcomingAssignments?.[0] ? 'Homework' : dashboardData?.upcomingQuizzes?.[0] ? 'Quiz' : 'Active'}
              </span>
            </div>

            {dashboardData?.upcomingAssignments?.[0] ? (
              <div className="p-4 rounded-2xl bg-brand-orange-light border border-orange-200">
                <span className="text-[10px] font-bold text-brand-orange bg-white px-2 py-0.5 rounded-md border border-orange-100">
                  {dashboardData.upcomingAssignments[0].subject}
                </span>
                <h4 className="font-bold text-sm text-brand-text mt-1">{dashboardData.upcomingAssignments[0].title}</h4>
                <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">{dashboardData.upcomingAssignments[0].description}</p>
                
                <button
                  onClick={() => navigate('/assignments')}
                  className="w-full mt-3 py-2 bg-brand-orange text-white hover:bg-orange-600 font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Start Assignment
                </button>
              </div>
            ) : dashboardData?.upcomingQuizzes?.[0] ? (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] font-bold text-brand-purple bg-white px-2 py-0.5 rounded-md border border-purple-100">
                  {dashboardData.upcomingQuizzes[0].subject}
                </span>
                <h4 className="font-bold text-sm text-brand-text mt-1">{dashboardData.upcomingQuizzes[0].title}</h4>
                <p className="text-xs text-brand-muted mt-0.5">{dashboardData.upcomingQuizzes[0].totalMarks} Marks • {dashboardData.upcomingQuizzes[0].timeLimitMinutes || 15} mins</p>
                
                <button
                  onClick={() => navigate(`/quiz/${dashboardData.upcomingQuizzes[0]._id}`)}
                  className="w-full mt-3 py-2 bg-brand-purple text-white hover:bg-purple-700 font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Attend Quiz 🚀
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-brand-orange-light border border-orange-200 text-center py-6">
                <p className="text-xs font-bold text-brand-muted">No pending homework right now!</p>
                <button
                  onClick={() => navigate('/my-learning')}
                  className="mt-3 px-4 py-2 bg-brand-orange text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Explore Lessons & Quizzes
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Embedded AI Tutor Modal */}
      <AITutorModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

    </div>
  );
};

export default StudentDashboard;
