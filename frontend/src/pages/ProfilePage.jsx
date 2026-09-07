import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Sparkles, Award, BookOpen, FileText, CheckCircle2, User, Globe, Key, Loader2, RefreshCw } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/speech';
import api from '../utils/api';

const ProfilePage = () => {
  const { user, updateUserStats, updateLanguage } = useAuth();
  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    return user?.preferredLanguage || localStorage.getItem('user_language') || 'English';
  });
  const [langSaving, setLangSaving] = useState(false);
  const [langMsg, setLangMsg] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [classMsg, setClassMsg] = useState('');
  const [classMsgType, setClassMsgType] = useState(''); // 'success' or 'error'
  const [classLoading, setClassLoading] = useState(false);

  // Real Progress Data
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        const res = await api.get('/student/progress');
        setProgressData(res.data);
      } catch (err) {
        console.error('Fetch profile progress error:', err);
      } finally {
        setLoadingProgress(false);
      }
    };
    if (user?.role === 'student') {
      fetchProgress();
    } else {
      setLoadingProgress(false);
    }
  }, [user]);

  const handleLanguageSelect = async (langName) => {
    setPreferredLanguage(langName);
    localStorage.setItem('user_language', langName);
    setLangSaving(true);
    setLangMsg('');
    try {
      const result = await updateLanguage(langName);
      if (result.success) {
        setLangMsg('✅ Language saved successfully!');
      } else {
        setLangMsg('⚠️ Saved locally. Could not sync to server.');
      }
    } catch {
      setLangMsg('⚠️ Saved locally. Could not sync to server.');
    } finally {
      setLangSaving(false);
      setTimeout(() => setLangMsg(''), 3000);
    }
  };

  const streak = progressData?.streak ?? user?.streak ?? 0;
  const learningPoints = progressData?.learningPoints ?? user?.learningPoints ?? 0;
  const overallProgress = progressData?.overall ?? 0;
  const lessonsCompleted = progressData?.lessonsCompleted ?? 0;
  const assignmentsSubmitted = progressData?.assignmentsSubmitted ?? 0;
  const totalQuizzes = progressData?.totalQuizzesAttempted ?? 0;
  const badges = (progressData?.badges && progressData.badges.length > 0)
    ? progressData.badges
    : (user?.badges && user.badges.length > 0)
      ? user.badges
      : [
          { id: 'welcome', title: 'Welcome Learner', icon: '🌟' },
          { id: 'streak_1', title: 'Streak Starter', icon: '🔥' },
          { id: 'quiz_hero', title: 'Quiz Adventurer', icon: '🏆' }
        ];

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
          👤 Profile & Learning Badges
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Your personal learning account details, preferred language, streaks, points, and earned achievement badges.
        </p>
      </div>

      {/* Student Profile Card (PRD Section 5 & 29) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md space-y-6">
        
        {/* User Info Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-orange-100 pb-6 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name || 'Student'}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-orange/30 shadow-md"
          />

          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-2xl text-brand-text">{user?.name || 'Student'}</h2>
            <p className="text-xs font-bold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200 inline-block">
              {user?.className || 'Class 7A'} • {user?.role === 'teacher' ? 'Teacher Account' : `Student ID: ${user?.studentId || 'STU-7001'}`}
            </p>
            <p className="text-xs text-brand-muted mt-1">{user?.email || 'student@learnmate.edu'}</p>
          </div>
        </div>

        {/* 🌐 Preferred Learning Language Selector (Multilingual PRD Rule) */}
        <div className="bg-brand-orange-light/40 rounded-2xl p-5 border border-orange-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-orange" />
              <h3 className="font-display font-bold text-base text-brand-text">Preferred Learning Language</h3>
            </div>
            <div className="flex items-center gap-2">
              {langSaving && <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />}
              <span className="text-xs font-bold text-brand-orange bg-white px-3 py-1 rounded-full border border-orange-200 shadow-sm">
                Active: {preferredLanguage}
              </span>
            </div>
          </div>
          {langMsg && (
            <div className={`text-xs font-bold px-3 py-2 rounded-xl border ${langMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {langMsg}
            </div>
          )}
          <p className="text-xs text-brand-muted">
            Select your preferred language. AI explanations and content translations will automatically adapt to this language.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelect(lang.name)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border cursor-pointer ${
                  preferredLanguage === lang.name
                    ? 'bg-brand-orange text-white border-brand-orange shadow-sm scale-105'
                    : 'bg-white text-brand-text border-orange-100 hover:border-orange-300'
                }`}
              >
                <span>{lang.label}</span>
                {preferredLanguage === lang.name && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* 🔑 Change Class Code Section */}
        {user?.role !== 'teacher' && (
          <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-200 space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-purple" />
              <h3 className="font-display font-bold text-base text-brand-text">Change Class Code</h3>
            </div>
            <p className="text-xs text-brand-muted">
              Enter a new class code from your teacher to switch to a different class.
              Current class: <span className="font-bold text-brand-purple">{user?.className || 'Not set'}</span>
            </p>
            
            {classMsg && (
              <div className={`p-2.5 rounded-xl text-xs font-bold ${classMsgType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {classMsg}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newClassCode}
                onChange={(e) => setNewClassCode(e.target.value.toUpperCase())}
                placeholder="Enter new class code (e.g. ABC123)"
                className="flex-1 bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-text uppercase focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
              <button
                onClick={async () => {
                  if (!newClassCode.trim()) return;
                  setClassLoading(true);
                  setClassMsg('');
                  try {
                    const res = await api.post('/student/update-class', { classCode: newClassCode });
                    setClassMsg(res.data.message);
                    setClassMsgType('success');
                    updateUserStats({ className: res.data.className });
                    setNewClassCode('');
                  } catch (err) {
                    setClassMsg(err.response?.data?.message || 'Error updating class');
                    setClassMsgType('error');
                  } finally {
                    setClassLoading(false);
                  }
                }}
                disabled={classLoading || !newClassCode.trim()}
                className="px-5 py-2.5 bg-brand-purple text-white font-bold text-xs rounded-xl hover:bg-purple-600 disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {classLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>Update</span>
              </button>
            </div>
          </div>
        )}

        {/* Gamification Metric Cards */}
        {user?.role === 'student' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 🔥 Learning Streak */}
            <div className="bg-brand-orange-light/60 rounded-2xl p-5 border border-orange-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Learning Streak</span>
                <h4 className="font-display font-bold text-xl text-brand-text">🔥 {streak} Days</h4>
              </div>
            </div>

            {/* ⭐ Learning Points */}
            <div className="bg-brand-orange-light/60 rounded-2xl p-5 border border-orange-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Learning Points</span>
                <h4 className="font-display font-bold text-xl text-brand-text">⭐ {learningPoints} Pts</h4>
              </div>
            </div>

            {/* 📊 Overall Progress */}
            <div className="bg-brand-orange-light/60 rounded-2xl p-5 border border-orange-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-text text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Overall Progress</span>
                <h4 className="font-display font-bold text-xl text-brand-text">{overallProgress}% Avg</h4>
              </div>
            </div>

            {/* 📚 Lessons Completed */}
            <div className="bg-white rounded-2xl p-5 border border-orange-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Lessons Completed</span>
                <h4 className="font-display font-bold text-lg text-brand-text">{lessonsCompleted}</h4>
              </div>
            </div>

            {/* 📝 Assignments Submitted */}
            <div className="bg-white rounded-2xl p-5 border border-orange-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Assignments Submitted</span>
                <h4 className="font-display font-bold text-lg text-brand-text">{assignmentsSubmitted}</h4>
              </div>
            </div>

            {/* 📝 Quizzes Attempted */}
            <div className="bg-white rounded-2xl p-5 border border-orange-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple flex items-center justify-center shrink-0 font-bold">
                🏆
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">Quizzes Done</span>
                <h4 className="font-display font-bold text-lg text-brand-text">{totalQuizzes}</h4>
              </div>
            </div>

          </div>
        )}

        {/* 🏆 Achievements / Badges Grid (PRD Section 5) */}
        <div className="space-y-3 pt-2">
          <h3 className="font-display font-bold text-lg text-brand-text flex items-center gap-2">
            🏆 Achievements & Badges
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {badges.map((b, idx) => (
              <div key={b.id || idx} className="p-4 rounded-2xl bg-brand-orange-light/40 border border-orange-200 flex items-center gap-3">
                <span className="text-3xl">{b.icon || '🏅'}</span>
                <div>
                  <h4 className="font-bold text-xs text-brand-text">{b.title}</h4>
                  <span className="text-[10px] text-brand-orange font-bold">Unlocked ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
