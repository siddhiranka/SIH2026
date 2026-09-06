
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle, Play, FileText, Sparkles, HelpCircle, Trophy, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const MyLearningPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, lesRes, quizRes] = await Promise.all([
          api.get('/student/subjects').catch(err => { console.error('Subjects fetch error:', err); return { data: [] }; }),
          api.get('/student/lessons').catch(err => { console.error('Lessons fetch error:', err); return { data: [] }; }),
          api.get('/student/quizzes').catch(err => { console.error('Quizzes fetch error:', err); return { data: [] }; })
        ]);
        setSubjects(subRes.data || []);
        setLessons(lesRes.data || []);
        setQuizzes(quizRes.data || []);
      } catch (err) {
        console.error('Fetch learning data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultSubjects = [
    { _id: 'sub-1', name: 'Mathematics', code: 'MATH-7', icon: '📐', color: '#6C4DF6', description: 'Explore numbers, fractions, algebra, and geometry through clear visual steps.' },
    { _id: 'sub-2', name: 'Science', code: 'SCI-7', icon: '🔬', color: '#4DB8FF', description: 'Discover living organisms, plants, energy, and physical phenomena.' },
    { _id: 'sub-3', name: 'English', code: 'ENG-7', icon: '📖', color: '#FFD84D', description: 'Improve reading comprehension, creative writing, and grammar.' },
    { _id: 'sub-4', name: 'Social Science', code: 'SOC-7', icon: '🌍', color: '#5BCB93', description: 'Understand geography, history, and civics in an engaging story format.' }
  ];

  const displaySubjects = subjects.length > 0 ? subjects : defaultSubjects;

  const filteredLessons = lessons.filter(l => !selectedSubject || l.subjectName === selectedSubject);
  const filteredQuizzes = quizzes.filter(q => !selectedSubject || q.subject === selectedSubject);

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
          📚 My Learning & Subjects
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a subject to explore teacher-published lessons, notes, and attend interactive quizzes.
        </p>
      </div>

      {/* Empty-state notice: no content for this class */}
      {!loading && lessons.length === 0 && quizzes.length === 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800">No content found for your class.</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Your teacher may not have published anything yet, <strong>or you may be in the wrong class</strong>.
              Go to your <button onClick={() => navigate('/dashboard')} className="underline font-bold hover:text-amber-900">Dashboard</button> and enter your teacher's class code to join the correct class.
            </p>
          </div>
        </div>
      )}

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displaySubjects.map((sub) => (
          <div
            key={sub._id}
            onClick={() => setSelectedSubject(sub.name === selectedSubject ? null : sub.name)}
            className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer shadow-md hover:shadow-lg flex flex-col justify-between ${
              selectedSubject === sub.name ? 'border-brand-purple ring-2 ring-purple-100' : 'border-gray-100 hover:border-purple-200'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm" style={{ backgroundColor: `${sub.color}20` }}>
                {sub.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-brand-text">{sub.name}</h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white inline-block mt-1 mb-2" style={{ backgroundColor: sub.color }}>
                {sub.code || 'Grade 7'}
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">{sub.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-purple">
              <span>{selectedSubject === sub.name ? 'Clear Filter' : 'View Content & Quizzes'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content & Quizzes Section */}
      <div className="space-y-6">
        
        {/* Quizzes List (Visually Distinguishable) */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-xl text-brand-text flex items-center gap-2">
              📝 Interactive Quizzes {selectedSubject ? `for ${selectedSubject}` : ''}
            </h3>
            <span className="text-xs font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {filteredQuizzes.length} Available
            </span>
          </div>

          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400 font-medium">
              No quizzes published yet for this class/subject.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                  className="p-5 rounded-2xl bg-purple-50/40 hover:bg-purple-50 border-2 border-purple-200 hover:border-brand-purple transition-all cursor-pointer flex flex-col justify-between gap-3 group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        📝
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                          {quiz.subject}
                        </span>
                        <h4 className="font-display font-bold text-base text-brand-text group-hover:text-brand-purple transition-colors mt-0.5">
                          {quiz.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-purple bg-white px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                      {quiz.totalMarks} Marks
                    </span>
                  </div>

                  {quiz.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{quiz.description}</p>
                  )}

                  <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-500 font-medium">
                      ⏱️ {quiz.timeLimitMinutes || 15} mins • {quiz.questions?.length || 0} Questions
                    </span>
                    {quiz.latestAttempt ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        Score: {quiz.latestAttempt.score}/{quiz.latestAttempt.totalMarks} ({quiz.latestAttempt.percentage}%)
                      </span>
                    ) : (
                      <button className="px-3.5 py-1.5 bg-brand-purple text-white rounded-xl shadow-sm group-hover:scale-105 transition-all text-xs font-bold">
                        Attend Quiz 🚀
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regular Lessons / Notes */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
          <h3 className="font-display font-bold text-xl text-brand-text mb-4 flex items-center gap-2">
            📖 Lessons & Learning Materials {selectedSubject ? `for ${selectedSubject}` : ''}
          </h3>

          {filteredLessons.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-medium">
              No lessons published yet for this class/subject.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  onClick={() => navigate(`/lesson/${lesson._id}`)}
                  className="p-5 rounded-2xl bg-brand-bg hover:bg-purple-50/50 border border-gray-100 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                      {lesson.contentType === 'file' ? '📄' : lesson.contentType === 'link' ? '🎥' : '📖'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand-purple bg-purple-100 px-2 py-0.5 rounded-md">
                          {lesson.subjectName}
                        </span>
                        {lesson.contentType && (
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                            {lesson.contentType}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-base text-brand-text mt-1 group-hover:text-brand-purple transition-colors">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{lesson.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> View Lesson
                    </span>
                    <button className="px-4 py-2 bg-brand-purple text-white font-bold text-xs rounded-xl shadow-sm group-hover:scale-105 transition-all">
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default MyLearningPage;
