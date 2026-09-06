import React, { useState } from 'react';
import { Bot, Sparkles, Mic, Send, Edit3, Save, CheckCircle2, Loader2, FileText, Check } from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';
import api from '../utils/api';

const TeacherAIPage = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Quiz Generation & Edit State (PRD Section 27)
  const [quizTopic, setQuizTopic] = useState('Fractions');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizSavedMessage, setQuizSavedMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAskAssistant = async (customQuery) => {
    const text = customQuery || query;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/ai/teacher-assistant', {
        question: text,
        classContext: 'Class 7A Mathematics & Science'
      });
      setAiResponse(res.data.response || 'Here is the strategy for your request!');
    } catch (err) {
      console.error('Teacher AI error:', err);
      setAiResponse('Sorry, an error occurred processing your AI request.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;
    setIsGeneratingQuiz(true);
    setQuizSavedMessage('');

    try {
      const res = await api.post('/ai/generate-quiz', {
        topic: quizTopic,
        subject: 'Mathematics',
        count: 5
      });
      setQuizQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Generate quiz error:', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      await api.post('/teacher/content/lesson', {
        subjectName: 'Mathematics',
        chapterNumber: 3,
        chapterTitle: `Revision: ${quizTopic}`,
        title: `Quiz: ${quizTopic}`,
        summary: `5-Question Revision Quiz on ${quizTopic}`,
        content: `Complete this teacher-reviewed quiz on ${quizTopic}.`,
        quiz: quizQuestions
      });
      setQuizSavedMessage(`✓ Assigned Quiz on "${quizTopic}" to Class 7A!`);
    } catch (err) {
      console.error('Save quiz error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-brand-text flex items-center gap-2">
          🤖 AI Teacher Assistant
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Tell the AI assistant what you want to create or ask for class insights. Review before publishing!
        </p>
      </div>

      {/* Grid: Assistant Query + Content Generator (PRD Section 27) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Teacher Assistant Chat Box */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <h3 className="font-display font-bold text-lg text-brand-text flex items-center gap-2">
                <Bot className="w-5 h-5 text-brand-orange" />
                Assistant Query
              </h3>
              <VoiceMicButton onTranscript={(txt) => handleAskAssistant(txt)} />
            </div>

            {/* Prompt Examples (PRD Section 27) */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Example Requests:</span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleAskAssistant('Create a 5-question quiz on fractions for Class 7.')}
                  className="text-left px-3.5 py-2 bg-brand-orange-light text-brand-orange font-bold text-xs rounded-xl hover:bg-orange-100 border border-orange-200 transition-colors"
                >
                  • Create a 5-question quiz on fractions for Class 7.
                </button>

                <button
                  type="button"
                  onClick={() => handleAskAssistant('Explain fractions in simpler language for Class 7.')}
                  className="text-left px-3.5 py-2 bg-brand-orange-light text-brand-orange font-bold text-xs rounded-xl hover:bg-orange-100 border border-orange-200 transition-colors"
                >
                  • Explain this topic in simpler language.
                </button>

                <button
                  type="button"
                  onClick={() => handleAskAssistant('Give me revision questions for fractions.')}
                  className="text-left px-3.5 py-2 bg-brand-orange-light text-brand-orange font-bold text-xs rounded-xl hover:bg-orange-100 border border-orange-200 transition-colors"
                >
                  • Give me revision questions.
                </button>

                <button
                  type="button"
                  onClick={() => handleAskAssistant('Summarize my class performance.')}
                  className="text-left px-3.5 py-2 bg-brand-orange-light text-brand-orange font-bold text-xs rounded-xl hover:bg-orange-100 border border-orange-200 transition-colors"
                >
                  • Summarize my class performance.
                </button>
              </div>
            </div>

            {loading && (
              <div className="my-6 p-4 rounded-2xl bg-brand-orange-light flex items-center gap-2 text-xs font-bold text-brand-orange">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating educational content...</span>
              </div>
            )}

            {aiResponse && !loading && (
              <div className="mt-4 p-4 rounded-2xl bg-white border border-orange-200 text-xs text-brand-text leading-relaxed whitespace-pre-line font-medium shadow-sm">
                {aiResponse}
              </div>
            )}
          </div>

          {/* Contextual Input with Mic (PRD Section 15 & 27) */}
          <form onSubmit={(e) => { e.preventDefault(); handleAskAssistant(); }} className="mt-4 pt-3 border-t border-orange-100 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your request... 🎤"
              className="flex-1 bg-brand-orange-light/50 border border-orange-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-brand-orange text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-orange-600 shrink-0"
            >
              Send Request
            </button>
          </form>
        </div>

        {/* 1-Click Quiz & Content Reviewer (PRD Section 27) */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-md space-y-4">
          <h3 className="font-display font-bold text-lg text-brand-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 fill-brand-orange text-brand-orange" />
            Educational Quiz Generator
          </h3>

          <p className="text-xs text-brand-muted">
            Enter a topic. The AI will generate a 5-question quiz. Review and edit before assigning!
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={quizTopic}
              onChange={(e) => setQuizTopic(e.target.value)}
              placeholder="e.g. Fractions, Decimals..."
              className="flex-1 bg-brand-orange-light/50 border border-orange-200 rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none"
            />
            <button
              onClick={handleGenerateQuiz}
              disabled={isGeneratingQuiz}
              className="px-5 py-2.5 bg-brand-orange text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-orange-600 shrink-0 flex items-center gap-1.5"
            >
              {isGeneratingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Quiz</span>
            </button>
          </div>

          {quizSavedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold text-xs">
              {quizSavedMessage}
            </div>
          )}

          {quizQuestions.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-orange">
                  Generated {quizQuestions.length} Questions:
                </span>

                {/* Review Actions: [ Edit ] [ Save ] [ Assign to Class ] (PRD Section 27) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveQuiz}
                    className="px-3 py-1.5 bg-brand-orange text-white font-bold text-[11px] rounded-xl shadow-sm flex items-center gap-1 hover:bg-orange-600 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Assign to Class</span>
                  </button>
                </div>
              </div>

              {quizQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-brand-orange-light/40 border border-orange-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-brand-text">{idx + 1}. {q.question}</p>
                    <button 
                      onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                      className="text-brand-orange font-bold hover:underline flex items-center gap-1 text-[10px]"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-brand-muted">
                    {q.options?.map((opt, oIdx) => (
                      <span key={oIdx} className={oIdx === q.correctAnswerIndex ? 'text-emerald-700 font-bold' : ''}>
                        • {opt} {oIdx === q.correctAnswerIndex ? '✓' : ''}
                      </span>
                    ))}
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

export default TeacherAIPage;
