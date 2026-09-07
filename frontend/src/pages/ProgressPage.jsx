import React, { useState, useEffect } from 'react';
import { Award, Flame, Sparkles, CheckCircle2, BookOpen, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProgressPage = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/student/progress');
        setProgressData(res.data);
      } catch (err) {
        console.error('Fetch progress error:', err);
        setError(err.response?.data?.message || 'Failed to load progress.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading your progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto my-12 p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  // Empty state — no activity yet
  if (progressData?.noDataYet) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto w-full">
        <div>
          <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
            📊 My Learning Progress
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your overall performance, completed lessons, quiz scores, and earned achievement badges.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center text-4xl">
            🎓
          </div>
          <h2 className="font-display font-bold text-xl text-brand-text">No progress yet</h2>
          <p className="text-sm text-gray-500 max-w-md">
            Complete your first lesson or quiz to start tracking your progress. Your scores, badges, and subject performance will appear here.
          </p>
        </div>
      </div>
    );
  }

  const overall = progressData?.overall ?? 0;
  const lessonsCompleted = progressData?.lessonsCompleted ?? 0;
  const assignmentsSubmitted = progressData?.assignmentsSubmitted ?? 0;
  const quizAverage = progressData?.quizAverage ?? 0;
  const learningPoints = progressData?.learningPoints ?? user?.learningPoints ?? 0;
  const streak = progressData?.streak ?? user?.streak ?? 0;
  const subjects = progressData?.subjects ?? [];
  const badges = progressData?.badges ?? [];
  const recentAttempts = progressData?.recentQuizAttempts ?? [];

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
          📊 My Learning Progress
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your overall performance, completed lessons, quiz scores, and earned achievement badges.
        </p>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-brand-purple rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">
            {overall}%
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Overall Progress</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{overall}% Avg Score</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Learning Points</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{learningPoints} ⭐</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <Flame className="w-7 h-7 fill-orange-500" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Learning Streak</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{streak} Days 🔥</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Quizzes Done</span>
            <h3 className="font-display font-bold text-xl text-brand-text">{progressData?.totalQuizzesAttempted ?? 0}</h3>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Lessons Completed</span>
          <span className="font-display font-bold text-2xl text-brand-text">{lessonsCompleted}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Assignments Submitted</span>
          <span className="font-display font-bold text-2xl text-brand-text">{assignmentsSubmitted}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Average Quiz Score</span>
          <span className="font-display font-bold text-2xl text-brand-text">{quizAverage}%</span>
        </div>
      </div>

      {/* Subject Mastery & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Subject Scores */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text">Subject Mastery</h3>
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-medium">
              Take quizzes to see your subject scores here.
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map(sub => (
                <div key={sub.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-brand-text">
                    <span>{sub.name}</span>
                    <span>{sub.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-brand-purple h-3 rounded-full transition-all duration-500"
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-rose-500 font-semibold block">
                    {sub.weakArea}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text">🏆 Earned Badges</h3>
          {badges.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-medium">
              Complete lessons and quizzes to earn badges!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {badges.map(b => (
                <div key={b.id || b.title} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
                  <span className="text-3xl">{b.icon || '🏅'}</span>
                  <div>
                    <h4 className="font-bold text-xs text-brand-text">{b.title}</h4>
                    <span className="text-[10px] text-brand-purple font-semibold">Unlocked 🎉</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Quiz Attempts */}
      {recentAttempts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text">📋 Recent Quiz Attempts</h3>
          <div className="border border-purple-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/50 text-gray-500 font-bold border-b border-purple-100">
                <tr>
                  <th className="p-3.5">Quiz</th>
                  <th className="p-3.5">Attempt #</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium text-brand-text">
                {recentAttempts.map((att, idx) => (
                  <tr key={idx} className="hover:bg-purple-50/20 transition-colors">
                    <td className="p-3.5 font-bold">{att.quizTitle || 'Quiz'}</td>
                    <td className="p-3.5">#{att.attemptNumber || idx + 1}</td>
                    <td className="p-3.5 font-extrabold text-brand-purple">{att.score} / {att.totalMarks}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        att.percentage >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgressPage;
