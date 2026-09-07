
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Sparkles, Award, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);

  // Quiz state
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/quizzes/${id}`);
        let quizData = res.data;

        // Translate questions/options if student has a non-English preference
        const lang = user?.preferredLanguage || localStorage.getItem('user_language') || 'English';
        if (lang && lang !== 'English' && quizData.questions?.length > 0) {
          setTranslating(true);
          try {
            const translated = await Promise.all(
              quizData.questions.map(async (q) => {
                // Translate questionText + options as one string for efficiency
                const combined = q.questionText + '\n|||OPTIONS|||' + q.options.join('\n');
                const tRes = await api.post('/ai/translate', {
                  content: combined,
                  targetLanguage: lang
                });
                const translatedText = tRes.data.translatedContent || combined;
                const [tQuestion, optionsPart] = translatedText.split('|||OPTIONS|||');
                const tOptions = optionsPart
                  ? optionsPart.trim().split('\n').filter(Boolean)
                  : q.options;
                return {
                  ...q,
                  questionText: tQuestion?.trim() || q.questionText,
                  options: tOptions.length === q.options.length ? tOptions : q.options
                };
              })
            );
            quizData = { ...quizData, questions: translated };
          } catch (tErr) {
            console.warn('Quiz translation failed, showing original:', tErr);
          } finally {
            setTranslating(false);
          }
        }

        setQuiz(quizData);
      } catch (err) {
        console.error('Fetch quiz error:', err);
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, user?.preferredLanguage]);


  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you ready to submit your quiz?')) return;
    setSubmitting(true);
    try {
      const answersPayload = quiz.questions.map((q, idx) => ({
        questionIndex: idx,
        selectedOptionIndex: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
      }));

      const res = await api.post(`/student/quizzes/${id}/attempt`, {
        answers: answersPayload
      });

      setResult(res.data.attempt);
    } catch (err) {
      console.error('Submit quiz error:', err);
      alert('Error submitting quiz: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || translating) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-brand-purple animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-400">
            {translating ? 'Translating quiz to your language...' : 'Loading quiz...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl border border-red-100 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="font-bold text-lg text-gray-800">Unable to load quiz</h3>
        <p className="text-xs text-gray-500">{error || 'Quiz not found.'}</p>
        <button
          onClick={() => navigate('/my-learning')}
          className="px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold"
        >
          Back to My Learning
        </button>
      </div>
    );
  }

  // If quiz was already completed previously (1-attempt rule)
  if (quiz?.alreadyAttempted && !result) {
    const prev = quiz.previousAttempt;
    return (
      <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-3xl border border-orange-100 shadow-xl text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-orange-100 text-brand-orange mx-auto flex items-center justify-center text-4xl shadow-sm">
          🏆
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Quiz Already Completed (1 Attempt Allowed)
          </span>
          <h2 className="font-display font-bold text-2xl text-brand-text mt-3">
            {quiz.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Submitted on {prev?.submittedAt ? new Date(prev.submittedAt).toLocaleDateString('en-IN') : 'Recently'}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Score</div>
          <div className="font-display font-black text-5xl text-brand-orange">
            {prev?.score ?? 0} <span className="text-2xl text-gray-400 font-bold">/ {prev?.totalMarks ?? quiz.totalMarks}</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-600">
            {prev?.percentage ?? 0}% Accuracy
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/my-learning')}
            className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Back to My Learning
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-all"
          >
            View Progress History
          </button>
        </div>
      </div>
    );
  }

  // Result View (Just submitted)
  if (result) {
    return (
      <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-3xl border border-orange-100 shadow-xl text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-sm">
          🎉
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Quiz Completed!
          </span>
          <h2 className="font-display font-bold text-2xl text-brand-text mt-2">
            {quiz.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Attempt #1 (Final Submission)
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Score</div>
          <div className="font-display font-black text-5xl text-brand-orange">
            {result.score} <span className="text-2xl text-gray-400 font-bold">/ {result.totalMarks}</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-600">
            {result.percentage}% Accuracy
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/my-learning')}
            className="px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-all"
          >
            Back to My Learning
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-all"
          >
            View Progress History
          </button>
        </div>
      </div>
    );
  }

  // Start Screen
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-3xl border border-orange-100 shadow-xl space-y-6 animate-in fade-in">
        <button
          onClick={() => navigate('/my-learning')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Learning
        </button>

        <div className="space-y-2">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-orange-100 text-brand-orange uppercase">
            {quiz.subject}
          </span>
          <h1 className="font-display font-bold text-3xl text-brand-text">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-xs text-gray-600 leading-relaxed">{quiz.description}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-orange-100">
          <div className="text-center p-3 rounded-2xl bg-brand-orange-light/50">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Questions</div>
            <div className="font-display font-bold text-xl text-brand-orange mt-0.5">
              {quiz.questions.length}
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-brand-orange-light/50">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Total Marks</div>
            <div className="font-display font-bold text-xl text-brand-orange mt-0.5">
              {quiz.totalMarks}
            </div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-brand-orange-light/50">
            <div className="text-[10px] font-bold text-gray-400 uppercase">Time Limit</div>
            <div className="font-display font-bold text-xl text-brand-orange mt-0.5">
              {quiz.timeLimitMinutes || 15}m
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-1">
          <div className="font-bold">Instructions:</div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>Select the best answer for each multiple choice question.</li>
            <li>You can navigate between questions before submitting.</li>
            <li><strong>Note:</strong> You can attempt this quiz only 1 time.</li>
            <li>Click "Submit Quiz" on the final question to record your final score.</li>
          </ul>
        </div>

        <button
          onClick={() => setHasStarted(true)}
          className="w-full py-4 bg-[#F47C20] hover:bg-[#e06910] text-white font-bold text-sm rounded-2xl shadow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Start Quiz Now</span>
          <Sparkles className="w-4 h-4 fill-white" />
        </button>
      </div>
    );
  }

  // Active Quiz View
  const currentQ = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const currentSelected = selectedAnswers[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-3xl border border-orange-100 shadow-xl space-y-6 animate-in fade-in">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-orange-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase text-brand-orange bg-orange-100 px-2 py-0.5 rounded">
            {quiz.subject}
          </span>
          <h2 className="font-display font-bold text-base text-brand-text mt-1">{quiz.title}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-extrabold text-brand-orange">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <div className="text-[11px] text-gray-400 font-semibold">{currentQ.marks || 1} Mark(s)</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-brand-orange h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="space-y-4 pt-2">
        <h3 className="font-display font-bold text-lg text-brand-text leading-relaxed">
          {currentQuestionIndex + 1}. {currentQ.questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, oIdx) => {
            const isSelected = currentSelected === oIdx;
            return (
              <div
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#F47C20] bg-orange-50/90 shadow-md ring-1 ring-orange-300'
                    : 'border-gray-100 hover:border-orange-300 bg-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                  isSelected
                    ? 'border-[#F47C20] bg-[#F47C20] text-white shadow-sm'
                    : 'border-gray-300 text-gray-500 bg-gray-50'
                }`}>
                  {String.fromCharCode(65 + oIdx)}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-brand-orange font-bold' : 'text-brand-text'}`}>
                  {opt}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-orange-100 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all cursor-pointer"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz ✓'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#F47C20] hover:bg-[#e06910] text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1"
          >
            Next Question →
          </button>
        )}
      </div>

    </div>
  );
};

export default QuizPage;
