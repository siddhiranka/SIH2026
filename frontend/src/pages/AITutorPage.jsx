import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Loader2, Globe } from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';
import api from '../utils/api';
import { SUPPORTED_LANGUAGES } from '../utils/speech';
import { useAuth } from '../context/AuthContext';

const AITutorPage = () => {
  const { user, updateLanguage } = useAuth();
  const [subject, setSubject] = useState('Mathematics');
  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    // Use the MongoDB-persisted language from user context, fall back to localStorage
    return user?.preferredLanguage || localStorage.getItem('user_language') || 'English';
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! 👋 I'm your LearnMate AI Tutor. I help you understand any concept step-by-step with simple examples and hints. Ask me anything in your preferred language!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setPreferredLanguage(newLang);
    localStorage.setItem('user_language', newLang);
    // Also persist to MongoDB via AuthContext
    if (updateLanguage) await updateLanguage(newLang).catch(() => {});
  };

  const handleSend = async (customText) => {
    const query = customText || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        question: query,
        subject,
        grade: '7',
        preferredLanguage
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data.answer || "Here is a hint to help you think through this concept!"
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI ask error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Oops! I ran into an issue finding the response. Please try asking again!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in h-[calc(100vh-100px)] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-text flex items-center gap-2">
            🤖 Dedicated AI Tutor Workspace
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pedagogical AI assistant programmed to guide you with hints and explanations in 7 languages.
          </p>
        </div>

        {/* Controls: Subject & Language Selectors */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-brand-orange-light px-3 py-1.5 rounded-xl border border-orange-200 text-xs font-bold text-brand-orange">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={preferredLanguage}
              onChange={handleLanguageChange}
              className="bg-transparent text-brand-orange font-bold text-xs focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.name} className="text-gray-900 bg-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-1.5 bg-brand-bg px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-brand-text">
            <label className="text-xs font-bold text-gray-400">Subject:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-transparent text-brand-text font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Social Science">Social Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="flex-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-md flex flex-col justify-between overflow-hidden">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                msg.sender === 'user' ? 'bg-brand-orange' : 'bg-brand-text'
              }`}>
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-brand-orange text-white rounded-tr-none'
                  : 'bg-brand-orange-light/30 text-brand-text rounded-tl-none border border-orange-100'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
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
              <div className="w-9 h-9 rounded-2xl bg-brand-orange text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-brand-orange-light/30 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-bold text-gray-500 border border-orange-100">
                <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                <span>Thinking about a hint in {preferredLanguage}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <VoiceMicButton onTranscript={(txt) => handleSend(txt)} languageName={preferredLanguage} />
            <span className="text-[11px] text-gray-400 font-medium">Language: {preferredLanguage}</span>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask a question in ${preferredLanguage} about ${subject}...`}
              className="flex-1 bg-brand-orange-light/40 border border-orange-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50 text-brand-text font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-6 py-3.5 bg-brand-orange text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md shrink-0 text-sm"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default AITutorPage;
