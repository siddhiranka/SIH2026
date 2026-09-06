import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Award, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const QuizWidget = ({ questions = [], lessonId, onComplete }) => {
  const { updateUserStats } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 text-center text-gray-500">
        <HelpCircle className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="font-bold text-sm">No quiz questions generated for this lesson yet.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelect = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Award points via API call
      try {
        if (lessonId) {
          const res = await api.post(`/student/lessons/${lessonId}/complete`);
          if (res.data.learningPoints) {
            updateUserStats({ learningPoints: res.data.learningPoints, badges: res.data.badges });
          }
        }
      } catch (err) {
        console.error('Complete lesson error:', err);
      }

      if (onComplete) onComplete(score);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
      {!quizFinished ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <span className="text-xs font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-full">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs font-bold text-gray-400">
              Score: {score}
            </span>
          </div>

          {/* Question Title */}
          <h3 className="font-display font-bold text-lg text-brand-text mb-4">
            {currentQ.question}
          </h3>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              let optionStyle = "border-gray-200 hover:border-brand-purple hover:bg-purple-50/50";
              if (selectedOption === idx) {
                optionStyle = "border-brand-purple bg-purple-50 text-brand-purple font-bold";
              }
              if (isSubmitted) {
                if (idx === currentQ.correctAnswerIndex) {
                  optionStyle = "border-brand-green bg-green-50 text-emerald-700 font-bold";
                } else if (selectedOption === idx) {
                  optionStyle = "border-rose-300 bg-rose-50 text-rose-700 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && idx === currentQ.correctAnswerIndex && (
                    <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0" />
                  )}
                  {isSubmitted && selectedOption === idx && idx !== currentQ.correctAnswerIndex && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isSubmitted && currentQ.explanation && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6 animate-in fade-in">
              <strong className="block mb-1 font-bold">💡 Explanation:</strong>
              {currentQ.explanation}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-2xl bg-brand-purple text-white font-bold text-sm shadow-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl bg-brand-green text-white font-bold text-sm shadow-md hover:bg-emerald-600 transition-colors"
              >
                {currentIndex + 1 < questions.length ? 'Next Question ➔' : 'Complete Quiz 🎉'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-2xl text-brand-text mb-1">
            Great Job! 🎉
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            You scored {score} out of {questions.length} questions correctly!
          </p>
          <div className="inline-flex items-center gap-2 bg-brand-yellow/20 text-amber-800 font-bold px-4 py-2 rounded-full text-xs mb-6">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>+15 Learning Points Earned!</span>
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-purple text-white font-bold rounded-2xl shadow-md hover:bg-purple-600 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizWidget;
