import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2, Globe } from 'lucide-react';
import VoiceMicButton from './VoiceMicButton';
import api from '../utils/api';
import { SUPPORTED_LANGUAGES } from '../utils/speech';

const AITutorModal = ({ isOpen, onClose, subject = "Mathematics", lessonContext = "" }) => {
  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    return localStorage.getItem('user_language') || 'English';
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hi Rahul! 👋 I'm your LearnMate AI Tutor. What would you like help with in ${subject} today? Ask me any question in your preferred language!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setPreferredLanguage(newLang);
    localStorage.setItem('user_language', newLang);
  };

  const handleSend = async (questionText) => {
    const query = questionText || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInputText('');
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        question: query,
        subject,
        grade: '7',
        lessonContext,
        preferredLanguage
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data.answer || "Here is a hint to help you think through this concept!"
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Ask error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Oops! Something went wrong getting your AI answer. Let me try again!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 border border-orange-100">
        
        {/* Header (PRD Section 16 & Multilingual UI) */}
        <div className="bg-brand-orange p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                🤖 AI Tutor <Sparkles className="w-4 h-4 fill-white text-white" />
              </h3>
              <p className="text-xs text-orange-100 font-medium">Subject: {subject} • Learning Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-white border border-white/30">
              <Globe className="w-3.5 h-3.5" />
              <select
                value={preferredLanguage}
                onChange={handleLanguageChange}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.name} className="text-gray-900 bg-white">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Area (PRD Section 16 & 17) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-orange-light/30">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                msg.sender === 'user' ? 'bg-brand-orange' : 'bg-brand-text'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-brand-orange text-white rounded-tr-none'
                  : 'bg-white text-brand-text rounded-tl-none border border-orange-100'
              }`}>
                <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-2 border-t border-orange-100 flex items-center justify-between">
                    <VoiceMicButton textToRead={msg.text} languageName={preferredLanguage} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[80%] items-center">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-bold text-brand-muted border border-orange-100">
                <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                <span>Thinking about a hint in {preferredLanguage}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar with Contextual Microphone (PRD Section 15 & 16) */}
        <div className="p-4 bg-white border-t border-orange-100 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <VoiceMicButton onTranscript={(text) => handleSend(text)} languageName={preferredLanguage} />
            <span className="text-[11px] text-brand-muted font-semibold">Language: {preferredLanguage}</span>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask a question in ${preferredLanguage}...`}
              className="flex-1 bg-brand-orange-light/50 border border-orange-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 text-brand-text font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="w-11 h-11 bg-brand-orange text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-md shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AITutorModal;
