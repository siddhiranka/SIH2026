import React, { useState, useEffect } from 'react';
import { Award, Flame, Sparkles, CheckCircle2, BarChart2, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProgressPage = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/student/progress');
        setProgressData(res.data);
      } catch (err) {
        console.error('Fetch progress error:', err);
      }
    };
    fetchProgress();
  }, []);

  const data = progressData || {
    overall: 78,
    lessonsCompleted: '24 / 30',
    assignmentsSubmitted: '15 / 18',
    quizAverage: '82%',
    learningPoints: user?.learningPoints || 180,
    streak: user?.streak || 5,
    badges: user?.badges || [
      { id: 'first_lesson', title: 'First Lesson Complete', icon: '🌟' },
      { id: 'streak_master', title: '5-Day Streak', icon: '🔥' },
      { id: 'quiz_whiz', title: 'Quiz Whiz', icon: '🏆' }
    ],
    subjects: [
      { name: 'Mathematics', score: 70, weakArea: 'Fractions' },
      { name: 'Science', score: 85, weakArea: 'Chemical Reactions' },
      { name: 'English', score: 90, weakArea: 'Grammar tenses' },
      { name: 'Social Science', score: 68, weakArea: 'Map reading' }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
          📊 My Learning Progress
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your overall performance, completed lessons, and earned achievement badges.
        </p>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-brand-purple rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">
            {data.overall}%
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Overall Progress</span>
            <h3 className="font-display font-bold text-xl text-brand-text">78% Mastery</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Learning Points</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{data.learningPoints} ⭐</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <Flame className="w-7 h-7 fill-orange-500" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Learning Streak</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{data.streak} Days 🔥</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Lessons Done</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{data.lessonsCompleted}</h3>
          </div>
        </div>

      </div>

      {/* Subject Mastery & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject Scores */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text">Subject Mastery</h3>
          <div className="space-y-4">
            {data.subjects.map(sub => (
              <div key={sub.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-brand-text">
                  <span>{sub.name}</span>
                  <span>{sub.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-brand-purple h-3 rounded-full" style={{ width: `${sub.score}%` }} />
                </div>
                <span className="text-[10px] text-rose-500 font-semibold block">
                  Weak area: {sub.weakArea}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Badges (PRD Section 34) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text">🏆 Earned Badges</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.badges.map(b => (
              <div key={b.id} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-brand-text">{b.title}</h4>
                  <span className="text-[10px] text-brand-purple font-semibold">Unlocked ✅</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProgressPage;
