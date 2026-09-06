import React, { useState } from 'react';
import { Mic, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { startSpeechRecognition, isSpeechRecognitionSupported, speakText, stopSpeech, getLangCodeByName } from '../utils/speech';

const VoiceMicButton = ({ onTranscript, textToRead, langCode, languageName = 'English' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [liveSpeechText, setLiveSpeechText] = useState('');

  const activeLangCode = langCode || getLangCodeByName(languageName);

  const handleStartListening = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech Recognition is not supported in this browser. Please type your question.');
      return;
    }

    setIsListening(true);
    setLiveSpeechText('Listening... Speak clearly into your microphone.');

    startSpeechRecognition({
      langCode: activeLangCode,
      onResult: (transcript, isFinal) => {
        setLiveSpeechText(transcript);
        if (onTranscript && isFinal) {
          onTranscript(transcript);
        }
      },
      onError: (err) => {
        console.error('Mic Error:', err);
        setIsListening(false);
        setLiveSpeechText('Voice input stopped.');
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else if (textToRead) {
      setIsPlayingAudio(true);
      speakText(textToRead, activeLangCode);
      const estimatedDuration = Math.max(2000, textToRead.length * 70);
      setTimeout(() => setIsPlayingAudio(false), estimatedDuration);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Microphone Toggle Button (PRD Section 15 Contextual Mic) */}
      <button
        type="button"
        onClick={handleStartListening}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs transition-all shadow-sm ${
          isListening
            ? 'bg-rose-500 text-white mic-active scale-105'
            : 'bg-brand-orange-light text-brand-orange hover:bg-orange-100 border border-orange-200'
        }`}
        title={isListening ? "Listening..." : "Click to Speak"}
      >
        {isListening ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>🎤 Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>🎤 Speak Question</span>
          </>
        )}
      </button>

      {/* Audio Playback Button (Text to Speech) */}
      {textToRead && (
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-colors ${
            isPlayingAudio
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-white text-brand-text border border-orange-200 hover:bg-brand-orange-light'
          }`}
          title="Listen to Explanation"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Playing...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-brand-orange" />
              <span>🔊 Listen</span>
            </>
          )}
        </button>
      )}

      {/* Live transcript badge */}
      {isListening && (
        <span className="text-xs text-brand-orange font-semibold bg-brand-orange-light px-3 py-1 rounded-full border border-orange-200 animate-pulse">
          {liveSpeechText}
        </span>
      )}
    </div>
  );
};

export default VoiceMicButton;
