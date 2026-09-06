import React, { useState } from 'react';
import { Mic, Volume2, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';
import api from '../utils/api';

import { useAuth } from '../context/AuthContext';
const VoiceHelpPage = () => {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVoiceQuery = async (speechText) => {
    setTranscript(speechText);
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', {
        question: speechText, preferredLanguage: user?.preferredLanguage,
        subject: 'General',
        grade: '7'
      });
      setAiResponse(res.data.answer || 'Thank you for your question!');
    } catch (err) {
      console.error('Voice AI error:', err);
      setAiResponse('Sorry, I had a quick error processing your voice question. Please try speaking again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-16 h-16 bg-purple-100 text-brand-purple rounded-3xl flex items-center justify-center mx-auto shadow-md mb-2">
          <Mic className="w-8 h-8" />
        </div>
        <h1 className="font-display font-extrabold text-3xl text-brand-text">
          🎤 Voice Help & Assistance
        </h1>
        <p className="text-sm text-gray-500">
          Speak your question out loud and listen to clear AI audio explanations!
        </p>
      </div>

      {/* Main Mic Card (PRD Section 17 Voice Flow) */}
      <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-xl text-center space-y-6">
        <div className="flex justify-center">
          <VoiceMicButton 
            onTranscript={(text) => handleVoiceQuery(text)} 
            textToRead={aiResponse}
          />
        </div>

        {transcript && (
          <div className="bg-brand-bg p-4 rounded-3xl border border-gray-100 max-w-md mx-auto text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              🗣️ You Said:
            </span>
            <p className="text-sm font-bold text-brand-text">"{transcript}"</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-brand-purple">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing your question...</span>
          </div>
        )}

        {aiResponse && !loading && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-3xl border border-purple-100 text-left space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-purple flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                LearnMate AI Answer:
              </span>
              <VoiceMicButton textToRead={aiResponse} />
            </div>

            <p className="text-sm text-brand-text leading-relaxed whitespace-pre-line font-medium">
              {aiResponse}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default VoiceHelpPage;
