import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Bot, Mic, Play, Sparkles, BookOpen , Loader2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/speech';
import QuizWidget from '../components/QuizWidget';
import VoiceMicButton from '../components/VoiceMicButton';
import AITutorModal from '../components/AITutorModal';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LessonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUserStats } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [activeLang, setActiveLang] = useState(user?.preferredLanguage || 'English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState(null);
  const [translatedContent, setTranslatedContent] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/student/lessons/${id}`);
        setLesson(res.data);
        if (user?.preferredLanguage && user.preferredLanguage !== 'English') {
          try {
            const tRes = await api.post('/ai/translate', { content: res.data.content, targetLanguage: user.preferredLanguage });
            setTranslatedContent(tRes.data.translatedContent);
          } catch (e) {}
        }
      } catch (err) {
        console.error('Fetch lesson detail error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleMarkComplete = async () => {
    try {
      const res = await api.post(`/student/lessons/${id}/complete`);
      setIsCompleted(true);
      setCompletionMessage(res.data.message || 'Lesson completed! +15 Learning Points earned 🎉');
      if (res.data.learningPoints) {
        updateUserStats({ learningPoints: res.data.learningPoints, badges: res.data.badges });
      }
    } catch (err) {
      console.error('Mark complete error:', err);
    }
  };

  const sampleLesson = lesson || {
    _id: id,
    subjectName: 'Mathematics',
    chapterNumber: 3,
    chapterTitle: 'Fractions',
    title: 'Understanding Numerators & Denominators',
    summary: 'Learn how fractions represent parts of a whole shape or number.',
    content: `A fraction represents a part of a whole. When we divide a whole item like a pizza into 4 equal slices, 1 slice is 1/4 of the pizza!

### Key Concept:
Fractions represent parts of a whole.

• **Numerator (Top Number)**: Shows how many parts are taken.
• **Denominator (Bottom Number)**: Shows total equal parts in the whole.`,
    keyConcepts: [
      'Fractions represent equal parts of a whole.',
      'The Numerator is the top number; the Denominator is the bottom number.',
      'Equivalent fractions have equal total value.'
    ],
    videoUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw',
    quiz: [
      {
        question: 'In the fraction 3/8, which number is the numerator?',
        options: ['3', '8', '11', '5'],
        correctAnswerIndex: 0,
        explanation: '3 is the top number, which is called the numerator!'
      }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      
      {/* Back Button (PRD Section 19) */}
      <button
        onClick={() => navigate('/my-learning')}
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-orange bg-white px-4 py-2 rounded-2xl border border-orange-100 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Back</span>
      </button>

      {/* Header (PRD Section 19) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md">
        <span className="text-xs font-extrabold text-brand-orange bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200">
          {sampleLesson.subjectName}
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-text mt-3">
          {sampleLesson.chapterTitle}: {sampleLesson.title}
        </h1>
        <p className="text-xs text-brand-muted mt-1">{sampleLesson.summary}</p>
      </div>

      {/* Lesson Explanation Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-orange-100 pb-3">
          <h3 className="font-display font-bold text-lg text-brand-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-orange" />
            Lesson Explanation
          </h3>
          <VoiceMicButton textToRead={translatedContent || sampleLesson.content} />
        </div>

        <div className="prose text-sm text-brand-text leading-relaxed whitespace-pre-line font-medium">
            {isTranslating ? (
              <div className="flex items-center gap-2 text-brand-orange animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Translating content...
              </div>
            ) : (
              translatedContent || (lesson?.content) || sampleLesson.content
            )}
          </div>

        {/* Video / Illustration Embed (PRD Section 19) */}
        {sampleLesson.videoUrl && (
          <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-orange-100">
            <iframe
              src={sampleLesson.videoUrl}
              title="Lesson Video"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        )}

        {/* Key Concept Box (PRD Section 19) */}
        <div className="bg-brand-orange-light rounded-2xl p-5 border border-orange-200 space-y-2">
          <h4 className="font-display font-bold text-base text-brand-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-orange fill-brand-orange" />
            Key Concept
          </h4>
          <p className="text-xs text-brand-text font-bold leading-relaxed">
            Fractions represent parts of a whole.
          </p>
          <ul className="space-y-1.5 pt-1">
            {sampleLesson.keyConcepts.map((kc, idx) => (
              <li key={idx} className="text-xs text-brand-muted font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                <span>{kc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Lesson Quiz */}
      <QuizWidget questions={sampleLesson.quiz} lessonId={sampleLesson._id} />

      {/* Action Footer Bar with Contextual Mic Ask AI & Mark as Complete (PRD Section 15 & 19) */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Contextual Ask AI Button (PRD Section 15 & 19) */}
        <button
          onClick={() => setIsAIOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-brand-orange-light hover:bg-orange-100 text-brand-orange border border-orange-300 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Mic className="w-4 h-4" />
          <span>🎤 Ask AI</span>
        </button>

        {/* Mark as Complete Button (PRD Section 19) */}
        {isCompleted ? (
          <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            {completionMessage || '✓ Lesson Complete!'}
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="w-full sm:w-auto px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Complete</span>
          </button>
        )}

      </div>

      {/* Embedded AI Tutor Modal */}
      <AITutorModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        subject={sampleLesson.subjectName}
        lessonContext={`${sampleLesson.chapterTitle}: ${sampleLesson.title}`}
      />

    </div>
  );
};

export default LessonDetailPage;
